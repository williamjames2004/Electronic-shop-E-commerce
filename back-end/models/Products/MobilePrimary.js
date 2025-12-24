const mongoose = require("mongoose");

const mobilePrimarySchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
    },
    image: { type: String, required: [true, "Image is required"] },
    name: { type: String, required: [true, "Mobile name is required"], trim: true },
    brand: { type: String, required: [true, "Brand is required"], trim: true },
    price: { type: Number, required: [true, "Price is required"], min: [0, "Price must be positive"] },
    stock: { type: String, enum: ["In Stock", "Out of Stock", "Limited"], default: "In Stock" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MobilePrimary", mobilePrimarySchema);