// ============================================================
// controllers/comment.controller.js — Comment Logic
// ============================================================

const { Comment, User } = require('../models');

// @desc    Add a comment to a report
// @route   POST /api/comments/:reportId
// @access  Private
const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    const comment = await Comment.create({
      content,
      user_id: req.user.id,
      report_id: req.params.reportId,
    });

    // Re-fetch the comment with the commenter's name for the response
    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: 'commenter', attributes: ['id', 'name'] }],
    });

    res.status(201).json({ success: true, data: commentWithUser });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join('. ') });
    }
    res.status(500).json({ success: false, message: 'Failed to add comment.' });
  }
};

// @desc    Delete a comment (owner or admin only)
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found.' });
    }

    // Only the comment author or an admin can delete it
    if (comment.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You are not authorized to delete this comment.' });
    }

    await comment.destroy();
    res.status(200).json({ success: true, message: 'Comment deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete comment.' });
  }
};

module.exports = { addComment, deleteComment };