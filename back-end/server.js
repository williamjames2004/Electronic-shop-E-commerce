const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/backend", authRoutes);
app.use("/backend", productRoutes); // <--- Add this line
app.use("/uploads", express.static("uploads"));
app.use("/admin", adminRoutes);

// DB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
