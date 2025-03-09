const express = require("express");
const { searchProducts, getCategories } = require("../controllers/searchController");

const router = express.Router();

router.get("/", searchProducts);
router.get("/categories", getCategories);

module.exports = router;
