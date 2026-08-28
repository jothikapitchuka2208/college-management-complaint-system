const { verifyToken } = require('../utils/jwt');
const { ApiError } = require('./errorMiddleware');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError('Authentication token missing or malformed', 401, 'UNAUTHORIZED');
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw new ApiError('User account associated with token not found', 401, 'USER_NOT_FOUND');
    }

    if (!user.isActive) {
      throw new ApiError('User account has been deactivated', 403, 'FORBIDDEN');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  protect,
};
