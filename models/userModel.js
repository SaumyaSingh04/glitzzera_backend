import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: String,
  phone: { type: String, required: true },
  avatar: String,
  alternatePhone: String,
}, { timestamps: true });

export default mongoose.model("User", userSchema);
