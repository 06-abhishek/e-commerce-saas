const express = require("express");
const { getAddresses, addAddress, updateAddress, deleteAddress } = require("../controllers/addressController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getAddresses);
router.post("/add", authMiddleware, addAddress);
router.put("/update", authMiddleware, updateAddress);
router.delete("/delete", authMiddleware, deleteAddress);

module.exports = router;
