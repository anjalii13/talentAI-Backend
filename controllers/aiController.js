const { GoogleGenerativeAI } = require("@google/generative-ai");

const Profile = require("../models/ProfileModel");
const Skill = require("../models/SkillModel");
const Project = require("../models/ProjectModel");
const Resume = require("../models/ResumeModel");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const askAI = async (req, res) => {
  try {

    const { question } = req.body;

    const profile = await Profile.findOne({
      where: { userId: req.user.id }
    });
if (!req.user || !req.user.id) {
  return res.status(401).json({
    success: false,
    message: "Unauthorized - missing user"
  });
}
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    const skills = await Skill.findAll({
      where: { profileId: profile.id }
    });

    const projects = await Project.findAll({
      where: { profileId: profile.id }
    });

    const resume = await Resume.findOne({
      where: { profileId: profile.id }
    });
    console.log(
      "Resume Length:",
      resume?.extractedText?.length
    );

    const prompt = `
You are an AI assistant representing a job candidate.

Candidate Profile:
Name: ${profile?.User?.name}
Title: ${profile.title}
Location: ${profile.location}
Experience: ${profile.experienceYears}

Skills:
${skills.map(s => s.name).join(", ")}

Projects:
${projects.map(p => `${p.title} - ${p.description}`).join("\n")}

Resume:
${(resume?.extractedText || "").slice(0, 3000)}

Instructions:
- Answer ONLY using the information provided above.
- The resume contains the most complete information.
- Use information from the resume whenever available.
- If multiple projects exist in the resume, list ALL of them.
- Do not make up information.
- If information is unavailable, say:
"I could not find that information in the candidate profile."

Question:
${question}
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(
      prompt
    );

    const answer =
      result.response.text();

    return res.status(200).json({
      success: true,
      answer
    });


  } catch (error) {
    console.error(error);
    if (
      error.message &&
      error.message.includes("503")
    ) {
      return res.status(503).json({
        success: false,
        message:
          "AI service is busy. Please try again in a few seconds."
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const suggestSkills = async (req, res) => {
  try {

    const profile = await Profile.findOne({
      where: {
        userId: req.user.id
      }
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    const skills = await Skill.findAll({
      where: {
        profileId: profile.id
      }
    });

    const prompt = `
You are a career advisor.

Based on this profile, suggest exactly 10 technical skills.

Return ONLY a JSON array.

Profile:
Title: ${profile.title}
Experience: ${profile.experienceYears}
Bio: ${profile.bio}

Existing Skills:
${skills.map(s => s.name).join(", ")}
`;

    try {

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite"
      });

      const result =
        await model.generateContent(prompt);

      const text =
        result.response.text();

      return res.json({
        success: true,
        suggestions: JSON.parse(text)
      });

    } catch (aiError) {

      console.log("Gemini unavailable. Using fallback.");

      const fallback = {
        "Frontend Developer": [
          "React",
          "Next.js",
          "TypeScript",
          "Redux",
          "Tailwind CSS",
          "Bootstrap",
          "Jest",
          "HTML5",
          "CSS3",
          "Git"
        ],

        "Backend Developer": [
          "Node.js",
          "Express.js",
          "MongoDB",
          "MySQL",
          "PostgreSQL",
          "Docker",
          "Redis",
          "REST API",
          "JWT",
          "AWS"
        ],

        "Full Stack Developer": [
          "React",
          "Node.js",
          "Express.js",
          "MongoDB",
          "MySQL",
          "TypeScript",
          "Docker",
          "AWS",
          "Git",
          "REST API"
        ],

        "default": [
          "JavaScript",
          "React",
          "Node.js",
          "Express.js",
          "MongoDB",
          "Git",
          "Docker",
          "SQL",
          "REST API",
          "AWS"
        ]
      };

      let suggestions =
        fallback.default;

      const title =
        (profile.title || "").toLowerCase();

      if (title.includes("frontend"))
        suggestions =
          fallback["Frontend Developer"];

      else if (title.includes("backend"))
        suggestions =
          fallback["Backend Developer"];

      else if (title.includes("full"))
        suggestions =
          fallback["Full Stack Developer"];

      const existing =
        skills.map(s =>
          s.name.toLowerCase()
        );

      suggestions =
        suggestions.filter(
          s =>
            !existing.includes(
              s.toLowerCase()
            )
        );

      return res.json({
        success: true,
        suggestions
      });

    }

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message
    });

  }
};
module.exports = {
  askAI,suggestSkills
};