const mongoose = require("mongoose");

const laptopPrimarySchema = new mongoose.Schema(
  {
    laptopId: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    name: {
      type: String,
      required: [true, "Laptop name is required"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    processor: {
      type: String,
      required: [true, "Processor info is required"],
      trim: true,
    },
    ram: {
      type: String,
      required: [true, "RAM is required"],
      match: [/^\d+\s?GB$/, "RAM must be in GB (e.g., 16GB)"],
    },
    storage: {
      type: String,
      required: [true, "Storage is required"],
      match: [/^\d+\s?(GB|TB)$/, "Storage must be in GB or TB (e.g., 512GB)"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be positive"],
    },
    stock: {
      type: String,
      enum: ["In Stock", "Out of Stock", "Limited"],
      default: "In Stock",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LaptopPrimary", laptopPrimarySchema);