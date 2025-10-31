const express = require("express");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");
const Registration = require("../models/Registration");
const User = require("../models/User");
const Event = require("../models/Event");

const router = express.Router();

// Export reports
router.get("/export", async (req, res) => {
  try {
    const { type, format = "csv" } = req.query;

    let data = [];

    if (type === "registrations") {
      data = await Registration.find()
        .populate("userId", "name email")
        .populate("eventId", "title date")
        .lean();
    }

    if (format === "csv") {
      const fields = ["userId.name", "userId.email", "eventId.title", "eventId.date", "registeredAt"];
      const parser = new Parser({ fields });
      const csv = parser.parse(data);

      res.header("Content-Type", "text/csv");
      res.attachment(`${type}_report.csv`);
      return res.send(csv);
    }

    if (format === "pdf") {
      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=${type}_report.pdf`);
      doc.pipe(res);

      doc.fontSize(18).text(`${type.toUpperCase()} REPORT`, { align: "center" });
      doc.moveDown();

      data.forEach((row, index) => {
        doc.fontSize(12).text(
          `${index + 1}. User: ${row.userId?.name || "-"} | Event: ${row.eventId?.title || "-"} | Date: ${row.registeredAt}`
        );
      });

      doc.end();
    }
  } catch (err) {
    res.status(500).json({ message: "Error generating report", error: err });
  }
});

module.exports = router;
