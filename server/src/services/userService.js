const User = require('../models/User');
const { ApiError } = require('../middleware/errorMiddleware');

const getAllUsers = async (query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.role) {
    filter.role = query.role;
  }
  if (query.department) {
    filter.department = query.department;
  }
  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === 'true' || query.isActive === true;
  }
  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');
    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .populate('department', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    users,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

const getUserById = async (id) => {
  const user = await User.findById(id).populate('department', 'name description');
  if (!user) {
    throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
  }
  return user;
};

const createUser = async (data) => {
  const existing = await User.findOne({ email: data.email.toLowerCase() });
  if (existing) {
    throw new ApiError('User with this email already exists', 400, 'DUPLICATE_EMAIL');
  }

  const user = await User.create({
    name: data.name,
    email: data.email.toLowerCase(),
    password: data.password,
    role: data.role || 'faculty',
    department: data.department || null,
  });

  return await User.findById(user._id).populate('department', 'name');
};

const updateUser = async (id, data) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
  }

  if (data.name) user.name = data.name;
  if (data.role) user.role = data.role;
  if (data.department !== undefined) user.department = data.department || null;
  if (data.isActive !== undefined) user.isActive = data.isActive;
  if (data.password) user.password = data.password;

  await user.save();
  return await User.findById(user._id).populate('department', 'name');
};

const updateUserStatus = async (id, isActive) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
  }
  user.isActive = isActive;
  await user.save();
  return user;
};

const updateUserRole = async (id, role) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
  }
  user.role = role;
  await user.save();
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
  }
  user.isActive = false;
  await user.save();
  return { message: 'User deactivated successfully' };
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserStatus,
  updateUserRole,
  deleteUser,
};
