const express = require("express");
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

// Register for an event
router.post("/:eventId", authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // Check if already registered
    const existing = await Registration.findOne({ userId, eventId });
    if (existing) return res.status(400).json({ message: "Already registered for this event" });

    // Check event capacity
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.registrantsCount >= event.capacity) {
      return res.status(400).json({ message: "Event is full" });
    }

    // Create registration
    const registration = new Registration({ userId, eventId });
    await registration.save();

    // Increment registrants count
    event.registrantsCount += 1;
    await event.save();

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering", error: err.message });
  }
});

// Get all events the user registered for
router.get("/my-events", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const registrations = await Registration.find({ userId }).populate("eventId");
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: "Error fetching registrations", error: err.message });
  }
});

// Get all users registered for an event (admin only)
router.get("/:eventId", authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;

    const registrations = await Registration.find({ eventId })
      .populate("userId", "username email")   // <-- use username, not name
      .populate("eventId", "title date location");

    res.json(registrations);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching registered users",
      error: err.message,
    });
  }
});

// delete registration for an event
router.delete("/:eventId", authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const registration = await Registration.findOneAndDelete({ userId, eventId });
    if (!registration) return res.status(404).json({ message: "Registration not found" });

    // decrement registrants count
    await Event.findByIdAndUpdate(eventId, { $inc: { registrantsCount: -1 } });

    res.json({ message: "Registration cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error cancelling registration", error: err.message });
  }
});

module.exports = router;
