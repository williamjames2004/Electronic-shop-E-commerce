const MobilePrimary = require("../models/Products/MobilePrimary");
const MobileFeatures = require("../models/Products/MobileFeatures");
const LaptopPrimary = require("../models/Products/LaptopPrimary");
const LaptopFeatures = require("../models/Products/LaptopFeatures");
const Gadget = require("../models/Products/Gadget");
const multer = require("multer");
const path = require("path");
const {v4:uuidv4} = require("uuid");

// ---------- Multer Configuration ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ---------- Helper Function for Field Validation ----------
const checkMissingFields = (fields) => {
  const missing = [];
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === "") {
      missing.push(key);
    }
  }
  return missing;
};

// ---------- Add Mobile Primary ----------
const addMobilePrimary = async (req, res) => {
  try {
    const { name, brand, price, stock } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!image || !name || !brand || !price) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: image, name, brand, or price",
      });
    }

    const mobileId = uuidv4(); // generate a unique ID

    const newMobilePrimary = new MobilePrimary({
      mobileId,
      image,
      name,
      brand,
      price,
      stock,
    });

    await newMobilePrimary.save();

    res.status(201).json({
      success: true,
      message: "✅ Mobile primary details saved!",
      data: newMobilePrimary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "❌ Error adding mobile primary",
      error: error.message,
    });
  }
};

