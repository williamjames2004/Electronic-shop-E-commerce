const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  securityId: { type: String, required: true, unique: true },
  securityCode: { type: String, required: true }, // hashed
  googleAuthSecret: { type: String, required: true }
});

module.exports = mongoose.model("Admin", adminSchema);