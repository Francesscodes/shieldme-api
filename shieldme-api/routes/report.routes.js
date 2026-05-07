const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createReport, getAllReports, getReportById,
  updateReportStatus, toggleFollowReport, deleteReport,
} = require('../controllers/report.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const reportValidation = [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('description').trim().notEmpty().withMessage('Description is required.'),
  body('category')
    .isIn(['Road', 'Flooding', 'Waste Management', 'Street Lighting', 'Water Supply', 'Other'])
    .withMessage('Invalid category.'),
  body('lga').notEmpty().withMessage('LGA is required.'),
];

router.route('/')
  .get(getAllReports)
  .post(protect, reportValidation, createReport);

router.route('/:id')
  .get(getReportById)
  .delete(protect, deleteReport);

router.patch('/:id/status', protect, authorize('admin'), updateReportStatus);
router.post('/:id/follow', protect, toggleFollowReport);

module.exports = router;