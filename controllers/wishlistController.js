// controllers/wishlistController.js
import Wishlist from "../models/wishlist.js";

export const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Check duplicate
    const exists = await Wishlist.findOne({ userId, productId });
    if (exists) return res.status(400).json({ message: "Already in wishlist" });

    const item = await Wishlist.create({ userId, productId });
    res.status(201).json({ message: "Added to wishlist", item });
  } catch (error) {
    res.status(500).json({ message: "Failed to add", error: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const items = await Wishlist.find({ userId }).populate("productId");
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch", error: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const removed = await Wishlist.findOneAndDelete({ userId, productId });

    if (!removed) return res.status(404).json({ message: "Not found in wishlist" });

    res.status(200).json({ message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove", error: error.message });
  }
};
