const departmentService = require('../services/departmentService');

const getAllDepartments = async (req, res, next) => {
  try {
    const departments = await departmentService.getAllDepartments(req.query);
    res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    next(error);
  }
};

const getDepartmentById = async (req, res, next) => {
  try {
    const department = await departmentService.getDepartmentById(req.params.id);
    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

const createDepartment = async (req, res, next) => {
  try {
    const department = await departmentService.createDepartment(req.body);
    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const department = await departmentService.updateDepartment(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDepartment = async (req, res, next) => {
  try {
    const department = await departmentService.deleteDepartment(req.params.id);
    res.status(200).json({
      success: true,
      message: `Department ${department.isActive ? 'activated' : 'deactivated'} successfully`,
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
