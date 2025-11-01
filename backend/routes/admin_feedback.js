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

    // Check if user is attached
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const { rating, comment } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Optionally check if event exists
    const eventExists = await Event.findById(req.params.eventId);
    if (!eventExists) {
      return res.status(404).json({ message: "Event not found" });
    }

    const feedback = new Feedback({
      userId: req.user.id,
      eventId: req.params.eventId,
      rating,
      comment,
    });

    await feedback.save();

    res.json({ message: "Feedback submitted successfully!" });
  } catch (err) {
    console.error("Error saving feedback:", err);
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
