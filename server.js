import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {connectDB} from "./db/connectDB.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// Routes
app.use("/api/users", userRoutes);

app.use("/", (req, res) => {
  res.send("API working");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
