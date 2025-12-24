const MobilePrimary = require("../models/Products/MobilePrimary");
const MobileFeatures = require("../models/Products/MobileFeatures");
const LaptopPrimary = require("../models/Products/LaptopPrimary");
const LaptopFeatures = require("../models/Products/LaptopFeatures");
const Gadget = require("../models/Products/Gadget");
const multer = require("multer");
const fs = require("fs");
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

    // ---- Validate Required Fields ----
    if (!image || !name || !brand || !price) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: image, name, brand, or price",
      });
    }

    const productId = uuidv4();

    // ---- Save Primary Details ----
    const newMobilePrimary = await MobilePrimary.create({
      productId,
      image,
      name,
      brand,
      price,
      stock,
    });

    // ---- Create Empty Features Document ----
    await MobileFeatures.create({
      productId,
      variants: [],
      processor: {},
      osDetails: {},
      display: {},
      design: {},
      rearCamera: {
        primary: {},
        secondary: {},
        features: [],
        videoRecording: [],
      },
      frontCamera: {
        features: [],
        videoRecording: [],
      },
      battery: [],
      storageDetails: {},
      connectivity: {},
      sensors: {
        otherSensors: [],
      },
      general: {},
    });

    // ---- Response ----
    return res.status(201).json({
      success: true,
      message: "✅ Mobile primary details saved and empty features created!",
      data: newMobilePrimary,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "❌ Error adding mobile primary",
      error: error.message,
    });
  }
};

