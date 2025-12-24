const express = require("express");
const bcrypt = require("bcryptjs");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminSchema");

const adminLogin = async (req, res) => {
  const { securityId, securityCode } = req.body;

  const admin = await Admin.findOne({ securityId });
  if (!admin) return res.status(400).json({ message: "Invalid login" });

  const isMatch = await bcrypt.compare(securityCode, admin.securityCode);
  if (!isMatch) return res.status(400).json({ message: "Incorrect credentials" });

  // Temporary token for step 2
  const tempToken = jwt.sign({ id: admin._id }, "TEMP_SECRET", { expiresIn: "5m" });

  res.json({ message: "Proceed to Google Auth", tempToken });
};

const googleAuthenticate = async (req, res) => {
  const { otp, tempToken } = req.body;

  const decoded = jwt.verify(tempToken, "TEMP_SECRET");
  const admin = await Admin.findById(decoded.id);

  const verified = speakeasy.totp.verify({
    secret: admin.googleAuthSecret,
    encoding: "base32",
    token: otp
  });

  if (!verified) return res.status(400).json({ message: "Invalid OTP" });

  // Now give final admin token
  const finalToken = jwt.sign({ id: admin._id, role: "admin" }, "ADMIN_SECRET", {
    expiresIn: "6h"
  });

  res.json({ message: "Login successful", token: finalToken });
}

const register = async(req,res) => {
    try {
    const { securityId, securityCode } = req.body;
    console.log(securityId+" "+securityCode);

    // check required fields
    if (!securityId || !securityCode) {
      return res.status(400).json({ message: "All fields required" });
    }

    // check if admin already exists
    const existing = await Admin.findOne({ securityId });
    if (existing)
      return res.status(400).json({ message: "Admin already registered" });

    // generate Google Auth secret
    const secret = speakeasy.generateSecret({
      name: "YourWebsite Admin",
    });

    // QR code for Google Authenticator app
    const qrCodeImageUrl = await qrcode.toDataURL(secret.otpauth_url);

    // save in DB
    const hashedCode = await bcrypt.hash(securityCode, 10);

    const admin = new Admin({
      securityId,
      securityCode: hashedCode,
      googleAuthSecret: secret.base32
    });

    await admin.save();

    return res.json({
      message: "Admin registered successfully",
      googleAuthSecret: secret.base32,
      qrCodeImageUrl,
      note: "Scan this QR inside Google Authenticator"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
}

module.exports = { adminLogin, googleAuthenticate, register };