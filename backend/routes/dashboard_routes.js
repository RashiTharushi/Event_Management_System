const express = require("express");
const User = require("../models/User");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const Feedback = require("../models/Feedback");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

// Get dashboard stats + upcoming events
router.get("/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.countDocuments();
    const events = await Event.countDocuments();
    const registrations = await Registration.countDocuments();

    // Upcoming events (next 5 events, ordered by date)
    const upcomingEvents = await Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(5)
      .select("title date location"); // send only needed fields

    res.json({ users, events, registrations, upcomingEvents });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats", error: err.message });
  }
});


router.get("/recent-registrations", async (req, res) => {
  try {
    const registrations = await Registration.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("userId", "username email")
      .populate("eventId", "title date location");

    // Safely handle missing refs
    const recent = registrations
  .filter(r => r.userId && r.eventId) // skip broken references
  .map(r => ({
    id: r._id,
    userName: r.userId?.username || "Unknown User",
    userEmail: r.userId?.email || "Unknown Email",
    eventTitle: r.eventId?.title || "Unknown Event",
    eventDate: r.eventId?.date ? r.eventId.date.toISOString() : null, // <-- convert to ISO string
    registeredAt: r.registeredAt ? r.registeredAt.toISOString() : null, // <-- also make ISO
  }));


    res.json(recent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch recent registrations." });
  }
});

// backend/routes/dashboard_routes.js
router.get("/events", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const events = await Event.find().lean();

    // attach registered count
    const registrations = await Registration.aggregate([
      { $group: { _id: "$eventId", count: { $sum: 1 } } },
    ]);

    const regMap = {};
    registrations.forEach((r) => {
      regMap[r._id] = r.count;
    });

    const eventsWithCounts = events.map((event) => ({
      ...event,
      registered: regMap[event._id] || 0,
    }));

    res.json(eventsWithCounts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events", error: err.message });
  }
});

router.get("/feedbacks", async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("userId", "username email")
      .populate("eventId", "title")
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching feedbacks", error: err.message });
  }
});

module.exports = router;
