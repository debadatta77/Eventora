const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  verifyOtp,
  updateProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

//Verify OTP
router.post("/verify-otp", verifyOtp);

// Update Profile route (protected)
router.put("/profile", protect, updateProfile);

module.exports = router;
