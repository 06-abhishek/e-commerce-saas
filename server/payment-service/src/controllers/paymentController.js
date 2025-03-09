const Payment = require("../models/Payment");
const razorpayInstance = require("../utils/razorpay");
const paypal = require("../utils/paypal");

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    if (!amount) return res.status(400).json({ message: "Amount is required" });

    const options = {
      amount: amount * 100, // Razorpay accepts amount in paise
      currency: currency || "INR",
      receipt: `order_rcpt_${Date.now()}`,
    };

    const response = await razorpayInstance.orders.create(options);
    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Razorpay Order Error" });
  }
};

exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { orderId, paymentId } = req.body;
    if (!orderId || !paymentId)
      return res.status(400).json({ message: "Missing orderId or paymentId" });

    const payment = new Payment({
      userId: req.user.id,
      orderId,
      paymentMethod: "razorpay",
      transactionId: paymentId,
      amount: req.body.amount,
      status: "completed",
    });

    await payment.save();
    return res.status(200).json({ message: "Payment Successful", payment });
  } catch (error) {
    return res.status(500).json({ message: "Payment Verification Failed" });
  }
};

exports.createPaypalPayment = (req, res) => {
  const { amount, currency } = req.body;
  if (!amount) return res.status(400).json({ message: "Amount is required" });

  const create_payment_json = {
    intent: "sale",
    payer: { payment_method: "paypal" },
    transactions: [{ amount: { total: amount, currency: currency || "USD" } }],
    redirect_urls: { return_url: "/success", cancel_url: "/cancel" },
  };

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      return res.status(500).json({ message: "PayPal Payment Error" });
    } else {
      return res.status(201).json(payment);
    }
  });
};

exports.verifyPaypalPayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;
    if (!paymentId || !payerId || !orderId)
      return res.status(400).json({ message: "Missing parameters" });

    const execute_payment_json = { payer_id: payerId };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async (error, payment) => {
        if (error) {
          return res
            .status(500)
            .json({ message: "PayPal Payment Verification Failed" });
        } else {
          const newPayment = new Payment({
            userId: req.user.id,
            orderId,
            paymentMethod: "paypal",
            transactionId: paymentId,
            amount: payment.transactions[0].amount.total,
            status: "completed",
          });

          await newPayment.save();
          return res
            .status(200)
            .json({ message: "Payment Successful", payment });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({ message: "Error verifying PayPal payment" });
  }
};
