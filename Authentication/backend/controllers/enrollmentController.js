const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

const enroll = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  if (!courseId || !mongoose.isValidObjectId(courseId)) { res.status(400); throw new Error("A valid courseId is required."); }
  const course = await Course.findById(courseId);
  if (!course) { res.status(404); throw new Error("Course not found."); }
  const existing = await Enrollment.findOne({ student: req.user._id, course: courseId });
  if (existing) { res.status(409); throw new Error("You are already enrolled in this course."); }
  const enrollment = await Enrollment.create({ student: req.user._id, course: courseId });
  await enrollment.populate({ path: "course", populate: { path: "instructor", select: "name" } });
  res.status(201).json({ message: "Enrollment successful.", enrollment });
});

const myCourses = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate({ path: "course", populate: { path: "instructor", select: "name" } })
    .sort({ createdAt: -1 });
  res.json(enrollments);
});

const updateProgress = asyncHandler(async (req, res) => {
  const progress = Number(req.body.progress);
  if (!Number.isFinite(progress) || progress < 0 || progress > 100) {
    res.status(400); throw new Error("Progress must be a number from 0 to 100.");
  }
  const enrollment = await Enrollment.findOne({ _id: req.params.id, student: req.user._id });
  if (!enrollment) { res.status(404); throw new Error("Enrollment not found."); }
  enrollment.progress = progress;
  await enrollment.save();
  res.json(enrollment);
});

module.exports = { enroll, myCourses, updateProgress };
