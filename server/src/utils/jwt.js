const jwt = require('jsonwebtoken');
const env = require('../config/env');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      department: user.department || null,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, env.jwtSecret);
};

module.exports = {
  generateToken,
  verifyToken,
};
