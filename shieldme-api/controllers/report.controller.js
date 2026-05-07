const { Report, User, Comment, Follow } = require('../models');

const createReport = async (req, res) => {
  try {
    const { title, description, category, lga } = req.body;
    const report = await Report.create({
      title, description, category, lga, user_id: req.user.id,
    });
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join('. ') });
    }
    res.status(500).json({ success: false, message: 'Failed to create report.' });
  }
};

const getAllReports = async (req, res) => {
  try {
    const { lga, status, category } = req.query;
    const where = {};
    if (lga) where.lga = lga;
    if (status) where.status = status;
    if (category) where.category = category;
    const reports = await Report.findAll({
      where,
      include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email'] }],
      order: [['created_at', 'DESC']],
    });
    res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reports.' });
  }
};

const getReportById = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'name'] },
        {
          model: Comment, as: 'comments',
          include: [{ model: User, as: 'commenter', attributes: ['id', 'name'] }],
        },
      ],
    });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch report.' });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'In-Review', 'Resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
    }
    const report = await Report.findByPk(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });
    report.status = status;
    await report.save();
    res.status(200).json({ success: true, message: `Status updated to '${status}'.`, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update status.' });
  }
};

const toggleFollowReport = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });
    const existingFollow = await Follow.findOne({
      where: { user_id: req.user.id, report_id: req.params.id },
    });
    if (existingFollow) {
      await existingFollow.destroy();
      return res.status(200).json({ success: true, message: 'You have unfollowed this report.' });
    } else {
      await Follow.create({ user_id: req.user.id, report_id: req.params.id });
      return res.status(201).json({ success: true, message: 'You are now following this report.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle follow.' });
  }
};

const deleteReport = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });
    if (report.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this report.' });
    }
    await report.destroy();
    res.status(200).json({ success: true, message: 'Report deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete report.' });
  }
};

module.exports = { createReport, getAllReports, getReportById, updateReportStatus, toggleFollowReport, deleteReport };