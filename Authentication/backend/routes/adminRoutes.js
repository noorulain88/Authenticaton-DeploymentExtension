const router = require("express").Router();
const { analytics, listUsers, updateRole } = require("../controllers/adminController");
const { protect, allowRoles } = require("../middleware/auth");

router.use(protect, allowRoles("admin"));
router.get("/analytics", analytics);
router.get("/users", listUsers);
router.patch("/users/:id/role", updateRole);

module.exports = router;
