const complaintService = require('../services/complaintService');

const createComplaint = async (req, res, next) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    const complaint = await complaintService.createComplaint(req.body, req.user, files);
    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

const getComplaints = async (req, res, next) => {
  try {
    const result = await complaintService.getComplaints(req.query, req.user);
    res.status(200).json({
      success: true,
      data: result.complaints,
      pagination: {
        total: result.total,
        page: result.page,
        pages: result.pages,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await complaintService.getComplaintById(req.params.id, req.user);
    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

const updateComplaint = async (req, res, next) => {
  try {
    const complaint = await complaintService.updateComplaint(req.params.id, req.body, req.user);
    res.status(200).json({
      success: true,
      message: 'Complaint updated successfully',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

const assignComplaint = async (req, res, next) => {
  try {
    const complaint = await complaintService.assignComplaint(req.params.id, req.body, req.user);
    res.status(200).json({
      success: true,
      message: 'Complaint assigned successfully',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const complaint = await complaintService.updateStatus(req.params.id, req.body, req.user);
    res.status(200).json({
      success: true,
      message: 'Complaint status updated successfully',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

const reopenComplaint = async (req, res, next) => {
  try {
    const complaint = await complaintService.reopenComplaint(req.params.id, req.body, req.user);
    res.status(200).json({
      success: true,
      message: 'Complaint reopened successfully',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const comment = await complaintService.addComment(req.params.id, req.body, req.user);
    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

const getComments = async (req, res, next) => {
  try {
    const comments = await complaintService.getComments(req.params.id, req.user);
    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

const getTimeline = async (req, res, next) => {
  try {
    const logs = await complaintService.getTimeline(req.params.id, req.user);
    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

const submitFeedback = async (req, res, next) => {
  try {
    const complaint = await complaintService.submitFeedback(req.params.id, req.body, req.user);
    res.status(200).json({
      success: true,
      message: 'Thank you! Feedback recorded successfully.',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

const deleteComplaint = async (req, res, next) => {
  try {
    const result = await complaintService.deleteComplaint(req.params.id, req.user);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
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
