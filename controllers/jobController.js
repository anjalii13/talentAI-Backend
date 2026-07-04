const axios = require("axios");

const searchJobs = async (req, res) => {
  try {

    const keyword =
      req.query.keyword || "Developer";

    const APP_ID =
      process.env.ADZUNA_APP_ID;

    const APP_KEY =
      process.env.ADZUNA_APP_KEY;

    const url =
      `https://api.adzuna.com/v1/api/jobs/in/search/1` +
      `?app_id=${APP_ID}` +
      `&app_key=${APP_KEY}` +
      `&results_per_page=20` +
      `&what=${encodeURIComponent(keyword)}`;

    const response =
      await axios.get(url);

    const jobs =
      response.data.results.map(job => ({
        id: job.id,
        title: job.title,
        company:
          job.company?.display_name ||
          "Unknown Company",
        location:
          job.location?.display_name ||
          "Unknown Location",
        salaryMin:
          job.salary_min,
        salaryMax:
          job.salary_max,
        description:
          job.description,
        redirectUrl:
          job.redirect_url
      }));

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.response?.data ||
        error.message
    });

  }
};

module.exports = {
  searchJobs
};