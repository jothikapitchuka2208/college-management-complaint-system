const { validationResult } = require('express-validator');
const { ApiError } = require('./errorMiddleware');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));
    return next(
      new ApiError('Validation failed on request inputs', 400, 'VALIDATION_ERROR', formattedErrors)
    );
  }
  next();
};

module.exports = {
  validate,
};
