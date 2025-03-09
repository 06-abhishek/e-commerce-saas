const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  orderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Order" },
  paymentMethod: { type: String, required: true, enum: ["razorpay", "paypal"] },
  transactionId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);
