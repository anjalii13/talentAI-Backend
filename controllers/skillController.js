const Skill = require("../models/SkillModel");
const Profile = require("../models/ProfileModel");

const CreateSkills = async (req, res) => {
  try {
    const { name } = req.body;

    // 🔥 FIND PROFILE FROM USER
    const profile = await Profile.findOne({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    const skill = await Skill.create({
      name,
      profileId: profile.id
    });
console.log("USER ID:", req.user?.id);
    return res.status(201).json({
      success: true,
      skill
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const DeleteSkills = async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found"
      });
    }

    await skill.destroy();

    return res.json({
      success: true,
      message: "Skill deleted"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  CreateSkills,
  DeleteSkills
};