const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Resume = sequelize.define(
    "Resume",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        fileName: {
            type: DataTypes.STRING
        },
        filePath: {
            type: DataTypes.STRING
        },
        extractedText: {
            type: DataTypes.TEXT("long")
        },
        profileId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        }

    },

    {
        timestamps: true
    }
);

module.exports = Resume;