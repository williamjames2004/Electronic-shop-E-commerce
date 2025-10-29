const express = require("express");
const router = express.Router();
const {
  upload,
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
  deleteGadget,
  addMobilePrimary,
  addMobileFeatures
} = require("../authControllers/productController");

// Mobiles
router.post("/mobiles/primary", upload.single("image"), addMobilePrimary);
router.post("/mobiles/features", addMobileFeatures);
router.get("/mobiles", getMobiles);
router.put("/mobiles/:id", upload.single("image", updateMobile));
router.delete("/mobiles/:id", deleteMobile);

// Laptops
router.post("/laptops/primary", upload.single("image"), addLaptopPrimary);
router.post("/laptops/features", addLaptopFeatures);
router.get("/laptops", getLaptops);
router.put("/laptops/:id", upload.single("image", updateLaptop));
router.delete("/laptops/:id", deleteLaptop);

// Gadgets
router.post("/gadgets", upload.single("image"), addGadget);
router.get("/gadgets", getGadgets);
router.put("/gadgets/:id", upload.single("image", updateGadget));
router.delete("/gadgets/:id", deleteGadget);

module.exports = router;