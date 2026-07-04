const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SavedJob = sequelize.define(
  "SavedJob",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    jobId: {
      type: DataTypes.STRING,
      allowNull: false
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    company: {
      type: DataTypes.STRING
    },

    location: {
      type: DataTypes.STRING
    },

    applyLink: {
      type: DataTypes.TEXT
    }
  },
  {
    timestamps: true
  }
);

module.exports = SavedJob;