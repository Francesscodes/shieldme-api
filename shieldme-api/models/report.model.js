// ============================================================
// models/report.model.js — Defines the shape of the Reports table.
// ============================================================

// List of all 20 Lagos LGAs for validation
const LAGOS_LGAS = [
  'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa',
  'Badagry', 'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye',
  'Ikeja', 'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland',
  'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere',
];

module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define(
    'Report',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Report title cannot be empty.' },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Report description cannot be empty.' },
        },
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: false,
        // You can expand this ENUM as needed
        validate: {
          isIn: {
            args: [['Road', 'Flooding', 'Waste Management', 'Street Lighting', 'Water Supply', 'Other']],
            msg: 'Invalid category selected.',
          },
        },
      },
      // --- Lagos-Specific Field ---
      // This is the key civic feature: every report is tagged to a specific LGA
      lga: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          isIn: {
            args: [LAGOS_LGAS],
            msg: 'Please select a valid Lagos LGA.',
          },
        },
      },
      status: {
        type: DataTypes.ENUM('Pending', 'In-Review', 'Resolved'),
        defaultValue: 'Pending',
      },
      // user_id is the FOREIGN KEY — it links this report to the user who created it
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'reports',
      timestamps: true,
      underscored: true,
    }
  );

  return Report;
};