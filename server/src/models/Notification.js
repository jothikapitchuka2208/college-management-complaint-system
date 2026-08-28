const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      default: null,
    },
    type: {
      type: String,
      enum: [
        'COMPLAINT_SUBMITTED',
        'COMPLAINT_ASSIGNED',
        'STATUS_CHANGED',
        'COMPLAINT_RESOLVED',
        'COMPLAINT_REOPENED',
        'COMPLAINT_CLOSED',
        'COMPLAINT_REJECTED',
        'COMMENT_ADDED',
        'PRIORITY_CHANGED',
        'GENERAL',
      ],
      default: 'GENERAL',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
