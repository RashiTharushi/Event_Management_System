const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { authMiddleware } = require("../middleware/auth");
const Registration = require("../models/Registration");

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads/profiles");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage for profile pics
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}${ext}`);
  },
});
const upload = multer({ storage });

/**
 * Get logged-in user profile
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
});

/**
 * Update profile details (name, email, profileImage)
 */
router.put("/", authMiddleware, upload.single("profileImage"), async (req, res) => {
  try {
    const { name, email } = req.body;
    const updates = { name, email };

    if (req.file) {
      updates.profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
});

/**
 * Change password
 */
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error changing password", error: err.message });
  }
});

// Get recent activity (registrations)
router.get("/activity", authMiddleware, async (req, res) => {
  try {
    const activities = await Registration.find({ userId: req.user.id })
      .populate("eventId", "title date location")
      .sort({ createdAt: -1 }) // latest first
      .limit(5);

    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: "Error fetching activity", error: err.message });
  }
});
module.exports = router;
