import { razorpay } from "../config/razorpay.js";

export const createOrder = async (req, res) => {
    try {
        const { amount, userId } = req.body;

        const options = {
            amount: amount * 100,  // convert to paise
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);
        res.json(order);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};