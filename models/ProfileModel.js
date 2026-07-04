const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Profile = sequelize.define(
  "Profile",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING
    },

    location: {
      type: DataTypes.STRING
    },

    bio: {
      type: DataTypes.TEXT
    },

    experienceYears: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    currentPosition: {
      type: DataTypes.STRING
    },

    currentCompany: {
      type: DataTypes.STRING
    },

    education: {
      type: DataTypes.STRING
    },

    linkedinUrl: {
      type: DataTypes.STRING
    },

    githubUrl: {
      type: DataTypes.STRING
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }

  },
  {
    timestamps: true
  }
);

module.exports = Profile;