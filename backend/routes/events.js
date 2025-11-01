const express = require("express");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

// Get all events (public)
router.get("/", async (req, res) => {
  try {
    const { search, location, date } = req.query;
    const query = {};

    // Title search
    if (search) query.title = { $regex: search, $options: "i" };

    // Location filter
    if (location) query.location = { $regex: location, $options: "i" };

    // Date filter
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1); // filter for that specific day
      query.date = { $gte: start, $lt: end };
    }

    const events = await Event.find(query).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events", error: err.message });
  }
});


// Get single event by ID
// Make sure this route is protected by your auth middleware
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // ✅ Check if user is already registered
    const isRegistered = await Registration.findOne({
      userId: req.user.id,
      eventId: req.params.id
    });

    res.json({
      ...event.toObject(),
      isRegistered: !!isRegistered // Converts to true/false
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching event", error: err.message });
  }
});



// Create event (admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, date, location, capacity } = req.body;
    const event = new Event({
      title,
      description,
      date,
      location,
      capacity,
      createdBy: req.user.id
    });
    await event.save();
    res.status(201).json({ message: "Event created successfully", event });
  } catch (err) {
    res.status(500).json({ message: "Error creating event", error: err.message });
  }
});

// Update event (admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: "Error updating event", error: err.message });
  }
});

// Delete event (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting event", error: err.message });
  }
});

module.exports = router;
