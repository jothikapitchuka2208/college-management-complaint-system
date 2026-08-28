const express = require('express');
const { body } = require('express-validator');
const departmentController = require('../controllers/departmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

// Public/authenticated can view departments
router.get('/', departmentController.getAllDepartments);
router.get('/:id', departmentController.getDepartmentById);

// Admin-only mutations
router.post(
  '/',
  protect,
  authorize('admin'),
  [body('name').trim().notEmpty().withMessage('Department name is required')],
  validate,
  departmentController.createDepartment
);

router.put('/:id', protect, authorize('admin'), departmentController.updateDepartment);
router.delete('/:id', protect, authorize('admin'), departmentController.deleteDepartment);

module.exports = router;
