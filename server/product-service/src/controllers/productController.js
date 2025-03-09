const Product = require("../models/Product");
const { uploadImage } = require("../utils/cloudinaryUtils");
const redisClient = require("../config/redis");

// Create Product (Clears Cache)
exports.createProduct = async (req, res) => {
  try {
    const { name, brand, category, description, price, stock } = req.body;

    if (!req.file) return res.status(400).json({ message: "Image is required" });
    const imageUrl = await uploadImage(req.file.path);

    const product = new Product({ name, brand, category, description, price, stock, imageUrl });
    await product.save();

    // Clear Redis cache
    await redisClient.del("products:all");

    return res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get All Products (Uses Redis Caching)
exports.getAllProducts = async (req, res) => {
  try {
    const cacheKey = "products:all";

    // Check Redis cache
    const cachedProducts = await redisClient.get(cacheKey);
    if (cachedProducts) {
      return res.json(JSON.parse(cachedProducts)); // Return cached data
    }

    // If not found in cache, fetch from DB
    const products = await Product.find();

    // Store in Redis for 10 minutes
    await redisClient.setEx(cacheKey, 600, JSON.stringify(products));

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get Product by ID (Uses Redis Caching)
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `product:${id}`;

    // Check Redis cache
    const cachedProduct = await redisClient.get(cacheKey);
    if (cachedProduct) {
      return res.json(JSON.parse(cachedProduct)); // Return cached data
    }

    // If not found in cache, fetch from DB
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Store in Redis for 10 minutes
    await redisClient.setEx(cacheKey, 600, JSON.stringify(product));

    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// Update Product (Clears Cache)
exports.updateProduct = async (req, res) => {
  try {
    const { name, brand, category, description, price, stock } = req.body;
    let updateData = { name, brand, category, description, price, stock };

    if (req.file) {
      const imageUrl = await uploadImage(req.file.path);
      updateData.imageUrl = imageUrl;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Clear Redis cache
    await redisClient.del("products:all");
    await redisClient.del(`product:${req.params.id}`);

    return res.json({ message: "Product updated successfully", product });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// Delete Product (Clears Cache)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Clear Redis cache
    await redisClient.del("products:all");
    await redisClient.del(`product:${req.params.id}`);

    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
