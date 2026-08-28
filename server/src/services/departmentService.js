const Department = require('../models/Department');
const { ApiError } = require('../middleware/errorMiddleware');

const getAllDepartments = async (query = {}) => {
  const filter = {};
  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === 'true' || query.isActive === true;
  }
  return await Department.find(filter).populate('head', 'name email').sort({ name: 1 });
};

const getDepartmentById = async (id) => {
  const department = await Department.findById(id).populate('head', 'name email');
  if (!department) {
    throw new ApiError('Department not found', 404, 'INVALID_DEPARTMENT');
  }
  return department;
};

const createDepartment = async (data) => {
  const existing = await Department.findOne({ name: { $regex: new RegExp(`^${data.name}$`, 'i') } });
  if (existing) {
    throw new ApiError('A department with this name already exists', 400, 'DUPLICATE_KEY');
  }
  return await Department.create(data);
};

const updateDepartment = async (id, data) => {
  const department = await Department.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate('head', 'name email');

  if (!department) {
    throw new ApiError('Department not found', 404, 'INVALID_DEPARTMENT');
  }
  return department;
};

const deleteDepartment = async (id) => {
  const department = await Department.findById(id);
  if (!department) {
    throw new ApiError('Department not found', 404, 'INVALID_DEPARTMENT');
  }
  // Soft toggle or delete
  department.isActive = !department.isActive;
  await department.save();
  return department;
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
