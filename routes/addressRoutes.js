import express from "express";
import {
  addAddress,
  getAddressesByUser,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";

const router = express.Router();

router.post("/", addAddress);                    
router.get("/:userId", getAddressesByUser);     
router.put("/:id", updateAddress);               
router.delete("/:id", deleteAddress);            

export default router;
