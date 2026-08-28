const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

// Apply protect to all user routes
router.use(protect);

const createUserRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['student', 'faculty', 'admin']).withMessage('Invalid role'),
];

router.get('/', authorize('admin'), userController.getAllUsers);
router.post('/', authorize('admin'), createUserRules, validate, userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', authorize('admin'), userController.updateUser);
router.patch('/:id/status', authorize('admin'), userController.updateUserStatus);
router.patch('/:id/role', authorize('admin'), userController.updateUserRole);
router.delete('/:id', authorize('admin'), userController.deleteUser);

module.exports = router;
