import express from "express";
import upload from "../middleware/upload.js";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryImageStats,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", upload.single("image"), createCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.put("/:id", upload.single("image"), updateCategory);
router.get("/category/image-stats", getCategoryImageStats);
router.delete("/:id", deleteCategory);

export default router;
