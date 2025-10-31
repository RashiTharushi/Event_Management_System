const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes placeholder
app.get("/", (req, res) => {
  res.send("Event Management API is running...");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const authRoutes = require("./routes/auth");
const eventRoutes= require("./routes/events");
const registrationRoutes=require("./routes/registration");
const admindashboardRoutes=require("./routes/dashboard_routes")
const profileRoutes=require("./routes/profile")
const feedbackRoutes=require("./routes/admin_feedback");
const reportRoutes=require("./routes/admin_reports");

app.use("/auth", authRoutes);
app.use("/events",eventRoutes);
app.use("/registration",registrationRoutes);
app.use("/admindashboard",admindashboardRoutes);
app.use("/profile",profileRoutes);
app.use("/feedback",feedbackRoutes);
app.use("/reports",reportRoutes);