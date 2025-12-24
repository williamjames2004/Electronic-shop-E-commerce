const express = require("express");
const { adminLogin, googleAuthenticate, register } = require("../authControllers/adminController");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.post("/login", adminLogin);
router.post("/verify-otp", googleAuthenticate);
router.post("/create", adminAuth, (req,res)=>{
    res.status({message: "Access denied"});
});
router.post("/register", register);

module.exports = router;