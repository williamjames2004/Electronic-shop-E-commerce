const mongoose = require("mongoose");

const mobileFeaturesSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },

    variants: [
      {
        ram: { type: String, default: null },
        storage: { type: String, default: null }
      }
    ],

    processor: {
      chipset: { type: String, default: null },
      cpu: { type: String, default: null },
      architecture: { type: String, default: null },
      fabrication: { type: String, default: null },
      gpu: { type: String, default: null },
      ramType: { type: String, default: null },
    },

    osDetails: {
      operatingSystem: { type: String, default: null },
      version: { type: String, default: null },
      customUI: { type: String, default: null },
      osUpdates: { type: String, default: null },
      securityUpdates: { type: String, default: null },
    },

    display: {
      typeName: { type: String, default: null },
      size: { type: String, default: null },
      resolution: { type: String, default: null },
      peakBrightness: { type: String, default: null },
      refreshRate: { type: String, default: null },
      aspectRatio: { type: String, default: null },
      pixelDensity: { type: String, default: null },
      hdrSupport: { type: String, default: null },
    },

    design: {
      height: { type: String, default: null },
      width: { type: String, default: null },
      thickness: { type: String, default: null },
      weight: { type: String, default: null },
      waterResistance: { type: String, default: null },
      ruggedness: { type: String, default: null },
    },

    rearCamera: {
      primary: {
        resolution: { type: String, default: null },
        aperture: { type: String, default: null },
        lens: { type: String, default: null },
        sensorSize: { type: String, default: null },
        zoom: { type: String, default: null },
      },
      secondary: {
        resolution: { type: String, default: null },
        aperture: { type: String, default: null },
        lens: { type: String, default: null },
      },
      features: { type: [String], default: [] },
      videoRecording: { type: [String], default: [] },
      ois: { type: String, default: null },
      flash: { type: String, default: null },
    },

    frontCamera: {
      resolution: { type: String, default: null },
      aperture: { type: String, default: null },
      features: { type: [String], default: [] },
      videoRecording: { type: [String], default: [] },
      flash: { type: String, default: null },
    },

    battery: [
      {
        capacity: { type: String, default: null },
        type: { type: String, default: null },
        quickCharging: { type: String, default: null },
        chargingTime: { type: String, default: null },
        batteryLife: { type: String, default: null },
      }
    ],

    storageDetails: {
      internal: { type: String, default: null },
      storageType: { type: String, default: null },
      expandable: { type: String, default: null },
    },

    connectivity: {
      simSlots: { type: String, default: null },
      simType: { type: String, default: null },
      networkSupport: { type: String, default: null },
      volte: { type: String, default: null },
      wifi: { type: String, default: null },
      bluetooth: { type: String, default: null },
      gps: { type: String, default: null },
      nfc: { type: String, default: null },
      audioJack: { type: String, default: null },
    },

    sensors: {
      fingerprintSensor: { type: String, default: null },
      fingerprintPosition: { type: String, default: null },
      fingerprintType: { type: String, default: null },
      otherSensors: { type: [String], default: [] },
    },

    general: {
      launchDate: { type: String, default: null },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MobileFeatures", mobileFeaturesSchema);