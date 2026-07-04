const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  askAI,suggestSkills
} = require("../controllers/aiController");

router.post(
  "/chat",authMiddleware,
  askAI
);
router.get(
  "/suggest-skills",
  authMiddleware,
  suggestSkills
);
module.exports = router;