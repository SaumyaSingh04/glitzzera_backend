import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    houseNo: {
      type: String,
      required: true
    },
    landmark: {
      type: String
    },
    address1: {
      type: String,
      required: true
    },
    address2: {
      type: String
    },
    state: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["Home", "Office"],
      default: "Home"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Address", addressSchema);
