import express from "express";
import upload from "../middleware/upload.js";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryStats,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", upload.single("image"), createCategory);
router.get("/", getCategories);
router.get("/stats", getCategoryStats); // ✅ moved up
router.get("/:id", getCategoryById);
router.put("/:id", upload.single("image"), updateCategory);
router.delete("/:id", deleteCategory);

export default router;
