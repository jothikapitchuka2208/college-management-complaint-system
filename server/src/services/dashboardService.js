const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const User = require('../models/User');

const getStudentDashboard = async (userId) => {
  const [total, pending, inProgress, resolved, closed, recentComplaints, recentNotifications] =
    await Promise.all([
      Complaint.countDocuments({ submittedBy: userId }),
      Complaint.countDocuments({ submittedBy: userId, status: 'PENDING' }),
      Complaint.countDocuments({
        submittedBy: userId,
        status: { $in: ['ASSIGNED', 'IN_PROGRESS', 'REOPENED'] },
      }),
      Complaint.countDocuments({ submittedBy: userId, status: 'RESOLVED' }),
      Complaint.countDocuments({ submittedBy: userId, status: 'CLOSED' }),
      Complaint.find({ submittedBy: userId })
        .populate('category', 'name')
        .populate('department', 'name')
        .populate('assignedTo', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
      Notification.find({ owner: userId }).sort({ createdAt: -1 }).limit(5),
    ]);

  return {
    metrics: {
      total,
      pending,
      inProgress,
      resolved,
      closed,
    },
    recentComplaints,
    recentNotifications,
  };
};

const getFacultyDashboard = async (user) => {
  const userId = user._id;
  const deptId = user.department;

  const baseFilter = {
    $or: [{ assignedTo: userId }, ...(deptId ? [{ department: deptId, assignedTo: null }] : [])],
  };

  const [assigned, pending, inProgress, resolved, urgent, recentComplaints, recentNotifications] =
    await Promise.all([
      Complaint.countDocuments(baseFilter),
      Complaint.countDocuments({ ...baseFilter, status: 'ASSIGNED' }),
      Complaint.countDocuments({ ...baseFilter, status: { $in: ['IN_PROGRESS', 'REOPENED'] } }),
      Complaint.countDocuments({ ...baseFilter, status: { $in: ['RESOLVED', 'CLOSED'] } }),
      Complaint.countDocuments({ ...baseFilter, priority: 'URGENT', status: { $ne: 'CLOSED' } }),
      Complaint.find(baseFilter)
        .populate('category', 'name')
        .populate('department', 'name')
        .populate('submittedBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(6),
      Notification.find({ owner: userId }).sort({ createdAt: -1 }).limit(5),
    ]);

  return {
    metrics: {
      assigned,
      pending,
      inProgress,
      resolved,
      urgent,
    },
    recentComplaints,
    recentNotifications,
  };
};

const getAdminDashboard = async () => {
  const [
    total,
    pending,
    inProgress,
    resolved,
    closed,
    urgent,
    recentComplaints,
    categoryBreakdown,
    departmentBreakdown,
    statusBreakdown,
    priorityBreakdown,
    recentUsers,
  ] = await Promise.all([
    Complaint.countDocuments(),
    Complaint.countDocuments({ status: 'PENDING' }),
    Complaint.countDocuments({ status: { $in: ['ASSIGNED', 'IN_PROGRESS', 'REOPENED'] } }),
    Complaint.countDocuments({ status: 'RESOLVED' }),
    Complaint.countDocuments({ status: 'CLOSED' }),
    Complaint.countDocuments({ priority: 'URGENT', status: { $nin: ['CLOSED', 'RESOLVED'] } }),
    Complaint.find()
      .populate('category', 'name')
      .populate('department', 'name')
      .populate('submittedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(6),
    Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'cat' } },
      { $unwind: '$cat' },
      { $project: { name: '$cat.name', count: 1 } },
      { $sort: { count: -1 } },
    ]),
    Complaint.aggregate([
      { $match: { department: { $ne: null } } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'dept' } },
      { $unwind: '$dept' },
      { $project: { name: '$dept.name', count: 1 } },
      { $sort: { count: -1 } },
    ]),
    Complaint.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Complaint.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
    User.find().select('-password').sort({ createdAt: -1 }).limit(5),
  ]);

  // Compute resolution metrics
  const resolvedCount = resolved + closed;
  const resolutionRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;

  return {
    metrics: {
      total,
      pending,
      inProgress,
      resolved,
      closed,
      urgent,
      resolutionRate,
    },
    recentComplaints,
    categoryBreakdown,
    departmentBreakdown,
    statusBreakdown: statusBreakdown.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {}),
    priorityBreakdown: priorityBreakdown.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {}),
    recentUsers,
  };
};

module.exports = {
  getStudentDashboard,
  getFacultyDashboard,
  getAdminDashboard,
};
