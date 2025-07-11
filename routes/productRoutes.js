import express from "express";
import upload from "../middleware/upload.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  removeSingleProductImage,
} from "../controllers/productController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 4 },         
    { name: "video", maxCount: 1 }
  ]),
  createProduct
);

router.get("/", getProducts);
router.get("/:id", getProductById);
router.put(
  "/:id",
  upload.fields([
    { name: "images", maxCount: 4 },
    { name: "video", maxCount: 1 }
  ]),
  updateProduct
);
router.put("/remove-image/:id", removeSingleProductImage);

router.delete("/:id", deleteProduct);

export default router;
