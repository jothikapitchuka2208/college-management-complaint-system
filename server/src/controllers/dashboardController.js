const dashboardService = require('../services/dashboardService');

const getDashboard = async (req, res, next) => {
  try {
    let data;
    if (req.user.role === 'student') {
      data = await dashboardService.getStudentDashboard(req.user._id);
    } else if (req.user.role === 'faculty') {
      data = await dashboardService.getFacultyDashboard(req.user);
    } else {
      data = await dashboardService.getAdminDashboard();
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getStudentDashboard(req.user._id);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getFacultyDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getFacultyDashboard(req.user);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getAdminDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getAdminDashboard();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getStudentDashboard,
  getFacultyDashboard,
  getAdminDashboard,
};
