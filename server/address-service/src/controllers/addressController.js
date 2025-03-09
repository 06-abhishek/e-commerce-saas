const Address = require("../models/Address");

exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.id });
    return res.status(200).json(addresses);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const { fullName, phoneNumber, street, city, state, postalCode, country, isDefault } = req.body;
    if (!fullName || !phoneNumber || !street || !city || !state || !postalCode || !country) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (isDefault) {
      await Address.updateMany({ userId: req.user.id }, { isDefault: false });
    }

    const newAddress = new Address({
      userId: req.user.id,
      fullName,
      phoneNumber,
      street,
      city,
      state,
      postalCode,
      country,
      isDefault
    });

    await newAddress.save();
    return res.status(201).json({ message: "Address added successfully", address: newAddress });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { addressId, fullName, phoneNumber, street, city, state, postalCode, country, isDefault } = req.body;
    if (!addressId) return res.status(400).json({ message: "Address ID is required" });

    const address = await Address.findById(addressId);
    if (!address || address.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (isDefault) {
      await Address.updateMany({ userId: req.user.id }, { isDefault: false });
    }

    address.fullName = fullName || address.fullName;
    address.phoneNumber = phoneNumber || address.phoneNumber;
    address.street = street || address.street;
    address.city = city || address.city;
    address.state = state || address.state;
    address.postalCode = postalCode || address.postalCode;
    address.country = country || address.country;
    address.isDefault = isDefault;

    await address.save();
    return res.status(200).json({ message: "Address updated successfully", address });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.body;
    if (!addressId) return res.status(400).json({ message: "Address ID is required" });

    const address = await Address.findById(addressId);
    if (!address || address.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: "Address not found" });
    }

    await address.deleteOne();
    return res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
