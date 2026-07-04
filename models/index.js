const User = require("./UserModel");
const Profile = require("./ProfileModel");
const Skill = require("./SkillModel");
const Project = require("./ProjectModel");
const Resume = require("./ResumeModel");
const SavedJob =require("./SavedJobModel");

// USER ↔ PROFILE

User.hasOne(Profile, {
  foreignKey: "userId",
  onDelete: "CASCADE"
});

Profile.belongsTo(User, {
  foreignKey: "userId"
});

// PROFILE ↔ SKILL

Profile.hasMany(Skill, {
  foreignKey: "profileId",
  onDelete: "CASCADE"
});

Skill.belongsTo(Profile, {
  foreignKey: "profileId"
});

// PROFILE ↔ PROJECT

Profile.hasMany(Project, {
  foreignKey: "profileId",
  onDelete: "CASCADE"
});

Project.belongsTo(Profile, {
  foreignKey: "profileId"
});

// PROFILE ↔ RESUME

Profile.hasOne(Resume, {
  foreignKey: "profileId",
  onDelete: "CASCADE"
});

Resume.belongsTo(Profile, {
  foreignKey: "profileId"
});
User.hasMany(SavedJob, {
  foreignKey: "userId",
  onDelete: "CASCADE"
});

SavedJob.belongsTo(User, {
  foreignKey: "userId"
});
module.exports = {
  User,
  Profile,
  Skill,
  Project,
  Resume,SavedJob
};