const Profile = require("../models/ProfileModel");
const User = require("../models/UserModel");
const Skill = require("../models/SkillModel");
const Project = require("../models/ProjectModel");
const Resume = require("../models/ResumeModel");
const fs = require("fs");

// ================= CREATE PROFILE =================
const CreateProfile = async (req, res) => {
  try {
    const { title,
  location,
  bio,
  experienceYears,
  currentPosition,
  currentCompany,
  education,
  linkedinUrl,
  githubUrl } = req.body;

    // ENFORCE 1:1 RULE
    const existing = await Profile.findOne({
      where: { userId: req.user.id }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists for this user"
      });
    }

    const profile = await Profile.create({
      title,
      location,
      bio,
      experienceYears,
  currentPosition,
  currentCompany,
  education,
  linkedinUrl,
  githubUrl ,
      userId: req.user.id
    });

    return res.status(201).json({
      success: true,
      profile
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= GET MY PROFILE (NEW MAIN API) =================
const getMyProfile = async (req, res) => {
  try {
    

   let profile = await Profile.findOne({
  where: { userId: req.user.id },
  include: [Skill, Project, Resume]
});

if (!profile) {
  profile = await Profile.create({
    userId: req.user.id,
    title: "",
    bio: "",
    location: "",
    experienceYears: 0,
    experienceYears:"",
  currentPosition:"",
  currentCompany:"",
  education:"",
  linkedinUrl:"",
  githubUrl :""
  });
}

    return res.status(200).json({
      success: true,
      profile
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= GET PROFILE BY ID (ADMIN ONLY / DEBUG) =================
const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.params.id, {
      include: [User, Skill, Project, Resume]
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    return res.status(200).json({
      success: true,
      profile
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= EDIT PROFILE =================
const EditProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    await profile.update(req.body);

    return res.status(200).json({
      success: true,
      profile
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= GET ALL PROFILES =================
const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.findAll({
      where: { isPublic: true },
      include: [Skill, Project]
    });

    return res.status(200).json({
      success: true,
      profiles
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= SEARCH PROFILES =================
const searchProfiles = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Keyword is required"
      });
    }

    const profiles = await Profile.findAll({
      where: { isPublic: true },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"]
        },
        Skill,
        Project
      ]
    });

    const search = keyword.toLowerCase();

    const filtered = profiles.filter((p) => {
      const nameMatch = p.User?.name?.toLowerCase().includes(search);
      const titleMatch = p.title?.toLowerCase().includes(search);

      const skillMatch = p.Skills?.some(s =>
        s.name?.toLowerCase().includes(search)
      );

      const projectMatch = p.Projects?.some(pr =>
        pr.title?.toLowerCase().includes(search)
      );

      return nameMatch || titleMatch || skillMatch || projectMatch;
    });

    return res.status(200).json({
      success: true,
      count: filtered.length,
      profiles: filtered
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= TOGGLE VISIBILITY =================
const toggleVisibility = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
      
    });
console.log(req.user);
console.log(req.params.id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    profile.isPublic = !profile.isPublic;
    await profile.save();

    return res.json({
      success: true,
      isPublic: profile.isPublic
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= DELETE PROFILE =================
const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    const resume = await Resume.findOne({
      where: { profileId: profile.id }
    });

    if (resume?.filePath && fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }

    await Resume.destroy({ where: { profileId: profile.id } });
    await Skill.destroy({ where: { profileId: profile.id } });
    await Project.destroy({ where: { profileId: profile.id } });

    await profile.destroy();

    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  CreateProfile,
  getMyProfile,
  getProfileById,
  EditProfile,
  getAllProfiles,
  searchProfiles,
  toggleVisibility,
  deleteProfile
};