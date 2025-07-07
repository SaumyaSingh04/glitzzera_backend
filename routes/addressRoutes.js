import express from "express";
import {
  addAddress,
  getAddressesByUser,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";

const router = express.Router();

router.post("/", addAddress);                    // ➕ Add new address
router.get("/:userId", getAddressesByUser);      // 📥 Get addresses for user
router.put("/:id", updateAddress);               // ✏️ Update address by ID
router.delete("/:id", deleteAddress);            // ❌ Delete address by ID

export default router;
