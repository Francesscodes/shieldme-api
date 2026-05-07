// ============================================================
// routes/comment.routes.js
// ============================================================

const express = require('express');
const router = express.Router();
const { addComment, deleteComment } = require('../controllers/comment.controller');
const { protect } = require('../middlewares/auth.middleware');

// POST /api/comments/:reportId  → Add a comment to a specific report
router.post('/:reportId', protect, addComment);

// DELETE /api/comments/:id      → Delete a comment by its own ID
router.delete('/:id', protect, deleteComment);

module.exports = router;