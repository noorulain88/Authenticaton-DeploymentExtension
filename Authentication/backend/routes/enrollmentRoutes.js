const router = require("express").Router();
const { enroll, myCourses, updateProgress } = require("../controllers/enrollmentController");
const { protect, allowRoles } = require("../middleware/auth");

router.post("/", protect, allowRoles("student"), enroll);
router.get("/my-courses", protect, allowRoles("student"), myCourses);
router.patch("/:id/progress", protect, allowRoles("student"), updateProgress);

module.exports = router;
