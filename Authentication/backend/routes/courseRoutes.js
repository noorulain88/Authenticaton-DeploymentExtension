const router = require("express").Router();
const { getCourses, getCourse, createCourse, updateCourse, deleteCourse, addLesson } = require("../controllers/courseController");
const { protect, allowRoles } = require("../middleware/auth");

router.get("/", getCourses);
router.get("/:id", getCourse);
router.post("/", protect, allowRoles("admin", "instructor"), createCourse);
router.put("/:id", protect, allowRoles("admin", "instructor"), updateCourse);
router.delete("/:id", protect, allowRoles("admin", "instructor"), deleteCourse);
router.post("/:id/lessons", protect, allowRoles("admin", "instructor"), addLesson);

module.exports = router;
