const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { ApiError } = require('../middleware/errorMiddleware');

const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError('An account with this email already exists', 400, 'DUPLICATE_EMAIL');
  }

  // Public registration is always for students
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: 'student',
  });

  const token = generateToken(user);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      createdAt: user.createdAt,
    },
    token,
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new ApiError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  if (!user.isActive) {
    throw new ApiError('This account has been deactivated. Please contact support.', 403, 'FORBIDDEN');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    },
    token,
  };
};

const getMe = async (userId) => {
  const user = await User.findById(userId).populate('department', 'name description');
  if (!user) {
    throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
  }
  return user;
};

const updateProfile = async (userId, updateData) => {
  const allowedUpdates = ['name'];
  const updates = {};
  for (const key of allowedUpdates) {
    if (updateData[key] !== undefined) {
      updates[key] = updateData[key];
    }
  }

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  }).populate('department', 'name');

  return user;
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError('Current password does not match', 400, 'INVALID_CREDENTIALS');
  }

  user.password = newPassword;
  await user.save();

  return { message: 'Password updated successfully' };
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
};
