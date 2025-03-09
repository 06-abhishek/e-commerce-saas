const Product = require("../models/Product");

// Search Products by keyword, category, or brand
exports.searchProducts = async (req, res) => {
  try {
    const { keyword, category, brand, minPrice, maxPrice } = req.query;

    const query = {};
    if (keyword) query.name = { $regex: keyword, $options: "i" };
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query);
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Error searching products" });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching categories" });
  }
};
