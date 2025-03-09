const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Address", AddressSchema);
