const mongoose = require("mongoose");

const mobileFeaturesSchema = new mongoose.Schema(
  {
    mobileId: {
      type: String,
      required: true,
      unique: true,
    },
    variants: [
      {
        ram: { type: String, required: true },
        storage: { type: String, required: true },
      },
    ],
    processor: {
      chipset: String,
      cpu: String,
      architecture: String,
      fabrication: String,
      gpu: String,
      ramType: String,
    },
    osDetails: {
      operatingSystem: String,
      version: String,
      customUI: String,
      osUpdates: String,
      securityUpdates: String,
    },
    display: {
      type: { type: String },
      size: String,
      resolution: String,
      peakBrightness: String,
      refreshRate: String,
      aspectRatio: String,
      pixelDensity: String,
      hdrSupport: String,
    },
    design: {
      height: String,
      width: String,
      thickness: String,
      weight: String,
      waterResistance: String,
      ruggedness: String,
    },
    rearCamera: {
      primary: {
        resolution: String,
        aperture: String,
        lens: String,
        sensorSize: String,
        zoom: String,
      },
      secondary: {
        resolution: String,
        aperture: String,
        lens: String,
      },
      features: [String],
      videoRecording: [String],
      ois: Boolean,
      flash: Boolean,
    },
    frontCamera: {
      resolution: String,
      aperture: String,
      features: [String],
      videoRecording: [String],
      flash: Boolean,
    },
    battery: {
      type: [
      {
        capacity: { type: String },
        type: { type: String },
        quickCharging: { type: String },
        chargingTime: { type: String },
        batteryLife: { type: String },
      },
    ],
    default: [],
    },
    storageDetails: {
      internal: String,
      storageType: String,
      expandable: String,
    },
    connectivity: {
      simSlots: String,
      simType: String,
      networkSupport: String,
      volte: Boolean,
      wifi: String,
      bluetooth: String,
      gps: String,
      nfc: Boolean,
      audioJack: String,
    },
    sensors: {
      fingerprintSensor: Boolean,
      fingerprintPosition: String,
      fingerprintType: String,
      otherSensors: [String],
    },
    general: {
      launchDate: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MobileFeatures", mobileFeaturesSchema);