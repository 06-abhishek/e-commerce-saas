const User = require("../models/User");
const { generateToken } = require("../utils/jwtUtils");
const { sendEmail } = require("../utils/emailUtils");
// const redisClient = require("../config/redis");
const { setCache, deleteCache } = require("../config/redis");

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ fullName, email, password });
    await newUser.save();

    sendEmail(email, "Welcome!", "Your account has been created!");

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

// Login User (with Redis Caching)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.cookie("token", token, { httpOnly: true });

    await setCache(
      `auth:${token}`,
      { id: user._id, email: user.email },
      cc
    );

    return res.json({ message: "Login successful", token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

// Logout User (Removes Token from Redis)
exports.logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (token) await deleteCache(`auth:${token}`); // Remove token from Redis on Logout

    res.clearCookie("token");
    return res.json({ message: "Logout successful" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
