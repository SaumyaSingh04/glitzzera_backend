import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    catname: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    status: {
      type: Boolean,
      default: true
    },
    image: {
      type: String 
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Category", categorySchema);
