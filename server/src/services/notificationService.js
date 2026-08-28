const Notification = require('../models/Notification');
const { emitNotificationToUser } = require('../config/socket');
const { ApiError } = require('../middleware/errorMiddleware');

const createNotification = async ({ owner, complaintId, type, title, message }) => {
  try {
    const notification = await Notification.create({
      owner,
      complaintId,
      type,
      title,
      message,
    });

    // Real-time socket delivery
    emitNotificationToUser(owner.toString(), notification);

    return notification;
  } catch (err) {
    console.error('[NotificationService] Error creating notification:', err);
    return null;
  }
};

const getUserNotifications = async (userId, query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filter = { owner: userId };
  if (query.isRead !== undefined) {
    filter.isRead = query.isRead === 'true' || query.isRead === true;
  }

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter)
      .populate('complaintId', 'complaintNumber title status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments(filter),
    Notification.countDocuments({ owner: userId, isRead: false }),
  ]);

  return {
    notifications,
    total,
    page,
    pages: Math.ceil(total / limit),
    unreadCount,
  };
};

const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({ _id: notificationId, owner: userId });
  if (!notification) {
    throw new ApiError('Notification not found', 404, 'NOT_FOUND');
  }

  notification.isRead = true;
  await notification.save();
  return notification;
};

const markAllAsRead = async (userId) => {
  await Notification.updateMany({ owner: userId, isRead: false }, { $set: { isRead: true } });
  return { message: 'All notifications marked as read' };
};

const getUnreadCount = async (userId) => {
  const count = await Notification.countDocuments({ owner: userId, isRead: false });
  return { unreadCount: count };
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
};
