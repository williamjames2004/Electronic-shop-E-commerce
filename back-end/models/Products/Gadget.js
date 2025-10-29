const mongoose = require("mongoose");

const gadgetSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, "Image is required"]
  },
  name: {
    type: String,
    required: [true, "Gadget name is required"],
    trim: true
  },
  type: {
    type: String,
    enum: ["Headset", "Headset with Microphone", "Earbuds", "Smartwatch", "Speaker", "Other"],
    required: [true, "Type is required"]
  },
  brand: {
    type: String,
    required: [true, "Brand is required"],
    trim: true
  },
  connectivity: {
    type: String,
    enum: ["Wired", "Wireless", "Bluetooth"],
    default: "Wireless"
  },
  batteryLife: {
    type: String,
    trim: true,
    default: "N/A"
  },
  noiseCancellation: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be positive"]
  },
  stock: {
    type: String,
    enum: ["In Stock", "Out of Stock", "Limited"],
    default: "In Stock"
  },
}, { timestamps: true });

module.exports = mongoose.model("Gadget", gadgetSchema);