// ============================================================
// models/follow.model.js — The "Junction Table" for follows.
// ============================================================
// A junction table (also called a pivot table) is what enables
// a Many-to-Many relationship. It sits BETWEEN the users and
// reports tables, storing one row per unique user-report pair.
//
// Example row: { user_id: 3, report_id: 7 }
// This means "User #3 is following Report #7"
// ============================================================

module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define(
    'Follow',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
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
      tableName: 'follows',
      timestamps: true,
      underscored: true,
      updatedAt: false,
      // The UNIQUE constraint prevents a user from following the same report twice
      indexes: [
        { unique: true, fields: ['user_id', 'report_id'] },
      ],
    }
  );

  return Follow;
};