import crypto from "crypto";
import Transaction from "../models/Transaction.js";

export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            userId
        } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expected = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(sign)
            .digest("hex");

        if (expected !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

        const txn = await Transaction.create({
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
            userId,
            method: req.body.method,         // upi / card / netbanking
            provider: req.body.provider,     // gpay / phonepe
            amount: req.body.amount,
            status: "SUCCESS"
        });

        res.json({ success: true, transaction: txn });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};