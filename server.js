const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/db");
require("./models/ProfileModel");
require("./models/ProjectModel")
require("./models/ResumeModel")
require("./models/UserModel")
require("./models/SkillModel")
require("./models/index")
const path = require("path");
const aiRoutes =require("./routes/aiRoute");
const authRoutes = require("./routes/authRoute");
const profileRoutes = require("./routes/profileRoute");
const projectRoutes = require("./routes/projectRoute");
const skillRoutes = require("./routes/skillRoute");
const resumeRoutes =require("./routes/resumeRoute");
const jobRoutes =require("./routes/jobRoutes")
const savedJobRoutes =require("./routes/savedJobRoutes");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://talent-ai-frontend-eight.vercel.app/"],
    credentials: true
  })
);



app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/project", projectRoutes);
app.use("/skill", skillRoutes);
app.use("/resume",resumeRoutes);
app.use("/ai", aiRoutes);
app.use("/jobs",jobRoutes);
app.use("/uploads",express.static(path.join(__dirname, "uploads")));
app.use("/saved-jobs",savedJobRoutes);

app.get("/", (req, res) => {
  res.send("TalentAI Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});