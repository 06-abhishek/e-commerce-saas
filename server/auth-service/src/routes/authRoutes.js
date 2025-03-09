const express = require("express");
const { registerUser, loginUser, logoutUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", authMiddleware, (req, res) => {
  res.json({ message: "Authenticated", user: req.user });
});

module.exports = router;
