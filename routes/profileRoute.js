const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  CreateProfile,
  getProfileById,
  EditProfile,
  getAllProfiles,
  searchProfiles,
  toggleVisibility,
  getMyProfile,
  deleteProfile
} = require("../controllers/profileController");

// create profile
router.post("/", authMiddleware, CreateProfile);

// search
router.get("/search", searchProfiles);

// single profile per user (REPLACES my-profiles)
router.get("/me", authMiddleware, getMyProfile);

// visibility toggle (admin/owner use)
router.put("/visibility/:id", authMiddleware, toggleVisibility);

// keep only for admin/debug if needed
router.get("/:id", getProfileById);

// update profile
router.put("/:id", authMiddleware, EditProfile);

// delete profile
router.delete("/:id", authMiddleware, deleteProfile);

module.exports = router;