// ---------- Add Mobile Features ----------
const addMobileFeatures = async (req, res) => {
  try {
    const {
      mobileId,
      variants,
      processor,
      osDetails,
      display,
      design,
      rearCamera,
      frontCamera,
      battery,
      storageDetails,
      connectivity,
      sensors,
      general,
    } = req.body;

    if (!mobileId) {
      return res.status(400).json({
        success: false,
        message: "mobileId is required to add features.",
      });
    }

    // ✅ Improved safeParse – only parse if it's a stringified JSON
    const safeParse = (value) => {
      if (!value) return undefined;
      if (typeof value === "string") {
        try {
          console.log(JSON.parse(value));
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
      return value;
    };

    // ✅ Detect if body is JSON or form-data
    const isJson = req.is('application/json');

    const newMobileFeatures = new MobileFeatures({
      mobileId,
      variants: isJson ? variants : safeParse(variants),
      processor: isJson ? processor : safeParse(processor),
      osDetails: isJson ? osDetails : safeParse(osDetails),
      display: isJson ? display : safeParse(display),
      design: isJson ? design : safeParse(design),
      rearCamera: isJson ? rearCamera : safeParse(rearCamera),
      frontCamera: isJson ? frontCamera : safeParse(frontCamera),
      battery: isJson ? battery : safeParse(battery),
      storageDetails: isJson ? storageDetails : safeParse(storageDetails),
      connectivity: isJson ? connectivity : safeParse(connectivity),
      sensors: isJson ? sensors : safeParse(sensors),
      general: isJson ? general : safeParse(general),
    });

    await newMobileFeatures.save();

    res.status(201).json({
      success: true,
      message: "✅ Mobile features added successfully!",
      data: newMobileFeatures,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "❌ Error adding mobile features",
      error: error.message,
    });
  }
};

const getMobiles = async (req, res) => {
  try {
    const primarydata = await MobilePrimary.find();
    const featuredata = await MobileFeatures.find();
    res.status(200).json({ success: true, primary: primarydata, features: featuredata});
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching mobiles", error: error.message });
  }
};

// ---------- Add Laptop Primary ----------
const addLaptopPrimary = async (req, res) => {
  try {
    const { name, brand, processor, ram, storage, price, stock } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!image || !name || !brand || !processor || !ram || !storage || !price) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const laptopId = uuidv4();

    const newLaptopPrimary = new LaptopPrimary({
      laptopId,
      image,
      name,
      brand,
      processor,
      ram,
      storage,
      price,
      stock,
    });

    await newLaptopPrimary.save();

    res.status(201).json({
      success: true,
      message: "✅ Laptop primary details saved!",
      data: newLaptopPrimary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "❌ Error adding laptop primary",
      error: error.message,
    });
  }
};

// ---------- Add Laptop Specs ----------
const addLaptopFeatures = async (req, res) => {
  try {
    const { laptopId } = req.body;

    if (!laptopId) {
      return res.status(400).json({
        success: false,
        message: "laptopId is required to link specs",
      });
    }

    const existingLaptop = await LaptopPrimary.findOne({ laptopId });
    if (!existingLaptop) {
      return res.status(404).json({
        success: false,
        message: "Laptop primary not found for this laptopId",
      });
    }

    const newLaptopSpecs = new LaptopFeatures(req.body);
    await newLaptopSpecs.save();

    res.status(201).json({
      success: true,
      message: "✅ Laptop specs saved successfully!",
      data: newLaptopSpecs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "❌ Error adding laptop specs",
      error: error.message,
    });
  }
};

const getLaptops = async (req, res) => {
  try {
    const laptopprimary = await LaptopPrimary.find();
    const laptopfeatures = await LaptopFeatures.find();
    res.status(200).json({ success: true, primary: laptopprimary, features: laptopfeatures});
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching laptops", error: error.message });
  }
};

// ---------- Gadgets ----------
const addGadget = async (req, res) => {
  try {
    const { name, type, brand, connectivity, batteryLife, noiseCancellation, price, stock } = req.body;
    const image = req.file ? req.file.filename : null;

    const missing = checkMissingFields({ image, name, type, brand, price });
    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing fields: ${missing.join(", ")}` });
    }

    const newGadget = new Gadget({
      image,
      name,
      type,
      brand,
      connectivity,
      batteryLife,
      noiseCancellation,
      price,
      stock,
    });

    await newGadget.save();
    res.status(201).json({ success: true, message: "✅ Gadget added successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Error adding gadget", error: error.message });
  }
};

const getGadgets = async (req, res) => {
  try {
    const gadgets = await Gadget.find();
    res.status(200).json({ success: true, data: gadgets });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching gadgets", error: error.message });
  }
};

const updateMobile = async (req,res) => {
  const { id } = req.params;
  try {
    const updatedMobile = await updateProduct(Mobile, id, req);
    res.status(200).json({ success: true, message: "✅ Mobile updated successfully!", data: updatedMobile });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Error updating mobile", error: error.message });
  }
}
const deleteMobile = async (req,res) => {
  const { id } = req.params;
  try {
    await Mobile.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "✅ Mobile deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Error deleting mobile", error: error.message });
  }
}
const updateLaptop = async (req,res) => {
  const { id } = req.params;
  try {
    const updatedLaptop = await updateProduct(Laptop, id, req);
    res.status(200).json({ success: true, message: "✅ Laptop updated successfully!", data: updatedLaptop });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Error updating laptop", error: error.message });
  }
}
const deleteLaptop = async (req,res) => {
  const { id } = req.params;
  try {
    await Laptop.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "✅ Laptop deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Error deleting laptop", error: error.message });
  }
}
const updateGadget = async (req,res) => {
  const { id } = req.params;
  try {
    const updatedGadget = await updateProduct(Gadget, id, req);
    res.status(200).json({ success: true, message: "✅ Gadget updated successfully!", data: updatedGadget });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Error updating gadget", error: error.message });
  }
}
const deleteGadget = async (req,res) => {
  const { id } = req.params;
  try {
    await Gadget.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "✅ Gadget deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Error deleting gadget", error: error.message });
  }
}



// ---------- Export ----------
module.exports = {
  upload,
  addMobilePrimary,
  addMobileFeatures,
  getMobiles,
  updateMobile,
  deleteMobile,
  addLaptopPrimary,
  addLaptopFeatures,
  getLaptops,
  updateLaptop,
  deleteLaptop,
  addGadget,
  getGadgets,
  updateGadget,
  deleteGadget
};