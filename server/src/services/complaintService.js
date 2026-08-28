const Complaint = require('../models/Complaint');
const ComplaintLog = require('../models/ComplaintLog');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Category = require('../models/Category');
const Department = require('../models/Department');
const { generateComplaintNumber } = require('../utils/complaintNumber');
const { createNotification } = require('./notificationService');
const { emitComplaintUpdate } = require('../config/socket');
const { ApiError } = require('../middleware/errorMiddleware');

// Helper to log complaint action in audit trail
const logComplaintAction = async ({ complaintId, userId, action, oldValue = null, newValue = null, metadata = {} }) => {
  try {
    return await ComplaintLog.create({
      complaintId,
      userId,
      action,
      oldValue,
      newValue,
      metadata,
    });
  } catch (err) {
    console.error('[ComplaintService] Error creating audit log:', err);
  }
};

const createComplaint = async (data, user, files = []) => {
  const { title, description, category, priority } = data;

  const categoryDoc = await Category.findById(category);
  if (!categoryDoc) {
    throw new ApiError('Selected complaint category does not exist', 400, 'INVALID_CATEGORY');
  }

  // Format attachments
  const attachments = files.map((f) => ({
    filename: f.filename,
    originalName: f.originalname,
    path: f.path.replace(/\\/g, '/'),
    mimetype: f.mimetype,
    size: f.size,
  }));

  const complaintNumber = await generateComplaintNumber();

  const complaint = await Complaint.create({
    complaintNumber,
    title,
    description,
    category,
    priority: priority || 'MEDIUM',
    status: 'PENDING',
    submittedBy: user._id,
    attachments,
  });

  // Create initial audit log
  await logComplaintAction({
    complaintId: complaint._id,
    userId: user._id,
    action: 'Complaint Created',
    newValue: {
      complaintNumber,
      status: 'PENDING',
      priority: complaint.priority,
    },
    metadata: { title },
  });

  // Notify Admins
  const admins = await User.find({ role: 'admin', isActive: true });
  for (const admin of admins) {
    await createNotification({
      owner: admin._id,
      complaintId: complaint._id,
      type: 'COMPLAINT_SUBMITTED',
      title: 'New Complaint Submitted',
      message: `New complaint ${complaintNumber}: "${title}" submitted by ${user.name}`,
    });
  }

  // Real-time broadcast
  emitComplaintUpdate(complaint._id.toString(), { action: 'CREATED', complaint });

  return await getComplaintById(complaint._id, user);
};

