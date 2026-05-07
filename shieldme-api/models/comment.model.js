// ============================================================
// models/comment.model.js — Defines the shape of the Comments table.
// ============================================================

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Comment content cannot be empty.' },
        },
      },
      // Foreign Keys — linking comments to their owner and their report
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      report_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'comments',
      timestamps: true,
      underscored: true,
      // Comments only need createdAt, not updatedAt (you can't edit comments)
      updatedAt: false,
    }
  );

  return Comment;
};