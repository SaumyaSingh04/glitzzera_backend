import Coupon from "../models/coupon.js";

// ➕ Create coupon
export const createCoupon = async (req, res) => {
  try {
    const {
      title,
      desc,
      couponCode,
      amount,
      limit_of_use,
      status
    } = req.body;

    const imageUrl = req.file?.path || null;

    const coupon = await Coupon.create({
      title,
      desc,
      couponCode,
      amount,
      limit_of_use,
      status,
      image: imageUrl,
    });

    res.status(201).json({ message: "Coupon created", coupon });
  } catch (error) {
    res.status(500).json({ message: "Failed to create coupon", error: error.message });
  }
};

// 📥 Get all coupons
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch coupons", error: error.message });
  }
};

// ✏️ Update coupon
export const updateCoupon = async (req, res) => {
  try {
    const { title, desc, couponCode, amount, limit_of_use, status } = req.body;

    const updateData = {
      title,
      desc,
      couponCode,
      amount,
      limit_of_use,
      status,
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updated = await Coupon.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updated) return res.status(404).json({ message: "Coupon not found" });

    res.status(200).json({ message: "Coupon updated", coupon: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update coupon", error: error.message });
  }
};

// ❌ Delete coupon
export const deleteCoupon = async (req, res) => {
  try {
    const deleted = await Coupon.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Coupon not found" });

    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete coupon", error: error.message });
  }
};
