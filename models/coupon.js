import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  couponCode: {
    type: String,
    required: true,
    unique: true, 
    uppercase: true, 
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  times_used: {
    type: Number,
    default: 0,
  },
  limit_of_use: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  image: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model("Coupon", couponSchema);
