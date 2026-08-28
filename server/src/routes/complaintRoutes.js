const express = require('express');
const { body, param } = require('express-validator');
const complaintController = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

// Apply auth protection to all complaint routes
router.use(protect);

// Complaint creation rules
const createComplaintRules = [
  body('title').trim().notEmpty().withMessage('Complaint title is required'),
  body('description').trim().notEmpty().withMessage('Complaint description is required'),
  body('category').isMongoId().withMessage('Valid category ID is required'),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).withMessage('Invalid priority'),
];

// Status update rules
const statusRules = [
  body('status')
    .isIn(['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REOPENED', 'REJECTED'])
    .withMessage('Invalid complaint status'),
  body('resolutionRemarks').optional().trim(),
];

// Assignment rules
const assignRules = [
  body('assignedTo').optional({ nullable: true }).isMongoId().withMessage('Valid faculty user ID is required'),
  body('department').optional({ nullable: true }).isMongoId().withMessage('Valid department ID is required'),
];

// Comment rules
const commentRules = [
  body('message').trim().notEmpty().withMessage('Comment message cannot be empty'),
];

// Feedback rules
const feedbackRules = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
  body('comment').optional().trim(),
];

// Routes
router.get('/', complaintController.getComplaints);
router.post(
  '/',
  authorize('student', 'admin'),
  upload.array('attachments', 5),
  createComplaintRules,
  validate,
  complaintController.createComplaint
);

router.get('/:id', complaintController.getComplaintById);
router.put('/:id', complaintController.updateComplaint);
router.delete('/:id', authorize('admin'), complaintController.deleteComplaint);

router.post('/:id/assign', authorize('admin'), assignRules, validate, complaintController.assignComplaint);
router.post('/:id/status', authorize('admin', 'faculty'), statusRules, validate, complaintController.updateStatus);
router.post('/:id/reopen', authorize('student', 'admin'), complaintController.reopenComplaint);

router.get('/:id/comments', complaintController.getComments);
router.post('/:id/comments', commentRules, validate, complaintController.addComment);

router.get('/:id/timeline', complaintController.getTimeline);
router.post('/:id/feedback', authorize('student'), feedbackRules, validate, complaintController.submitFeedback);

module.exports = router;
