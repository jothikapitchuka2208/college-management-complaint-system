const express = require('express');
const { body } = require('express-validator');
const categoryController = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

// Public/authenticated can view categories
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Admin-only mutations
router.post(
  '/',
  protect,
  authorize('admin'),
  [body('name').trim().notEmpty().withMessage('Category name is required')],
  validate,
  categoryController.createCategory
);

router.put('/:id', protect, authorize('admin'), categoryController.updateCategory);
router.delete('/:id', protect, authorize('admin'), categoryController.deleteCategory);

module.exports = router;
