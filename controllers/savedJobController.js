const SavedJob =require("../models/SavedJobModel");

const saveJob = async (
  req,
  res
) => {

  try {

    const {
      jobId,
      title,
      company,
      location,
      applyLink
    } = req.body;

    const existing =
      await SavedJob.findOne({
        where: {
          userId: req.user.id,
          jobId
        }
      });

    if (existing) {

      return res.status(400).json({
        success: false,
        message:
          "Job already saved"
      });

    }

    const job =
      await SavedJob.create({
        jobId,
        title,
        company,
        location,
        applyLink,
        userId: req.user.id
      });

    return res.status(201).json({
      success: true,
      job
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
const getSavedJobs =
  async (req, res) => {

    try {

      const jobs =
        await SavedJob.findAll({
          where: {
            userId:
              req.user.id
          },
          order: [
            ["createdAt", "DESC"]
          ]
        });

      return res.json({
        success: true,
        jobs
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };
  const deleteSavedJob =
  async (req, res) => {

    try {

      const job =
        await SavedJob.findOne({
          where: {
            id: req.params.id,
            userId:
              req.user.id
          }
        });

      if (!job) {

        return res.status(404).json({
          success: false,
          message:
            "Job not found"
        });

      }

      await job.destroy();

      return res.json({
        success: true,
        message:
          "Job removed"
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };
  module.exports = {
  saveJob,
  getSavedJobs,
  deleteSavedJob
};