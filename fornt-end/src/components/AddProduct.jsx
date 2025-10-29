import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [category, setCategory] = useState("mobile");
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  // Handle text/select input change
  // Handle nested input names like "processor.cpu" or "rearCamera.primary.resolution"
const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => {
    const updated = { ...prev };

    // Convert 'variants[0].ram' → ['variants', '0', 'ram']
    const keys = name
      .replace(/\[(\d+)\]/g, '.$1') // Convert [0] → .0
      .split('.');

    let nested = updated;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        nested[key] = value;
      } else {
        if (!nested[key]) {
          // If next key is a number, make array; else make object
          nested[key] = isNaN(keys[index + 1]) ? {} : [];
        }
        nested = nested[key];
      }
    });

    return updated;
  });
};

  const handleImage = (e) => setImage(e.target.files[0]);

  const resetForm = () => {
    setFormData({});
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const data = new FormData();
    if (image) data.append("image", image);
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    console.log("📦 FormData entries:");
    for (let [key, val] of data.entries()) console.log(key, val);

    try {
      let url = "";
      if (category === "mobile") url = "http://localhost:5000/backend/mobiles";
      else if (category === "laptop") url = "http://localhost:5000/backend/laptops";
      else if (category === "gadget") url = "http://localhost:5000/backend/gadgets";

      const res = await axios.post(url, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data.message || "✅ Product added successfully!");
      resetForm();
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "❌ Failed to add product. Please check all fields."
      );
    }
  };

  const renderFields = () => {
    switch (category) {
      case "mobile":
  return (
    <>
      {/* 🔹 Basic Information */}
      <h5 className="mt-3 text-primary fw-bold">Basic Information</h5>
      <div className="row">
        <div className="col-md-4 mb-3">
          <label>Image *</label>
          <input
            type="file"
            name="image"
            className="form-control"
            onChange={handleImage}
            required
          />
        </div>
        <div className="col-md-4 mb-3">
          <label>Mobile Name *</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4 mb-3">
          <label>Brand *</label>
          <input
            type="text"
            name="brand"
            className="form-control"
            value={formData.brand || ""}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 mb-3">
          <label>Price *</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={formData.price || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4 mb-3">
          <label>Stock</label>
          <select
            name="stock"
            className="form-select"
            value={formData.stock || ""}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Limited">Limited</option>
          </select>
        </div>
      </div>

      {/* 🔹 Variants */}
      <h5 className="mt-4 text-primary fw-bold">Variants *</h5>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label>RAM *</label>
          <input
            type="text"
            name="variants[0].ram"
            className="form-control"
            value={formData.variants?.[0]?.ram || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <label>Storage *</label>
          <input
            type="text"
            name="variants[0].storage"
            className="form-control"
            value={formData.variants?.[0]?.storage || ""}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* 🔹 Processor */}
      <h5 className="mt-4 text-primary fw-bold">Processor & Performance</h5>
      <div className="row">
        {[
          "chipset",
          "cpu",
          "architecture",
          "fabrication",
          "gpu",
          "ramType",
        ].map((field, i) => (
          <div className="col-md-4 mb-3" key={i}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type="text"
              name={`processor.${field}`}
              className="form-control"
              value={formData.processor?.[field] || ""}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>

      {/* 🔹 OS Details */}
      <h5 className="mt-4 text-primary fw-bold">OS Details</h5>
      {["operatingSystem", "version", "customUI", "osUpdates", "securityUpdates"].map((f, i) => (
        <div className="mb-3" key={i}>
          <label>{f.replace(/([A-Z])/g, " $1")} </label>
          <input
            type="text"
            name={`osDetails.${f}`}
            className="form-control"
            value={formData.osDetails?.[f] || ""}
            onChange={handleChange}
          />
        </div>
      ))}

      {/* 🔹 Display */}
      <h5 className="mt-4 text-primary fw-bold">Display</h5>
      {["type", "size", "resolution", "peakBrightness", "refreshRate", "aspectRatio", "pixelDensity", "hdrSupport"].map((f, i) => (
        <div className="mb-3" key={i}>
          <label>{f.replace(/([A-Z])/g, " $1")}</label>
          <input
            type="text"
            name={`display.${f}`}
            className="form-control"
            value={formData.display?.[f] || ""}
            onChange={handleChange}
          />
        </div>
      ))}

      {/* 🔹 Design */}
      <h5 className="mt-4 text-primary fw-bold">Design & Build</h5>
      {["height", "width", "thickness", "weight", "waterResistance", "ruggedness"].map((f, i) => (
        <div className="mb-3" key={i}>
          <label>{f.replace(/([A-Z])/g, " $1")}</label>
          <input
            type="text"
            name={`design.${f}`}
            className="form-control"
            value={formData.design?.[f] || ""}
            onChange={handleChange}
          />
        </div>
      ))}

      {/* 🔹 Rear Camera */}
      <h5 className="mt-4 text-primary fw-bold">Rear Camera</h5>
      <h6 className="text-secondary">Primary</h6>
      {["resolution", "aperture", "lens", "sensorSize", "zoom"].map((f, i) => (
        <div className="mb-3" key={`rear-primary-${i}`}>
          <label>{f}</label>
          <input
            type="text"
            name={`rearCamera.primary.${f}`}
            className="form-control"
            value={formData.rearCamera?.primary?.[f] || ""}
            onChange={handleChange}
          />
        </div>
      ))}
      <h6 className="text-secondary">Secondary</h6>
      {["resolution", "aperture", "lens"].map((f, i) => (
        <div className="mb-3" key={`rear-secondary-${i}`}>
          <label>{f}</label>
          <input
            type="text"
            name={`rearCamera.secondary.${f}`}
            className="form-control"
            value={formData.rearCamera?.secondary?.[f] || ""}
            onChange={handleChange}
          />
        </div>
      ))}

      <div className="mb-3">
        <label>Features (comma separated)</label>
        <input
          type="text"
          name="rearCamera.features"
          className="form-control"
          value={formData.rearCamera?.features || ""}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label>Video Recording (comma separated)</label>
        <input
          type="text"
          name="rearCamera.videoRecording"
          className="form-control"
          value={formData.rearCamera?.videoRecording || ""}
          onChange={handleChange}
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label>OIS</label>
          <select
            name="rearCamera.ois"
            className="form-select"
            value={formData.rearCamera?.ois || ""}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <label>Flash</label>
          <select
            name="rearCamera.flash"
            className="form-select"
            value={formData.rearCamera?.flash || ""}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>

      {/* 🔹 Front Camera */}
      <h5 className="mt-4 text-primary fw-bold">Front Camera</h5>
      {["resolution", "aperture"].map((f, i) => (
        <div className="mb-3" key={`front-${i}`}>
          <label>{f}</label>
          <input
            type="text"
            name={`frontCamera.${f}`}
            className="form-control"
            value={formData.frontCamera?.[f] || ""}
            onChange={handleChange}
          />
        </div>
      ))}
      <div className="mb-3">
        <label>Features (comma separated)</label>
        <input
          type="text"
          name="frontCamera.features"
          className="form-control"
          value={formData.frontCamera?.features || ""}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label>Video Recording (comma separated)</label>
        <input
          type="text"
          name="frontCamera.videoRecording"
          className="form-control"
          value={formData.frontCamera?.videoRecording || ""}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label>Flash</label>
        <select
          name="frontCamera.flash"
          className="form-select"
          value={formData.frontCamera?.flash || ""}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>

      {/* 🔹 Battery */}
      <h5 className="mt-4 text-primary fw-bold">Battery</h5>
      {["capacity", "type", "quickCharging", "chargingTime", "batteryLife"].map((f, i) => (
        <div className="mb-3" key={i}>
          <label>{f.replace(/([A-Z])/g, " $1")}</label>
          <input
            type="text"
            name={`battery.${f}`}
            className="form-control"
            value={formData.battery?.[f] || ""}
            onChange={handleChange}
          />
        </div>
      ))}

      {/* 🔹 Storage Details */}
      <h5 className="mt-4 text-primary fw-bold">Storage & Connectivity</h5>
      {["internal", "storageType", "expandable"].map((f, i) => (
        <div className="mb-3" key={i}>
          <label>{f.replace(/([A-Z])/g, " $1")}</label>
          <input
            type="text"
            name={`storageDetails.${f}`}
            className="form-control"
            value={formData.storageDetails?.[f] || ""}
            onChange={handleChange}
          />
        </div>
      ))}

      {/* 🔹 Connectivity */}
      {[
        "simSlots",
        "simType",
        "networkSupport",
        "volte",
        "wifi",
        "bluetooth",
        "gps",
        "nfc",
        "audioJack",
      ].map((f, i) => (
        <div className="mb-3" key={i}>
          <label>{f.replace(/([A-Z])/g, " $1")}</label>
          <input
            type="text"
            name={`connectivity.${f}`}
            className="form-control"
            value={formData.connectivity?.[f] || ""}
            onChange={handleChange}
          />
        </div>
      ))}

      {/* 🔹 Sensors */}
      <h5 className="mt-4 text-primary fw-bold">Sensors</h5>
      {["fingerprintSensor", "fingerprintPosition", "fingerprintType"].map((f, i) => (
        <div className="mb-3" key={i}>
          <label>{f.replace(/([A-Z])/g, " $1")}</label>
          <input
            type="text"
            name={`sensors.${f}`}
            className="form-control"
            value={formData.sensors?.[f] || ""}
            onChange={handleChange}
          />
        </div>
      ))}
      <div className="mb-3">
        <label>Other Sensors (comma separated)</label>
        <input
          type="text"
          name="sensors.otherSensors"
          className="form-control"
          value={formData.sensors?.otherSensors || ""}
          onChange={handleChange}
        />
      </div>

      {/* 🔹 General */}
      <h5 className="mt-4 text-primary fw-bold">General</h5>
      <div className="mb-3">
        <label>Launch Date</label>
        <input
          type="text"
          name="general.launchDate"
          className="form-control"
          value={formData.general?.launchDate || ""}
          onChange={handleChange}
        />
      </div>
    </>
  );
      case "laptop":
  return (
    <>
      {/* 🔹 Basic Details */}
      <h5 className="mt-3 text-primary fw-bold">Basic Details</h5>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label>Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label>Brand</label>
          <input
            type="text"
            name="brand"
            className="form-control"
            value={formData.brand || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 mb-3">
          <label>RAM</label>
          <input
            type="text"
            name="ram"
            className="form-control"
            value={formData.ram || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label>Storage</label>
          <input
            type="text"
            name="storage"
            className="form-control"
            value={formData.storage || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label>Processor</label>
          <input
            type="text"
            name="processor"
            className="form-control"
            value={formData.processor || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label>Price</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={formData.price || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label>Stock</label>
          <select
            name="stock"
            className="form-select"
            value={formData.stock || ""}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Limited">Limited</option>
          </select>
        </div>
      </div>

      {/* 🔹 Performance */}
      <h5 className="mt-4 text-primary fw-bold">Performance</h5>
      <div className="row">
        <div className="col-md-4 mb-3">
          <label>Processor Model</label>
          <input
            type="text"
            name="keySpecs.performance.processorModel"
            className="form-control"
            value={formData.keySpecs?.performance?.processorModel || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label>Clock Speed</label>
          <input
            type="text"
            name="keySpecs.performance.clockSpeed"
            className="form-control"
            value={formData.keySpecs?.performance?.clockSpeed || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label>RAM Type</label>
          <input
            type="text"
            name="keySpecs.performance.ramType"
            className="form-control"
            value={formData.keySpecs?.performance?.ramType || ""}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label>Graphics Processor</label>
          <input
            type="text"
            name="keySpecs.performance.graphicsProcessor"
            className="form-control"
            value={formData.keySpecs?.performance?.graphicsProcessor || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3 mb-3">
          <label>Graphic Memory</label>
          <input
            type="text"
            name="keySpecs.performance.graphicMemory"
            className="form-control"
            value={formData.keySpecs?.performance?.graphicMemory || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3 mb-3">
          <label>Cores</label>
          <input
            type="number"
            name="keySpecs.performance.cores"
            className="form-control"
            value={formData.keySpecs?.performance?.cores || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* 🔹 Design */}
      <h5 className="mt-4 text-primary fw-bold">Design</h5>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label>Thickness</label>
          <input
            type="text"
            name="keySpecs.design.thickness"
            className="form-control"
            value={formData.keySpecs?.design?.thickness || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label>Weight</label>
          <input
            type="text"
            name="keySpecs.design.weight"
            className="form-control"
            value={formData.keySpecs?.design?.weight || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* 🔹 Display */}
      <h5 className="mt-4 text-primary fw-bold">Display</h5>
      <div className="row">
        <div className="col-md-4 mb-3">
          <label>Size</label>
          <input
            type="text"
            name="keySpecs.display.size"
            className="form-control"
            value={formData.keySpecs?.display?.size || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label>Type</label>
          <input
            type="text"
            name="keySpecs.display.type"
            className="form-control"
            value={formData.keySpecs?.display?.type || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label>Resolution</label>
          <input
            type="text"
            name="keySpecs.display.resolution"
            className="form-control"
            value={formData.keySpecs?.display?.resolution || ""}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 mb-3">
          <label>Aspect Ratio</label>
          <input
            type="text"
            name="keySpecs.display.aspectRatio"
            className="form-control"
            value={formData.keySpecs?.display?.aspectRatio || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label>Refresh Rate</label>
          <input
            type="text"
            name="keySpecs.display.refreshRate"
            className="form-control"
            value={formData.keySpecs?.display?.refreshRate || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label>Display Features (comma separated)</label>
          <input
            type="text"
            name="keySpecs.display.features"
            className="form-control"
            value={formData.keySpecs?.display?.features || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* 🔹 Storage, Battery, General */}
      <h5 className="mt-4 text-primary fw-bold">Storage, Battery & General</h5>
      <div className="row">
        <div className="col-md-4 mb-3">
          <label>Storage Type</label>
          <input
            type="text"
            name="keySpecs.storageDetails.type"
            className="form-control"
            value={formData.keySpecs?.storageDetails?.type || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label>Storage Capacity</label>
          <input
            type="text"
            name="keySpecs.storageDetails.capacity"
            className="form-control"
            value={formData.keySpecs?.storageDetails?.capacity || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label>Battery Capacity</label>
          <input
            type="text"
            name="keySpecs.battery.capacity"
            className="form-control"
            value={formData.keySpecs?.battery?.capacity || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 mb-3">
          <label>Battery Power</label>
          <input
            type="text"
            name="keySpecs.battery.power"
            className="form-control"
            value={formData.keySpecs?.battery?.power || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label>Operating System</label>
          <input
            type="text"
            name="keySpecs.general.os"
            className="form-control"
            value={formData.keySpecs?.general?.os || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2 mb-3">
          <label>Color</label>
          <input
            type="text"
            name="keySpecs.general.color"
            className="form-control"
            value={formData.keySpecs?.general?.color || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2 mb-3">
          <label>Warranty</label>
          <input
            type="text"
            name="keySpecs.general.warranty"
            className="form-control"
            value={formData.keySpecs?.general?.warranty || ""}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );

      case "gadget":
        return (
          <>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label>Type</label>
                <select name="type" className="form-select" value={formData.type || ""}
                  onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="Headset">Headset</option>
                    <option value="Headset with Microphone">Headset</option>
                    <option value="Earbuds">Earbuds</option>
                    <option value="Smartwatch">Smartwatch</option>
                    <option value="Speaker">Speaker</option>
                    <option value="Other">Other</option>
                  </select>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label>Brand</label>
                <input
                  type="text"
                  name="brand"
                  className="form-control"
                  value={formData.brand || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label>Connectivity</label>
                  <select
                    name="connectivity"
                    className="form-select"
                    value={formData.connectivity || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Wired">Wired</option>
                    <option value="Wireless">Wireless</option>
                    <option value="Bluetooth">Bluetooth</option>
                  </select>
              </div>
              <div className="col-md-4 mb-3">
                <label>Battery Life</label>
                <input
                  type="text"
                  name="batteryLife"
                  className="form-control"
                  value={formData.batteryLife || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label>Noise Cancellation</label>
                <select name="noiseCancellation" className="form-select" value={formData.noiseCancellation || ""}
                  onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
              </div>
              <div className="col-md-4 mb-3">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  className="form-control"
                  value={formData.price || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label>Stock</label>
                  <select
                    name="stock"
                    className="form-select"
                    value={formData.stock || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Limited">Limited</option>
                  </select>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
        width: "100vw",
        overflowX: "hidden",
        padding: "40px 0",
      }}
    >
      <div
        className="w-100 mx-auto p-5 border rounded-4 shadow-lg bg-white"
        style={{ maxWidth: "1200px", minHeight: "80vh" }}
      >
        <h2 className="text-center mb-4 fw-bold text-primary">🛒 Add Product</h2>

        <div className="mb-4 text-center">
          <label className="fw-bold me-2">Choose Category:</label>
          <select
            className="form-select w-auto d-inline-block border-primary"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="mobile">Mobile</option>
            <option value="laptop">Laptop</option>
            <option value="gadget">Gadget</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {renderFields()}

          <div className="mb-3">
            <label>Image</label>
            <input
              type="file"
              className="form-control"
              onChange={handleImage}
              accept="image/*"
            />
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-success px-4">
              Submit
            </button>
          </div>
        </form>

        {message && <div className="alert alert-info mt-3 text-center">{message}</div>}
      </div>
    </div>
  );
};

export default AddProduct;