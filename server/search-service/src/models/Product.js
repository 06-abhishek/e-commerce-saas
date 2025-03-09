const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  brand: { type: String },
  stock: { type: Number, default: 0 },
  ratings: { type: Number, default: 0 },
  imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
