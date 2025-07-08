import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    shortTitle: { type: String, required: true },
    longTitle: { type: String, required: true },
    shortDesc: { type: String, required: true },
    longDesc: { type: String, required: true },
    status: { type: Boolean, default: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    images: [String],        // multiple Cloudinary image URLs
    video: { type: String }, // single Cloudinary video URL
    ratings: { type: Number, default: 0 },
    stockQty: { type: Number, default: 0 },
    is_oos: { type: Boolean, default: false },

    // ✅ Category reference
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // ✅ Sizes as inline object array 
    sizes: [
      {
        sizeName: { type: String, required: true },   // e.g., S, M, L
        stockQty: { type: Number, default: 0 },
        is_oos: { type: Boolean, default: false }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
