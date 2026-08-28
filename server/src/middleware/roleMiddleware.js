const { ApiError } = require('./errorMiddleware');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError('Authentication required', 401, 'UNAUTHORIZED'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          `Access forbidden: Role '${req.user.role}' is not authorized to access this resource`,
          403,
          'FORBIDDEN'
        )
      );
    }

    next();
  };
};

module.exports = {
  authorize,
};
