const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

const analytics = asyncHandler(async (req, res) => {
  const [users, courses, enrollments, students, instructors] = await Promise.all([
    User.countDocuments(), Course.countDocuments(), Enrollment.countDocuments(),
    User.countDocuments({ role: "student" }), User.countDocuments({ role: "instructor" })
  ]);
  res.json({ users, courses, enrollments, students, instructors });
});

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

const updateRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!["admin", "instructor", "student"].includes(role)) {
    res.status(400); throw new Error("Role must be admin, instructor, or student.");
  }
  if (String(req.params.id) === String(req.user._id) && role !== "admin") {
    res.status(400); throw new Error("You cannot remove your own admin role.");
  }
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error("User not found."); }
  user.role = role;
  await user.save();
  res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
});

module.exports = { analytics, listUsers, updateRole };
