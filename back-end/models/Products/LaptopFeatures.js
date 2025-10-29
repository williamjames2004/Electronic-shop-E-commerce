const mongoose = require("mongoose");

const laptopSpecsSchema = new mongoose.Schema(
  {
    laptopId: {
      type: String,
      required: true,
      unique: true,
    },
    keySpecs: {
      performance: {
        processorModel: { type: String },
        clockSpeed: { type: String },
        ramType: { type: String },
        graphicsProcessor: { type: String },
        graphicMemory: { type: String },
        cores: { type: Number },
      },
      design: {
        thickness: { type: String },
        weight: { type: String },
      },
      display: {
        size: { type: String },
        type: { type: String },
        resolution: { type: String },
        aspectRatio: { type: String },
        refreshRate: { type: String },
        features: [{ type: String }],
      },
      storageDetails: {
        type: { type: String },
        capacity: { type: String },
      },
      battery: {
        capacity: { type: String },
        power: { type: String },
      },
      general: {
        os: { type: String },
        color: { type: String },
        warranty: { type: String },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LaptopSpecs", laptopSpecsSchema);