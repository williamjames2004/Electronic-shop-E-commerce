const express = require("express");
const verifyAdmin = require("../middleware/verifyAdmin");

const router = express.Router();
const {
  upload,
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
  addMobilePrimary,
  addMobileFeatures,
  getproduct,
  upiPayment
} = require("../authControllers/productController");

// Mobiles
router.post("/mobiles/primary", verifyAdmin, upload.single("image"), addMobilePrimary);
router.put("/mobiles/features/:productId", verifyAdmin, addMobileFeatures);
router.get("/mobiles", getMobiles);
router.get("/mobilesid", getMobilesId);
router.get("/getmobile/:productId", getSingleMobileData);
router.put("/mobiles/:productId", verifyAdmin, upload.single("image"), updateMobile);
router.delete("/mobiles/:productId", verifyAdmin, deleteMobile);

// Laptops
router.post("/laptops/primary", verifyAdmin, upload.single("image"), addLaptopPrimary);
router.put("/laptops/features/:productId", verifyAdmin, addLaptopFeatures);
router.get("/laptops", getLaptops);
router.get("/laptops/getlaptop/:productId", getSinglieLaptop);
router.put("/laptops/:productId", verifyAdmin, upload.single("image"), updateLaptop);
router.delete("/laptops/:productId", verifyAdmin, deleteLaptop);

// Gadgets
router.post("/gadgets", verifyAdmin, upload.single("image"), addGadget);
router.get("/gadgets", getGadgets);
router.put("/gadgets/:productId", verifyAdmin, upload.single("image"), updateGadget);
router.delete("/gadgets/:productId", verifyAdmin, deleteGadget);

//get product
router.get("/getproduct/:productId", getproduct);

router.post("/upi-payment", upiPayment);

module.exports = router;