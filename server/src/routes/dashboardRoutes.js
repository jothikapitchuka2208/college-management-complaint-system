const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', dashboardController.getDashboard);
router.get('/student', authorize('student', 'admin'), dashboardController.getStudentDashboard);
router.get('/faculty', authorize('faculty', 'admin'), dashboardController.getFacultyDashboard);
router.get('/admin', authorize('admin'), dashboardController.getAdminDashboard);

module.exports = router;
