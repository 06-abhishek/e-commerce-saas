const mongoose = require("mongoose");

const FeatureSchema = new mongoose.Schema({
  type: { type: String, enum: ["banner", "offer", "featured"], required: true },
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  link: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Feature", FeatureSchema);
