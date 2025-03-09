const express = require("express");
const { getFeatures, addFeature, deleteFeature } = require("../controllers/featureController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getFeatures);
router.post("/", authMiddleware, addFeature);
router.delete("/:id", authMiddleware, deleteFeature);

module.exports = router;
