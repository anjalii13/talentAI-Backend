const Project = require("../models/ProjectModel");
const Profile = require("../models/ProfileModel");

const CreateProject = async (req, res) => {
  try {
    const {
      title,
      description,
      techStack,
      githubLink
    } = req.body;

    // 🔥 GET PROFILE FROM USER
    const profile = await Profile.findOne({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    const project = await Project.create({
      title,
      description,
      techStack,
      githubLink,
      profileId: profile.id
    });

    return res.status(201).json({
      success: true,
      project
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const DeleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    await project.destroy();

    return res.status(200).json({
      success: true,
      message: "Project deleted"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  CreateProject,
  DeleteProject
};