const User = require("../models/user");
const OTP = require("../models/OTP");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOTPEmail } = require("../utils/email");

//Register User
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    let userExists = await User.findOne({ email });
    if (userExists) {
      if (userExists.isVerified) {
        return res.status(400).json({ error: "User already exists" });
      }
      
      // If the user exists but is NOT verified, update their info and send a new OTP
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      userExists.name = name;
      userExists.password = hashedPassword;
      await userExists.save();

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`[VERIFICATION OTP] OTP for ${email}: ${otp}`);
      
      sendOTPEmail(email, otp, "account_verification").catch((err) =>
        console.error("Async sendOTPEmail error:", err)
      );
      
      await OTP.deleteMany({ email, action: "account_verification" });
      await OTP.create({ email, otp, action: "account_verification" });

      return res.status(201).json({
        message: "Unverified account updated. Please verify using the new OTP.",
        email: userExists.email,
      });
    }

    // Hash the password before saving for a new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      isVerified: false,
    });

    // Generate a 6-digit OTP for email verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[REGISTRATION OTP] OTP for ${email}: ${otp}`);
    
    sendOTPEmail(email, otp, "account_verification").catch((err) =>
      console.error("Async sendOTPEmail error:", err)
    );
    
    await OTP.create({ email, otp, action: "account_verification" });

    // Send a response indicating that the user was created and an OTP was sent
    res.status(201).json({
      message:
        "User registered successfully. Please verify your email using the OTP sent.",
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  let user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ error: "Invalid credentials please try again " });
  }

  // Compare the provided password with the hashed password in the database
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(400)
      .json({ error: "Invalid credentials please try again" });
  }

  // Check if the user is verified
  if (!user.isVerified && user.role === "user") {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.deleteMany({ email, action: "account_verification" }); // Remove any existing OTPs for this email

    // Create a new OTP record for account verification
    await OTP.create({ email, otp, action: "account_verification" });
    // Send the OTP to the user's email for account verification
    sendOTPEmail(email, otp, "account_verification").catch((err) =>
      console.error("Async sendOTPEmail error:", err)
    );
    return res.status(400).json({
      error:
        "Account not verified. Please check your email for the OTP to verify your account.",
    });
  }

  // If the user is verified, generate a token and send it in the response
  res.json({
    message: "Login successful",
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role), // Generate and send token
  });
};

//Generate token
const generateToken = (id, role) => {
  // Implementation for token generation
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

//Verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const otpRecord = await OTP.findOne({
    email,
    otp,
    action: "account_verification",
  });

  // Check if the OTP is valid and not expired
  if (!otpRecord) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  // If the OTP is valid, mark the user as verified
  const user = await User.findOneAndUpdate({ email }, { isVerified: true });
  await OTP.deleteMany({ email, action: "account_verification" }); // Remove used OTPs
  res.json({
    message: "Account verified successfully. You can now log in.",
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role), // Generate and send token
  });
};
