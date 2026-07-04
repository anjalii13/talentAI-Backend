const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Project = sequelize.define(
  "Project",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    description: {
      type: DataTypes.TEXT
    },

    techStack: {
      type: DataTypes.STRING
    },

    githubLink: {
      type: DataTypes.STRING
    }
  },
  {
    timestamps: true
  }
);

module.exports = Project;