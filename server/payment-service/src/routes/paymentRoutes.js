const express = require("express");
const { createRazorpayOrder, verifyRazorpayPayment, createPaypalPayment, verifyPaypalPayment } = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/razorpay/order", authMiddleware, createRazorpayOrder);
router.post("/razorpay/verify", authMiddleware, verifyRazorpayPayment);
router.post("/paypal/pay", authMiddleware, createPaypalPayment);
router.post("/paypal/verify", authMiddleware, verifyPaypalPayment);

module.exports = router;
