const Cart = require("../models/Cart");
const redisClient = require("../config/redis");
const socket = require("../config/websocket");

// Add to Cart (Clears Cache)
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "Product and quantity are required" });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({ userId: req.user.id, products: [] });
    }

    const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId);

    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    await cart.save();

    // Clear Redis cache
    await redisClient.del(`cart:user:${req.user.id}`);

    // Emit WebSocket event for cart update
    socket.emit("cart-update", { userId: req.user.id, cart });

    return res.status(201).json({ message: "Product added to cart", cart });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get Cart (Uses Redis Caching)
exports.getCart = async (req, res) => {
  try {
    const cacheKey = `cart:user:${req.user.id}`;

    // Check Redis cache
    const cachedCart = await redisClient.get(cacheKey);
    if (cachedCart) {
      return res.json(JSON.parse(cachedCart)); // Return cached data
    }

    // If not found in cache, fetch from DB
    const cart = await Cart.findOne({ userId: req.user.id });

    // Store in Redis for 10 minutes
    await redisClient.setEx(cacheKey, 600, JSON.stringify(cart));

    return res.json(cart || { message: "Cart is empty" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// Remove from Cart (Clears Cache)
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = cart.products.filter((p) => p.productId.toString() !== productId);
    await cart.save();

    // Clear Redis cache
    await redisClient.del(`cart:user:${req.user.id}`);

    // Emit WebSocket event for cart update
    socket.emit("cart-update", { userId: req.user.id, cart });

    return res.json({ message: "Product removed from cart", cart });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// Clear Cart (Clears Cache)
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({ userId: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Clear Redis cache
    await redisClient.del(`cart:user:${req.user.id}`);

    // Emit WebSocket event for cart update
    socket.emit("cart-update", { userId: req.user.id, cart: null });

    return res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
