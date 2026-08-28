const Category = require('../models/Category');
const { ApiError } = require('../middleware/errorMiddleware');

const getAllCategories = async (query = {}) => {
  const filter = {};
  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === 'true' || query.isActive === true;
  }
  return await Category.find(filter).sort({ name: 1 });
};

const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError('Category not found', 404, 'INVALID_CATEGORY');
  }
  return category;
};

const createCategory = async (data) => {
  const existing = await Category.findOne({ name: { $regex: new RegExp(`^${data.name}$`, 'i') } });
  if (existing) {
    throw new ApiError('A category with this name already exists', 400, 'DUPLICATE_KEY');
  }
  return await Category.create(data);
};

const updateCategory = async (id, data) => {
  const category = await Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new ApiError('Category not found', 404, 'INVALID_CATEGORY');
  }
  return category;
};

const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError('Category not found', 404, 'INVALID_CATEGORY');
  }
  category.isActive = !category.isActive;
  await category.save();
  return category;
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
