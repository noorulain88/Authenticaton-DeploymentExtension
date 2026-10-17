const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function makeToken(userId) {
  if (!process.env.JWT_SECRET) throw Object.assign(new Error("JWT_SECRET is not configured."), { statusCode: 500 });
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    res.status(400); throw new Error("Name, email, and password are required.");
  }
  if (String(name).trim().length < 2) {
    res.status(400); throw new Error("Name must contain at least 2 characters.");
  }
  const normalizedEmail = String(email).trim().toLowerCase();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
  if (!validEmail) { res.status(400); throw new Error("Enter a valid email address."); }
  if (String(password).length < 8) {
    res.status(400); throw new Error("Password must be at least 8 characters long.");
  }
  if (await User.findOne({ email: normalizedEmail })) {
    res.status(409); throw new Error("An account with this email already exists.");
  }
  // Public registration never allows self-assigned admin access.
  const safeRole = role === "instructor" ? "instructor" : "student";
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name: String(name).trim(), email: normalizedEmail, password: hashedPassword, role: safeRole });
  res.status(201).json({
    token: makeToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400); throw new Error("Email and password are required."); }
  const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select("+password");
  if (!user || !(await bcrypt.compare(String(password), user.password))) {
    res.status(401); throw new Error("Incorrect email or password.");
  }
  res.json({
    token: makeToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } });
});

module.exports = { register, login, me };
