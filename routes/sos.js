const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

// Replace with your email credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/send-sos", async (req, res) => {
    console.log("Received Headers:", req.headers); // ✅ Log headers
    console.log("Received SOS Request:", req.body); // ✅ Log request body
  
    const { latitude, longitude } = req.body;
  
    if (!latitude || !longitude) {
      console.log("Error: Missing coordinates!", req.body);
      return res.status(400).json({ message: "Location data is missing!" });
    }
  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "tsujeet440@gmail.com",
      subject: "🚨 SOS Alert!",
      text: `An SOS alert has been triggered!\nLocation: https://www.google.com/maps?q=${latitude},${longitude}\n\nCoordinates: ${latitude}, ${longitude}`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.json({ message: "🚨 SOS alert sent successfully!" });
      req.flash("success", `🚨 SOS alert sent successfully!`);
    } catch (error) {
      console.error("Error sending SOS email:", error);
      res.status(500).json({ message: "Error sending SOS email." });
    }
  });
  

  module.exports = router;