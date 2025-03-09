const express = require("express");
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, cartController.addToCart);
router.get("/", authMiddleware, cartController.getCart);
router.delete("/", authMiddleware, cartController.clearCart);
router.put("/remove", authMiddleware, cartController.removeFromCart);

module.exports = router;
