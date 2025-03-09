const Review = require("../models/Review");

// Add a review
exports.addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    if (!productId || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newReview = new Review({
      userId: req.user.id,
      productId,
      rating,
      comment,
    });

    await newReview.save();
    return res.status(201).json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    return res.status(500).json({ message: "Error adding review" });
  }
};

// Get all reviews for a product
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).populate("userId", "name");

    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching reviews" });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this review" });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    return res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    return res.status(500).json({ message: "Error updating review" });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this review" });
    }

    await review.deleteOne();
    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting review" });
  }
};
