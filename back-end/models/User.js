const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        minlength: 8,
        uppercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: true,
        unique: true,
        match: /^[A-Za-z][A-Za-z0-9]{4,}$/
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
});

module.exports = mongoose.model("User", userSchema);