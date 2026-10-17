const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

const getCourses = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  const filter = {};
  if (search) filter.$or = [
    { title: { $regex: String(search), $options: "i" } },
    { description: { $regex: String(search), $options: "i" } }
  ];
  if (category) filter.category = String(category);
  const courses = await Course.find(filter).populate("instructor", "name email").sort({ createdAt: -1 });
  res.json(courses);
});

const getCourse = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) { res.status(400); throw new Error("Invalid course ID."); }
  const course = await Course.findById(req.params.id).populate("instructor", "name email");
  if (!course) { res.status(404); throw new Error("Course not found."); }
  res.json(course);
});

const createCourse = asyncHandler(async (req, res) => {
  const { title, description, category, price } = req.body;
  if (!title || !description || !category) {
    res.status(400); throw new Error("Title, description, and category are required.");
  }
  const parsedPrice = price === undefined || price === "" ? 0 : Number(price);
  if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
    res.status(400); throw new Error("Price must be a valid number greater than or equal to zero.");
  }
  const course = await Course.create({
    title: String(title).trim(), description: String(description).trim(),
    category: String(category).trim(), price: parsedPrice, instructor: req.user._id
  });
  await course.populate("instructor", "name email");
  res.status(201).json(course);
});

const updateCourse = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) { res.status(400); throw new Error("Invalid course ID."); }
  const course = await Course.findById(req.params.id);
  if (!course) { res.status(404); throw new Error("Course not found."); }
  if (req.user.role !== "admin" && String(course.instructor) !== String(req.user._id)) {
    res.status(403); throw new Error("You can only edit courses you created.");
  }
  const allowed = ["title", "description", "category"];
  for (const key of allowed) if (req.body[key] !== undefined) course[key] = String(req.body[key]).trim();
  if (req.body.price !== undefined) {
    const price = Number(req.body.price);
    if (!Number.isFinite(price) || price < 0) { res.status(400); throw new Error("Price must be zero or greater."); }
    course.price = price;
  }
  await course.save();
  await course.populate("instructor", "name email");
  res.json(course);
});

const deleteCourse = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) { res.status(400); throw new Error("Invalid course ID."); }
  const course = await Course.findById(req.params.id);
  if (!course) { res.status(404); throw new Error("Course not found."); }
  if (req.user.role !== "admin" && String(course.instructor) !== String(req.user._id)) {
    res.status(403); throw new Error("You can only delete courses you created.");
  }
  await Enrollment.deleteMany({ course: course._id });
  await course.deleteOne();
  res.json({ message: "Course deleted successfully." });
});

const addLesson = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) { res.status(400); throw new Error("Invalid course ID."); }
  const course = await Course.findById(req.params.id);
  if (!course) { res.status(404); throw new Error("Course not found."); }
  if (req.user.role !== "admin" && String(course.instructor) !== String(req.user._id)) {
    res.status(403); throw new Error("You can only add lessons to your own courses.");
  }
  const { title, url, description = "" } = req.body;
  if (!title || !url) { res.status(400); throw new Error("Lesson title and URL are required."); }
  try { new URL(url); } catch { res.status(400); throw new Error("Lesson URL must be a valid http(s) URL."); }
  if (!/^https?:$/.test(new URL(url).protocol)) { res.status(400); throw new Error("Lesson URL must start with http or https."); }
  course.lessons.push({ title: String(title).trim(), url: String(url).trim(), description: String(description).trim() });
  await course.save();
  res.status(201).json(course);
});

module.exports = { getCourses, getCourse, createCourse, updateCourse, deleteCourse, addLesson };
