import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    orderId: String,
    paymentId: String,
    signature: String,

    userId: String,           // your registered user
    amount: Number,
    currency: { type: String, default: "INR" },

    method: String,           // upi / card / netbanking
    provider: String,         // gpay / phonepe / paytm / visa

    status: { type: String, default: "PENDING" },  // PENDING, SUCCESS, FAILED
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Transaction", transactionSchema);