import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db/connectDB.js";
import userRoutes from "./routes/userRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import categoryRoutes from "./routes/categoryRoute.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Needed for form-data fields

// DB Connection
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

// Default route
app.use("/", (req, res) => {
  res.send("API working");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
