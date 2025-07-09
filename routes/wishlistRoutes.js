// routes/wishlistRoutes.js
import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist
} from "../controllers/wishlistController.js";

const router = express.Router();

router.post("/", addToWishlist);             // Add to wishlist
router.get("/:userId", getWishlist);         // Get user's wishlist
router.delete("/", removeFromWishlist);      // Remove from wishlist

export default router;
