import express from "express";
import upload from "../middleware/upload.js";
import {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
} from "../controllers/couponController.js";

const router = express.Router();

router.post("/", upload.single("image"), createCoupon);
router.get("/", getCoupons);
router.put("/:id", upload.single("image"), updateCoupon);
router.delete("/:id", deleteCoupon);

export default router;
