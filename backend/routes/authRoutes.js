// routes/authRoutes.js
const express = require("express");
const {
  sendOTP,
  verifyOTP,
} = require("../controllers/authController");

const router = express.Router();

// POST /api/auth/signup
// router.post("/signup", signupUser);

// POST /api/auth/login
// router.post("/login", loginUser);

router.post("/send-otp", sendOTP);

// POST /api/auth/verify-otp (Complete OTP-based signup)
router.post("/verify-otp", verifyOTP);

module.exports = router;
