const { Server } = require('socket.io');
const { verifyToken } = require('../utils/jwt');
const logger = require('../utils/logger');

let io = null;

const initSocket = (httpServer, clientUrl) => {
  io = new Server(httpServer, {
    cors: {
      origin: clientUrl || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Socket authentication middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) {
        return next(new Error('Authentication token missing'));
      }
      const decoded = verifyToken(token);
      socket.user = decoded;
      next();
    } catch (err) {
      logger.warn('Socket authentication failed:', err.message);
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user?.id;
    const role = socket.user?.role;
    logger.info(`[Socket] User connected: ${userId} (${role}), Socket ID: ${socket.id}`);

    // Join personal user room for private notifications
    if (userId) {
      socket.join(`user_${userId}`);
    }

    // Join role room (e.g. 'role_admin', 'role_faculty')
    if (role) {
      socket.join(`role_${role}`);
    }

    // Join complaint room for live comments/updates
    socket.on('join_complaint', (complaintId) => {
      socket.join(`complaint_${complaintId}`);
      logger.info(`[Socket] User ${userId} joined complaint room: complaint_${complaintId}`);
    });

    socket.on('leave_complaint', (complaintId) => {
      socket.leave(`complaint_${complaintId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`[Socket] User disconnected: ${userId}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    logger.warn('[Socket] Attempted to get IO instance before initialization');
  }
  return io;
};

// Helper to emit notification to a specific user
const emitNotificationToUser = (userId, notification) => {
  if (io && userId) {
    io.to(`user_${userId}`).emit('notification', notification);
  }
};

// Helper to emit complaint update to room
const emitComplaintUpdate = (complaintId, data) => {
  if (io && complaintId) {
    io.to(`complaint_${complaintId}`).emit('complaint_update', data);
    io.emit('complaint_list_refresh', { complaintId, ...data });
  }
};

module.exports = {
  initSocket,
  getIO,
  emitNotificationToUser,
  emitComplaintUpdate,
};
