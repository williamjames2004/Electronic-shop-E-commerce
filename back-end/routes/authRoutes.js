const express = require("express");
const { registerUser, loginUser, getdata } = require("../authControllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getdata/:userId", getdata);

module.exports = router;