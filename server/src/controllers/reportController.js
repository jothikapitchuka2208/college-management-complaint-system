const reportService = require('../services/reportService');

const getComplaintsReport = async (req, res, next) => {
  try {
    const data = await reportService.getComplaintsReport(req.query);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getDepartmentsReport = async (req, res, next) => {
  try {
    const data = await reportService.getDepartmentsReport();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getCategoriesReport = async (req, res, next) => {
  try {
    const data = await reportService.getCategoriesReport();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getResolutionReport = async (req, res, next) => {
  try {
    const data = await reportService.getResolutionReport();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getComplaintsReport,
  getDepartmentsReport,
  getCategoriesReport,
  getResolutionReport,
};
