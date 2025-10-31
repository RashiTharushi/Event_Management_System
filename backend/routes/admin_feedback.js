const express = require("express");
const Feedback = require("../models/Feedback");
const Event = require("../models/Event");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// GET all feedback with event details
router.get("/", adminMiddleware, async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("eventId", "title date")
      .populate("userId", "name email");

    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching feedback", error: err });
  }
});

router.post("/:eventId", authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const feedback = new Feedback({
      userId: req.user._id,
      eventId: req.params.eventId,
      rating,
      comment,
    });
    await feedback.save();
    res.json({ message: "Feedback submitted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error submitting feedback", error: err.message });
  }
});

// Get feedback for an event
router.get("/:eventId", async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ eventId: req.params.eventId })
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching feedback", error: err.message });
  }
});

module.exports = router;
