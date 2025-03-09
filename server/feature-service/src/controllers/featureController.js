const Feature = require("../models/Feature");

// Get all features
exports.getFeatures = async (req, res) => {
  try {
    const features = await Feature.find();
    return res.status(200).json(features);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching features" });
  }
};

// Add a new feature (Admin Only)
exports.addFeature = async (req, res) => {
  try {
    const { type, title, description, imageUrl, link } = req.body;

    if (!type || !title) {
      return res.status(400).json({ message: "Type and title are required" });
    }

    const feature = new Feature({ type, title, description, imageUrl, link });
    await feature.save();

    return res.status(201).json({ message: "Feature added successfully", feature });
  } catch (error) {
    return res.status(500).json({ message: "Error adding feature" });
  }
};

// Delete a feature (Admin Only)
exports.deleteFeature = async (req, res) => {
  try {
    const { id } = req.params;
    await Feature.findByIdAndDelete(id);
    return res.status(200).json({ message: "Feature deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting feature" });
  }
};
