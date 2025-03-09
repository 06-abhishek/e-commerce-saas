const Order = require("../models/Order");
const redisClient = require("../config/redis");
const socket = require("../config/websocket");

// Create Order (Clears Cache)
exports.createOrder = async (req, res) => {
  try {
    const { products, totalAmount, address } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Products are required" });
    }

    const order = new Order({
      userId: req.user.id,
      products,
      totalAmount,
      address,
      status: "Pending",
    });

    await order.save();

    // Clear Redis cache for user's orders
    await redisClient.del(`orders:user:${req.user.id}`);

    // Emit WebSocket event for new order
    socket.emit("order-update", { orderId: order._id, status: "Pending" });

    return res
      .status(201)
      .json({ message: "Order placed successfully", order });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get All Orders for User (Uses Redis Caching)
exports.getOrders = async (req, res) => {
  try {
    const cacheKey = `orders:user:${req.user.id}`;

    // Check Redis cache
    const cachedOrders = await redisClient.get(cacheKey);
    if (cachedOrders) {
      return res.json(JSON.parse(cachedOrders)); // Return cached data
    }

    // If not found in cache, fetch from DB
    const orders = await Order.find({ userId: req.user.id });

    // Store in Redis for 10 minutes
    await redisClient.setEx(cacheKey, 600, JSON.stringify(orders));

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get Order by ID (Uses Redis Caching)
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `order:${id}`;

    // Check Redis cache
    const cachedOrder = await redisClient.get(cacheKey);
    if (cachedOrder) {
      return res.json(JSON.parse(cachedOrder)); // Return cached data
    }

    // If not found in cache, fetch from DB
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Store in Redis for 10 minutes
    await redisClient.setEx(cacheKey, 600, JSON.stringify(order));

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// Update Order Status (Clears Cache)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Clear Redis cache
    await redisClient.del(`orders:user:${order.userId}`);
    await redisClient.del(`order:${req.params.id}`);

    // Emit WebSocket event for order status update
    socket.emit("order-update", { orderId: order._id, status });

    return res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// Delete Order (Clears Cache)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Clear Redis cache
    await redisClient.del(`orders:user:${order.userId}`);
    await redisClient.del(`order:${req.params.id}`);

    return res.json({ message: "Order deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
