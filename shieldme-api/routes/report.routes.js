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

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Civic issue reports
 */

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get all reports (filter by lga, status, category)
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: lga
 *         schema:
 *           type: string
 *         example: Ikeja
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, In-Review, Resolved]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reports
 *   post:
 *     summary: File a new civic report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, category, lga]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Flooded road on Ago Palace Way
 *               description:
 *                 type: string
 *                 example: Road has been flooded for 3 days
 *               category:
 *                 type: string
 *                 enum: [Road, Flooding, Waste Management, Street Lighting, Water Supply, Other]
 *               lga:
 *                 type: string
 *                 example: Oshodi-Isolo
 *     responses:
 *       201:
 *         description: Report created successfully
 *       401:
 *         description: Unauthorized
 */
router.route('/').get(getAllReports).post(protect, reportValidation, createReport);

/**
 * @swagger
 * /api/reports/{id}:
 *   get:
 *     summary: Get a single report with comments
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Report details
 *       404:
 *         description: Report not found
 *   delete:
 *     summary: Delete a report (owner or admin)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Report deleted
 *       403:
 *         description: Not authorized
 */
router.route('/:id').get(getReportById).delete(protect, deleteReport);

/**
 * @swagger
 * /api/reports/{id}/status:
 *   patch:
 *     summary: Update report status (Admin only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, In-Review, Resolved]
 *     responses:
 *       200:
 *         description: Status updated
 *       403:
 *         description: Admins only
 */
router.patch('/:id/status', protect, authorize('admin'), updateReportStatus);

/**
 * @swagger
 * /api/reports/{id}/follow:
 *   post:
 *     summary: Follow or unfollow a report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Unfollowed successfully
 *       201:
 *         description: Followed successfully
 */
router.post('/:id/follow', protect, toggleFollowReport);

module.exports = router;