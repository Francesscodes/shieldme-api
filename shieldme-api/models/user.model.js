// ============================================================
// models/user.model.js — Defines the shape of the Users table.
// ============================================================

const bcrypt = require('bcryptjs');

// We export a FUNCTION that takes sequelize & DataTypes.
// This pattern is called a "model factory" — it's the standard Sequelize pattern.
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Name cannot be empty.' },
        },
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: { msg: 'This email address is already registered.' },
        validate: {
          isEmail: { msg: 'Please provide a valid email address.' },
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: { args: [6, 255], msg: 'Password must be at least 6 characters.' },
        },
      },
      role: {
        type: DataTypes.ENUM('citizen', 'admin'),
        defaultValue: 'citizen',
      },
    },
    {
      tableName: 'users',       // Maps to the exact table name in your SQL
      timestamps: true,          // Enables createdAt and updatedAt
      underscored: true,         // Uses snake_case (created_at) instead of camelCase
      // --- HOOKS ---
      // A "hook" is a function that runs automatically at a specific lifecycle event.
      // beforeCreate runs just before a new User row is saved to the DB.
      // We use it to HASH the password so we never store plain text passwords.
      hooks: {
        beforeCreate: async (user) => {
          const salt = await bcrypt.genSalt(10); // 10 rounds of salting
          user.password = await bcrypt.hash(user.password, salt);
        },
        beforeUpdate: async (user) => {
          // Only re-hash if the password field was actually changed
          if (user.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  // Instance method: Attach a method to every User object for comparing passwords
  // Usage: const isMatch = await user.comparePassword(plainTextPassword)
  User.prototype.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  return User;
};