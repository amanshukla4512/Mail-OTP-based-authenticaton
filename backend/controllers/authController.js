// controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const otpGenerator = require("otp-generator");
const sendOTPEmail = require("../utils/emailService");

// Generate JWT token
const generateToken = (id, name) => {
  return jwt.sign({ id, name }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Login User
// const loginUser = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // Check if user exists
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(401).json({ message: "Invalid username or password" });
//     }

//     // Check if password matches
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid username or password" });
//     }

//     // Generate and send JWT token
//     const token = generateToken(user._id, username);
//     res.status(200).json({ message: "Login successful", token });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// Sign Up User

// const signupUser = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // Check if username already exists
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({ message: "Username already exists" });
//     }

//     // Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create and save the user
//     const newUser = await User.create({ username, password: hashedPassword });

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: newUser._id, name: newUser.username },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1h",
//       }
//     );

//     // Respond with user details and token
//     res.status(201).json({
//       message: "User registered successfully",
//       user: { id: newUser._id, username: newUser.username },
//       token,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// Generate and send OTP (Signup & Login)
const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
    });

    // Set OTP expiry (5 minutes)
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);

    // Find user by email
    let user = await User.findOne({ email });

    if (user) {
      // If user exists, update OTP and expiry
      user.otp = otp;
      user.otpExpiry = otpExpiry;
    } else {
      // If user doesn't exist, create new user
      user = new User({ email, otp, otpExpiry });
    }

    // Save user data
    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Verify OTP and log in the user
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check OTP expiry
    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Clear OTP fields after successful verification
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id, email);

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, email: user.email },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { sendOTP, verifyOTP };
