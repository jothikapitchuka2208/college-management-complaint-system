const express = require('express');
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/complaints', reportController.getComplaintsReport);
router.get('/departments', reportController.getDepartmentsReport);
router.get('/categories', reportController.getCategoriesReport);
router.get('/resolution', reportController.getResolutionReport);

module.exports = router;