// ---------- Add Mobile Features ----------
const addMobileFeatures = async (req, res) => {
  try {
    const { productId } = req.params;

    const updated = await MobileFeatures.findOneAndUpdate(
      { productId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Mobile features not found" });
    }

    res.status(200).json({
      success: true,
      message: "Mobile features updated successfully",
      data: updated,
    });

  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
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

const getMobilesId = async (req,res) => {
  try{
  const mobileData = await MobilePrimary.find({}, "productId name"); // only fetch these fields

    // Transform the data (optional)
    const mobiles = mobileData.map(mobile => ({
      productId: mobile.productId,
      mobileName: mobile.name,
    }));

    res.status(200).json({success: true,mobiles});
  } catch (err) {
    res.status(500).json({success: false, message: "Error fetching mobiles id",error: err.message,});
  }
}

const getSingleMobileData = async (req,res) => {
  try{
    const productId = req.params.id;
    const primarydata = await MobilePrimary.findOne({productId: productId});
    const featuredata = await MobileFeatures.findOne({productId: productId});
    if(primarydata){
      res.status(200).json({success: true, primary: primarydata, features: featuredata});
    }
    else{
      res.status(404).json({success: false});
    }
  } catch (error){
    res.status(500).json({success: false, message: "Error fetching mobile ", error: error.message});
  }
}

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

    const productId = uuidv4();

    const newLaptopPrimary = new LaptopPrimary({
      productId,
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

    // 🔥 CREATE EMPTY FEATURES ROW AUTOMATICALLY
    await LaptopFeatures.create({
      productId,
      ...LaptopFeatures
    });

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
    const { productId } = req.params;

    const updated = await LaptopFeatures.findOneAndUpdate(
      { productId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Laptop features not found" });
    }

    res.status(200).json({
      success: true,
      message: "Laptop features updated successfully",
      data: updated,
    });

  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

const getLaptops = async (req, res) => {
  try {
    const laptopprimary = await LaptopPrimary.find({}, "productId name");
    const primary = await LaptopPrimary.find();
    const features = await LaptopFeatures.find();

    const laptops = laptopprimary.map(laptop => ({
      productId: laptop.productId,
      laptopname: laptop.name,
    }));
    res.status(200).json({ success: true,laptops, primary: primary, features: features});
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching laptops", error: error.message });
  }
};

const getSinglieLaptop = async(req,res) => {
  try{
    const productId = req.params.id;
    const laptopprimary = await LaptopPrimary.findOne({productId: productId});
    const laptopfeatures = await LaptopFeatures.findOne({productId: productId});
    if(LaptopPrimary){
      res.status(201).json({success: true, primary: laptopprimary, features: laptopfeatures});
    }
    else{
      res.status(404).json({success: false});
    }
  } catch (error){
    res.status(500).json({success: false, message: "Error fetching laptop", error: error.message});
  }
}

// ---------- Gadgets ----------
const addGadget = async (req, res) => {
  try {
    const { name, type, brand, connectivity, batteryLife, noiseCancellation, price, stock } = req.body;
    const image = req.file ? req.file.filename : null;

    const missing = checkMissingFields({ image, name, type, brand, price });
    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing fields: ${missing.join(", ")}` });
    }

    const productId = uuidv4();

    const newGadget = new Gadget({
      productId,
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
    console.error(error);
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

const updateMobile = async (req, res) => {
  const { productId } = req.params;

  try {
    const mobile = await MobilePrimary.findOne({ productId });

    if (!mobile) {
      return res.status(404).json({
        success: false,
        message: "Mobile not found",
      });
    }

    // Update only fields sent in request
    mobile.name = req.body.name ?? mobile.name;
    mobile.brand = req.body.brand ?? mobile.brand;
    mobile.price = req.body.price ?? mobile.price;
    mobile.stock = req.body.stock ?? mobile.stock;

    // 🔥 IMAGE HANDLING (same logic as laptop)
    if (req.file) {
      if (req.file.size > 0) {
        // Delete old image
        if (mobile.image && fs.existsSync(path.join("uploads", mobile.image))) {
          fs.unlinkSync(path.join("uploads", mobile.image));
        }

        // Replace with new image
        mobile.image = req.file.filename;

      } else {
        // Delete 0-byte unwanted uploaded file
        fs.unlinkSync(path.join("uploads", req.file.filename));
      }
    }

    // Save final updated mobile
    const updatedMobile = await mobile.save();

    res.status(200).json({
      success: true,
      message: "Mobile updated successfully",
      data: updatedMobile,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating mobile",
      error: error.message,
    });
  }
};

const deleteMobile1 = async (req,res) => {
  const { productId } = req.params;
  try {
    await Mobile.findByIdAndDelete(productId);
    res.status(200).json({ success: true, message: "✅ Mobile deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Error deleting mobile", error: error.message });
  }
}

const deleteMobile = async (req, res) => {
  const { productId } = req.params;

  try {
    // Find gadget by productId
    const Mobile = await MobilePrimary.findOne({ productId });
    const features = await MobileFeatures.findOne({ productId });

    if (!Mobile) {
      return res.status(404).json({
        success: false,
        message: "Mobile not found",
      });
    }

    // Delete the image from uploads folder
    if (Mobile.image && fs.existsSync(path.join("uploads", Mobile.image))) {
      fs.unlinkSync(path.join("uploads", Mobile.image));
    }

    // Delete gadget document
    await Mobile.deleteOne({ productId });
    await features.deleteOne({productId});

    res.status(200).json({
      success: true,
      message: "Mobile deleted successfully!",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error deleting Mobile",
      error: error.message,
    });
  }
};
const updateLaptop = async (req, res) => {
  const { productId } = req.params;

  try {
    const laptop = await LaptopPrimary.findOne({ productId });
    if (!laptop) {
      return res.status(404).json({
        success: false,
        message: "Laptop not found",
      });
    }

    // Apply updates
    laptop.name = req.body.name ?? laptop.name;
    laptop.brand = req.body.brand ?? laptop.brand;
    laptop.processor = req.body.processor ?? laptop.processor;
    laptop.ram = req.body.ram ?? laptop.ram;
    laptop.storage = req.body.storage ?? laptop.storage;
    laptop.price = req.body.price ?? laptop.price;
    laptop.stock = req.body.stock ?? laptop.stock;

    // 🔥 IMAGE HANDLING (this is where deletion code goes)

    if (req.file) {
      if (req.file.size > 0) {
        // 🔥 Delete old image file
        if (laptop.image && fs.existsSync(path.join("uploads", laptop.image))) {
          fs.unlinkSync(path.join("uploads", laptop.image));
        }

        // Replace with new image
        laptop.image = req.file.filename;

      } else {
        // 🔥 Delete unwanted empty file
        fs.unlinkSync(path.join("uploads", req.file.filename));
      }
    }

    const updatedLaptop = await laptop.save();

    res.status(200).json({
      success: true,
      message: "Laptop updated successfully",
      data: updatedLaptop,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating laptop",
      error: error.message,
    });
  }
};

const deleteLaptop = async (req, res) => {
  const { productId } = req.params;

  try {
    // Find gadget by productId
    const Laptop = await LaptopPrimary.findOne({ productId });
    const features = await LaptopFeatures.findOne({ productId });

    if (!Laptop) {
      return res.status(404).json({
        success: false,
        message: "Laptop not found",
      });
    }

    // Delete the image from uploads folder
    if (Laptop.image && fs.existsSync(path.join("uploads", Laptop.image))) {
      fs.unlinkSync(path.join("uploads", Laptop.image));
    }

    // Delete gadget document
    await Laptop.deleteOne({ productId });
    await features.deleteOne({ productId });

    res.status(200).json({
      success: true,
      message: "Laptop deleted successfully!",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error deleting Laptop",
      error: error.message,
    });
  }
};
const updateGadget = async (req, res) => {
  const { productId } = req.params;

  try {
    const gadget = await Gadget.findOne({ productId });

    if (!gadget) {
      return res.status(404).json({
        success: false,
        message: "Gadget not found",
      });
    }

    // Update only fields sent in request
    gadget.name = req.body.name ?? gadget.name;
    gadget.type = req.body.type ?? gadget.type;
    gadget.brand = req.body.brand ?? gadget.brand;
    gadget.connectivity = req.body.connectivity ?? gadget.connectivity;
    gadget.batteryLife = req.body.batteryLife ?? gadget.batteryLife;
    gadget.noiseCancellation = req.body.noiseCancellation ?? gadget.noiseCancellation;
    gadget.price = req.body.price ?? gadget.price;
    gadget.stock = req.body.stock ?? gadget.stock;

    // 🔥 IMAGE HANDLING (same logic as laptop & mobile)
    if (req.file) {
      if (req.file.size > 0) {
        // Delete old image
        if (gadget.image && fs.existsSync(path.join("uploads", gadget.image))) {
          fs.unlinkSync(path.join("uploads", gadget.image));
        }

        // Save new image
        gadget.image = req.file.filename;

      } else {
        // Delete 0-byte file
        fs.unlinkSync(path.join("uploads", req.file.filename));
      }
    }
    const updatedGadget = await gadget.save();

    res.status(200).json({
      success: true,
      message: "Gadget updated successfully",
      data: updatedGadget,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating gadget",
      error: error.message,
    });
  }
};
const deleteGadget = async (req, res) => {
  const { productId } = req.params;

  try {
    // Find gadget by productId
    const gadget = await Gadget.findOne({ productId });

    if (!gadget) {
      return res.status(404).json({
        success: false,
        message: "Gadget not found",
      });
    }

    // Delete the image from uploads folder
    if (gadget.image && fs.existsSync(path.join("uploads", gadget.image))) {
      fs.unlinkSync(path.join("uploads", gadget.image));
    }

    // Delete gadget document
    await Gadget.deleteOne({ productId });

    res.status(200).json({
      success: true,
      message: "Gadget deleted successfully!",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error deleting gadget",
      error: error.message,
    });
  }
};

const getproduct = async (req, res) => {
  const { productId } = req.params; // productid not productId

  try {
    // 1. Try mobile
    const mobile = await MobilePrimary.findOne({ productId });
    if (mobile) {
      const features = await MobileFeatures.findOne({ productId });
      return res.status(200).json({
        success: true,
        type: "mobile",
        primary: mobile,
        features
      });
    }

    // 2. Try laptop
    const laptop = await LaptopPrimary.findOne({ productId });
    if (laptop) {
      const features = await LaptopFeatures.findOne({ productId });
      return res.status(200).json({
        success: true,
        type: "laptop",
        primary: laptop,
        features
      });
    }

    // 3. Try gadget
    const gadget = await Gadget.findOne({ productId });
    if (gadget) {
      return res.status(200).json({
        success: true,
        type: "gadget",
        primary: gadget
      });
    }

    // If none found
    if (!mobile || !laptop || !gadget)
    res.status(404).json({
      success: false,
      message: "No product found with this product ID"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

const upiPayment = (req,res)=>{
  const {amount, productName, upiId} = req.body;

  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(productName)}&am=${amount}&cu=INR`;

  res.json({
    success:true,
    upiLink,
  });
}


// ---------- Export ----------
module.exports = {
  upload,
  addMobilePrimary,
  addMobileFeatures,
  getMobiles,
  getMobilesId,
  getSingleMobileData,
  getSinglieLaptop,
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
  deleteGadget,
  getproduct,
  upiPayment
};