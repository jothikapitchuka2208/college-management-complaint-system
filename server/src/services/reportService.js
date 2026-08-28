const Complaint = require('../models/Complaint');
const Department = require('../models/Department');
const Category = require('../models/Category');

const getComplaintsReport = async (query = {}) => {
  const filter = {};
  if (query.startDate && query.endDate) {
    filter.createdAt = {
      $gte: new Date(query.startDate),
      $lte: new Date(query.endDate),
    };
  }

  const [total, statusStats, priorityStats, avgResolutionTime] = await Promise.all([
    Complaint.countDocuments(filter),
    Complaint.aggregate([
      { $match: filter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Complaint.aggregate([
      { $match: filter },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]),
    Complaint.aggregate([
      {
        $match: {
          ...filter,
          resolvedAt: { $ne: null },
        },
      },
      {
        $project: {
          durationHours: {
            $divide: [{ $subtract: ['$resolvedAt', '$createdAt'] }, 1000 * 60 * 60],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgHours: { $avg: '$durationHours' },
        },
      },
    ]),
  ]);

  return {
    total,
    statusStats,
    priorityStats,
    avgResolutionHours: avgResolutionTime[0] ? Math.round(avgResolutionTime[0].avgHours * 10) / 10 : 0,
  };
};

const getDepartmentsReport = async () => {
  return await Complaint.aggregate([
    { $match: { department: { $ne: null } } },
    {
      $group: {
        _id: '$department',
        total: { $sum: 1 },
        resolved: {
          $sum: { $cond: [{ $in: ['$status', ['RESOLVED', 'CLOSED']] }, 1, 0] },
        },
        pending: {
          $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] },
        },
        inProgress: {
          $sum: { $cond: [{ $in: ['$status', ['ASSIGNED', 'IN_PROGRESS', 'REOPENED']] }, 1, 0] },
        },
      },
    },
    {
      $lookup: {
        from: 'departments',
        localField: '_id',
        foreignField: '_id',
        as: 'department',
      },
    },
    { $unwind: '$department' },
    {
      $project: {
        name: '$department.name',
        total: 1,
        resolved: 1,
        pending: 1,
        inProgress: 1,
        resolutionRate: {
          $cond: [
            { $gt: ['$total', 0] },
            { $round: [{ $multiply: [{ $divide: ['$resolved', '$total'] }, 100] }, 0] },
            0,
          ],
        },
      },
    },
    { $sort: { total: -1 } },
  ]);
};

const getCategoriesReport = async () => {
  return await Complaint.aggregate([
    {
      $group: {
        _id: '$category',
        total: { $sum: 1 },
        resolved: {
          $sum: { $cond: [{ $in: ['$status', ['RESOLVED', 'CLOSED']] }, 1, 0] },
        },
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' },
    {
      $project: {
        name: '$category.name',
        total: 1,
        resolved: 1,
        resolutionRate: {
          $cond: [
            { $gt: ['$total', 0] },
            { $round: [{ $multiply: [{ $divide: ['$resolved', '$total'] }, 100] }, 0] },
            0,
          ],
        },
      },
    },
    { $sort: { total: -1 } },
  ]);
};

const getResolutionReport = async () => {
  const complaints = await Complaint.find({ feedback: { $exists: true, $ne: null } })
    .populate('submittedBy', 'name email')
    .populate('department', 'name')
    .populate('assignedTo', 'name')
    .select('complaintNumber title feedback status createdAt resolvedAt')
    .sort({ 'feedback.createdAt': -1 });

  const avgRating =
    complaints.length > 0
      ? Math.round(
          (complaints.reduce((sum, c) => sum + (c.feedback?.rating || 0), 0) / complaints.length) *
            10
        ) / 10
      : 0;

  return {
    totalFeedbacks: complaints.length,
    averageRating: avgRating,
    feedbacks: complaints,
  };
};

module.exports = {
  getComplaintsReport,
  getDepartmentsReport,
  getCategoriesReport,
  getResolutionReport,
};
