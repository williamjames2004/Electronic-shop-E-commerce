const mongoose = require("mongoose");

const laptopSpecsSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
    },

    keySpecs: {
      performance: {
        processorModel: { type: String, default: null },
        clockSpeed: { type: String, default: null },
        ramType: { type: String, default: null },
        graphicsProcessor: { type: String, default: null },
        graphicMemory: { type: String, default: null },
        cores: { type: String, default: null },
      },

      design: {
        thickness: { type: String, default: null },
        weight: { type: String, default: null },
      },

      display: {
        size: { type: String, default: null },
        type: { type: String, default: null },
        resolution: { type: String, default: null },
        aspectRatio: { type: String, default: null },
        refreshRate: { type: String, default: null },
        features: { type: [String], default: [] },
      },

      storageDetails: {
        type: { type: String, default: null },
        capacity: { type: String, default: null },
      },

      battery: {
        capacity: { type: String, default: null },
        power: { type: String, default: null },
      },

      general: {
        os: { type: String, default: null },
        color: { type: String, default: null },
        warranty: { type: String, default: null },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LaptopFeatures", laptopSpecsSchema);