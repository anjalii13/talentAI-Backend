const fs = require("fs");
const pdfParse = require("pdf-parse");

const Resume = require("../models/ResumeModel");
const Profile = require("../models/ProfileModel");

const uploadResume = async (req, res) => {
  try {

    const { profileId } = req.params;

    const profile = await Profile.findOne({
      where: {
        id: profileId,
        userId: req.user.id
      }
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file"
      });
    }

    const pdfBuffer = fs.readFileSync(
      req.file.path
    );

    const pdfData = await pdfParse(
      pdfBuffer
    );

    const existingResume =
      await Resume.findOne({
        where: {
          profileId
        }
      });

    if (existingResume) {

      // Delete old PDF file
      if (existingResume.filePath &&fs.existsSync(existingResume.filePath)) {
        fs.unlinkSync(existingResume.filePath);
      }

      await existingResume.update({
        fileName: req.file.originalname,
        filePath: req.file.path,
        extractedText: pdfData.text
      });

      return res.status(200).json({
        success: true,
        message: "Resume updated successfully",
        resume: existingResume
      });
    }

    const resume = await Resume.create({
      fileName: req.file.originalname,
      filePath: req.file.path,
      extractedText: pdfData.text,
      profileId
    });

    return res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      resume
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

module.exports = {
  uploadResume
};