const getComplaints = async (query = {}, user) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 15;
  const skip = (page - 1) * limit;

  const filter = {};

  // Role Scoping
  if (user.role === 'student') {
    filter.submittedBy = user._id;
  } else if (user.role === 'faculty') {
    filter.$or = [
      { assignedTo: user._id },
      ...(user.department ? [{ department: user.department, assignedTo: null }] : []),
    ];
  }
  // Admins see all

  // Filters
  if (query.status) {
    filter.status = query.status;
  }
  if (query.priority) {
    filter.priority = query.priority;
  }
  if (query.category) {
    filter.category = query.category;
  }
  if (query.department) {
    filter.department = query.department;
  }
  if (query.assignedTo) {
    filter.assignedTo = query.assignedTo;
  }
  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');
    filter.$or = [
      { complaintNumber: searchRegex },
      { title: searchRegex },
      { description: searchRegex },
    ];
  }

  // Sorting
  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;

  const [complaints, total] = await Promise.all([
    Complaint.find(filter)
      .populate('category', 'name')
      .populate('department', 'name')
      .populate('submittedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    Complaint.countDocuments(filter),
  ]);

  return {
    complaints,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

const getComplaintById = async (id, user) => {
  const complaint = await Complaint.findById(id)
    .populate('category', 'name description')
    .populate('department', 'name description')
    .populate('submittedBy', 'name email role department')
    .populate('assignedTo', 'name email role department');

  if (!complaint) {
    throw new ApiError('Complaint not found', 404, 'COMPLAINT_NOT_FOUND');
  }

  // Role validation
  if (user.role === 'student' && complaint.submittedBy._id.toString() !== user._id.toString()) {
    throw new ApiError('You are not authorized to view this complaint', 403, 'FORBIDDEN');
  }

  if (
    user.role === 'faculty' &&
    complaint.assignedTo?._id?.toString() !== user._id.toString() &&
    (!user.department || complaint.department?._id?.toString() !== user.department.toString())
  ) {
    throw new ApiError('You are not authorized to view this complaint', 403, 'FORBIDDEN');
  }

  return complaint;
};

const updateComplaint = async (id, updateData, user) => {
  const complaint = await Complaint.findById(id);
  if (!complaint) {
    throw new ApiError('Complaint not found', 404, 'COMPLAINT_NOT_FOUND');
  }

  // Only Admin or submitter before assignment can update fields
  if (user.role === 'student' && complaint.status !== 'PENDING') {
    throw new ApiError('Complaints cannot be edited after assignment or processing', 400, 'FORBIDDEN');
  }

  const oldPriority = complaint.priority;
  if (updateData.priority && updateData.priority !== oldPriority) {
    complaint.priority = updateData.priority;
    await logComplaintAction({
      complaintId: complaint._id,
      userId: user._id,
      action: 'Priority Changed',
      oldValue: oldPriority,
      newValue: updateData.priority,
    });
  }

  if (updateData.title) complaint.title = updateData.title;
  if (updateData.description) complaint.description = updateData.description;
  if (updateData.category) complaint.category = updateData.category;
  if (updateData.department) complaint.department = updateData.department;

  await complaint.save();
  return await getComplaintById(complaint._id, user);
};

const assignComplaint = async (id, { assignedTo, department }, user) => {
  const complaint = await Complaint.findById(id);
  if (!complaint) {
    throw new ApiError('Complaint not found', 404, 'COMPLAINT_NOT_FOUND');
  }

  let facultyUser = null;
  if (assignedTo) {
    facultyUser = await User.findById(assignedTo);
    if (!facultyUser || facultyUser.role !== 'faculty') {
      throw new ApiError('Selected assignee must be a valid active faculty member', 400, 'USER_NOT_FOUND');
    }
  }

  if (department) {
    const deptDoc = await Department.findById(department);
    if (!deptDoc) {
      throw new ApiError('Selected department not found', 400, 'INVALID_DEPARTMENT');
    }
    complaint.department = department;
  }

  const oldAssignedTo = complaint.assignedTo;
  complaint.assignedTo = assignedTo || null;
  
  const oldStatus = complaint.status;
  if (complaint.status === 'PENDING' && assignedTo) {
    complaint.status = 'ASSIGNED';
  }

  await complaint.save();

  // Audit log
  await logComplaintAction({
    complaintId: complaint._id,
    userId: user._id,
    action: 'Complaint Assigned',
    oldValue: { assignedTo: oldAssignedTo, status: oldStatus },
    newValue: { assignedTo, status: complaint.status, department: complaint.department },
    metadata: { assignedByName: user.name, facultyName: facultyUser?.name },
  });

  // Notifications
  if (assignedTo) {
    await createNotification({
      owner: assignedTo,
      complaintId: complaint._id,
      type: 'COMPLAINT_ASSIGNED',
      title: 'New Complaint Assigned',
      message: `Complaint ${complaint.complaintNumber}: "${complaint.title}" has been assigned to you.`,
    });
  }

  await createNotification({
    owner: complaint.submittedBy,
    complaintId: complaint._id,
    type: 'COMPLAINT_ASSIGNED',
    title: 'Complaint Assigned',
    message: `Your complaint ${complaint.complaintNumber} has been assigned to ${facultyUser ? facultyUser.name : 'department staff'}.`,
  });

  emitComplaintUpdate(complaint._id.toString(), { action: 'ASSIGNED', complaint });

  return await getComplaintById(complaint._id, user);
};

const updateStatus = async (id, { status, resolutionRemarks }, user) => {
  const complaint = await Complaint.findById(id);
  if (!complaint) {
    throw new ApiError('Complaint not found', 404, 'COMPLAINT_NOT_FOUND');
  }

  const allowedStatuses = [
    'PENDING',
    'ASSIGNED',
    'IN_PROGRESS',
    'RESOLVED',
    'CLOSED',
    'REOPENED',
    'REJECTED',
  ];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(`Invalid status: ${status}`, 400, 'INVALID_COMPLAINT_STATUS');
  }

  // Role permissions on status changes
  if (user.role === 'student') {
    throw new ApiError('Students cannot directly modify complaint status', 403, 'FORBIDDEN');
  }

  if (user.role === 'faculty') {
    if (complaint.assignedTo?.toString() !== user._id.toString()) {
      throw new ApiError('You can only update complaints assigned to you', 403, 'FORBIDDEN');
    }
    // Faculty can move to IN_PROGRESS or RESOLVED
    if (!['IN_PROGRESS', 'RESOLVED'].includes(status)) {
      throw new ApiError('Faculty can only transition status to IN_PROGRESS or RESOLVED', 403, 'FORBIDDEN');
    }
  }

  const oldStatus = complaint.status;
  complaint.status = status;

  if (resolutionRemarks !== undefined) {
    complaint.resolutionRemarks = resolutionRemarks;
  }

  if (status === 'RESOLVED') {
    complaint.resolvedAt = new Date();
  } else if (status === 'CLOSED') {
    complaint.closedAt = new Date();
  }

  await complaint.save();

  // Audit log
  await logComplaintAction({
    complaintId: complaint._id,
    userId: user._id,
    action: `Status Changed to ${status}`,
    oldValue: oldStatus,
    newValue: status,
    metadata: { resolutionRemarks: resolutionRemarks || complaint.resolutionRemarks },
  });

  // Notify student
  let notifType = 'STATUS_CHANGED';
  if (status === 'RESOLVED') notifType = 'COMPLAINT_RESOLVED';
  if (status === 'CLOSED') notifType = 'COMPLAINT_CLOSED';
  if (status === 'REJECTED') notifType = 'COMPLAINT_REJECTED';

  await createNotification({
    owner: complaint.submittedBy,
    complaintId: complaint._id,
    type: notifType,
    title: `Complaint ${status}`,
    message: `Your complaint ${complaint.complaintNumber} status has been updated to "${status}".`,
  });

  emitComplaintUpdate(complaint._id.toString(), { action: 'STATUS_CHANGED', status, complaint });

  return await getComplaintById(complaint._id, user);
};

const reopenComplaint = async (id, { reason }, user) => {
  const complaint = await Complaint.findById(id);
  if (!complaint) {
    throw new ApiError('Complaint not found', 404, 'COMPLAINT_NOT_FOUND');
  }

  if (complaint.submittedBy.toString() !== user._id.toString() && user.role !== 'admin') {
    throw new ApiError('Only the student who submitted the complaint or an admin can reopen it', 403, 'FORBIDDEN');
  }

  if (complaint.status !== 'RESOLVED' && complaint.status !== 'CLOSED') {
    throw new ApiError('Only resolved or closed complaints can be reopened', 400, 'INVALID_COMPLAINT_STATUS');
  }

  const oldStatus = complaint.status;
  complaint.status = 'REOPENED';
  await complaint.save();

  await logComplaintAction({
    complaintId: complaint._id,
    userId: user._id,
    action: 'Complaint Reopened',
    oldValue: oldStatus,
    newValue: 'REOPENED',
    metadata: { reason },
  });

  // Notify assigned faculty
  if (complaint.assignedTo) {
    await createNotification({
      owner: complaint.assignedTo,
      complaintId: complaint._id,
      type: 'COMPLAINT_REOPENED',
      title: 'Complaint Reopened',
      message: `Complaint ${complaint.complaintNumber} has been reopened with reason: "${reason || 'Unsatisfied resolution'}"`,
    });
  }

  emitComplaintUpdate(complaint._id.toString(), { action: 'REOPENED', complaint });

  return await getComplaintById(complaint._id, user);
};

const addComment = async (id, { message }, user) => {
  const complaint = await Complaint.findById(id);
  if (!complaint) {
    throw new ApiError('Complaint not found', 404, 'COMPLAINT_NOT_FOUND');
  }

  // Authorization check
  if (user.role === 'student' && complaint.submittedBy.toString() !== user._id.toString()) {
    throw new ApiError('Not authorized to comment on this complaint', 403, 'FORBIDDEN');
  }

  const comment = await Comment.create({
    complaintId: id,
    author: user._id,
    message,
  });

  await logComplaintAction({
    complaintId: complaint._id,
    userId: user._id,
    action: 'Comment Added',
    metadata: { authorName: user.name, role: user.role },
  });

  // Notify parties
  if (user.role === 'student' && complaint.assignedTo) {
    await createNotification({
      owner: complaint.assignedTo,
      complaintId: complaint._id,
      type: 'COMMENT_ADDED',
      title: 'New Comment from Student',
      message: `Student commented on ${complaint.complaintNumber}: "${message.substring(0, 60)}..."`,
    });
  } else if (user.role === 'faculty' || user.role === 'admin') {
    await createNotification({
      owner: complaint.submittedBy,
      complaintId: complaint._id,
      type: 'COMMENT_ADDED',
      title: 'New Comment from College Staff',
      message: `${user.name} (${user.role}) commented on ${complaint.complaintNumber}: "${message.substring(0, 60)}..."`,
    });
  }

  const populatedComment = await Comment.findById(comment._id).populate('author', 'name email role');
  emitComplaintUpdate(complaint._id.toString(), { action: 'NEW_COMMENT', comment: populatedComment });

  return populatedComment;
};

const getComments = async (id, user) => {
  // Check access to complaint first
  await getComplaintById(id, user);
  return await Comment.find({ complaintId: id })
    .populate('author', 'name email role')
    .sort({ createdAt: 1 });
};

const getTimeline = async (id, user) => {
  await getComplaintById(id, user);
  return await ComplaintLog.find({ complaintId: id })
    .populate('userId', 'name email role')
    .sort({ createdAt: 1 });
};

const submitFeedback = async (id, { rating, comment }, user) => {
  const complaint = await Complaint.findById(id);
  if (!complaint) {
    throw new ApiError('Complaint not found', 404, 'COMPLAINT_NOT_FOUND');
  }

  if (complaint.submittedBy.toString() !== user._id.toString()) {
    throw new ApiError('Only the student who submitted this complaint can provide feedback', 403, 'FORBIDDEN');
  }

  if (!['RESOLVED', 'CLOSED'].includes(complaint.status)) {
    throw new ApiError('Feedback can only be provided after a complaint is resolved or closed', 400, 'INVALID_COMPLAINT_STATUS');
  }

  complaint.feedback = {
    rating: Number(rating),
    comment: comment || '',
    createdAt: new Date(),
  };

  await complaint.save();

  await logComplaintAction({
    complaintId: complaint._id,
    userId: user._id,
    action: 'Feedback Submitted',
    newValue: { rating, comment },
  });

  return await getComplaintById(complaint._id, user);
};

const deleteComplaint = async (id, user) => {
  const complaint = await Complaint.findById(id);
  if (!complaint) {
    throw new ApiError('Complaint not found', 404, 'COMPLAINT_NOT_FOUND');
  }

  // Only Admin can delete complaints
  if (user.role !== 'admin') {
    throw new ApiError('Only administrators can delete complaints', 403, 'FORBIDDEN');
  }

  await Complaint.findByIdAndDelete(id);
  await Comment.deleteMany({ complaintId: id });
  await ComplaintLog.deleteMany({ complaintId: id });

  return { message: 'Complaint and associated records deleted successfully' };
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  assignComplaint,
  updateStatus,
  reopenComplaint,
  addComment,
  getComments,
  getTimeline,
  submitFeedback,
  deleteComplaint,
};
