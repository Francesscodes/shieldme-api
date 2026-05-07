// ============================================================
// models/index.js — The Sequelize "hub".
// This file creates ONE shared database connection and imports
// ALL models so they can be associated with each other.
// ============================================================

const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// Create the Sequelize instance with our DB credentials from .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false, // Set to console.log to see raw SQL queries during debugging
  }
);

// --- Import Model Definitions ---
// We pass `sequelize` and `DataTypes` into each model factory function
const User = require('./user.model')(sequelize, DataTypes);
const Report = require('./report.model')(sequelize, DataTypes);
const Comment = require('./comment.model')(sequelize, DataTypes);
const Follow = require('./follow.model')(sequelize, DataTypes);

// ============================================================
// DATABASE ASSOCIATIONS — WHY THEY MATTER
// ============================================================
// Associations tell Sequelize how tables relate to each other.
// This lets you do powerful queries like:
//   report.getComments() — get all comments for a report
//   user.getReports()   — get all reports by a user
//
// Think of it like defining the "rules" of the relationship:
//   - A User can write MANY Reports   → User.hasMany(Report)
//   - A Report belongs to ONE User    → Report.belongsTo(User)
//   - The `foreignKey` is the column that links them (user_id in reports table)
// ============================================================

// A User can author many Reports
User.hasMany(Report, { foreignKey: 'user_id', as: 'reports', onDelete: 'CASCADE' });
// Each Report was authored by one User
Report.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

// A User can write many Comments
User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments', onDelete: 'CASCADE' });
// Each Comment was written by one User
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'commenter' });

// A Report can have many Comments
Report.hasMany(Comment, { foreignKey: 'report_id', as: 'comments', onDelete: 'CASCADE' });
// Each Comment belongs to one Report
Comment.belongsTo(Report, { foreignKey: 'report_id', as: 'report' });

// --- Follow (Many-to-Many) Association ---
// A User can follow MANY Reports, and a Report can be followed by MANY Users.
// This is a Many-to-Many relationship, handled through the `follows` junction table.
User.belongsToMany(Report, { through: Follow, foreignKey: 'user_id', as: 'followedReports' });
Report.belongsToMany(User, { through: Follow, foreignKey: 'report_id', as: 'followers' });

// Export everything needed by other parts of the app
module.exports = { sequelize, User, Report, Comment, Follow };