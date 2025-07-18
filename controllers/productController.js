import Product from "../models/product.js";
import Category from "../models/category.js";

// ✅ Create Product
export const createProduct = async (req, res) => {
  try {
    const {
      shortTitle,
      longTitle,
      shortDesc,
      longDesc,
      status,
      price,
      discountPrice,
      ratings,
      stockQty,
      is_oos,
      category,
      sizes
    } = req.body;

    const images = req.files?.images?.map((file) => file.path) || [];
    const video = req.files?.video?.[0]?.path || null;

    const product = await Product.create({
      shortTitle,
      longTitle,
      shortDesc,
      longDesc,
      status,
      price,
      discountPrice,
      ratings,
      stockQty,
      is_oos,
      category,
      sizes: sizes ? JSON.parse(sizes) : [],
      images,
      video,
    });

    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    console.error("❌ Product creation error:", error);
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};

    if (search) {
      query = {
        $or: [
          { shortTitle: { $regex: search, $options: "i" } },
          { longTitle: { $regex: search, $options: "i" } },
        ],
      };
    }

    const products = await Product.find(query)
      .populate("category", "catname")
      .sort({ createdAt: -1 });

    const totalCount = products.length;
    const activeCount = products.filter(p => p.status === true).length;
    const inactiveCount = totalCount - activeCount;

    let lowStockCount = 0;
    let outOfStockCount = 0;

    products.forEach(product => {
      const stock = product.stockQty || 0;
      if (stock === 0) outOfStockCount++;
      else if (stock <= 5) lowStockCount++;
    });

    res.status(200).json({
      products,
      totalCount,
      activeCount,
      inactiveCount,
      lowStockCount,
      outOfStockCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// ✅ Get Product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "catname");
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error: error.message });
  }
};

// ✅ Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updateData = { ...req.body };

    // Safely parse sizes JSON
    if (updateData.sizes) {
      try {
        updateData.sizes = JSON.parse(updateData.sizes);
      } catch (e) {
        return res.status(400).json({ message: "Invalid sizes format" });
      }
    }

    // Handle images (replace last image(s) if new images are uploaded)
    if (req.files?.images) {
      const newImages = req.files.images.map((file) => file.path);
      let existingImages = existingProduct.images || [];

      const spaceLeft = 4 - newImages.length;
      if (spaceLeft < 0) {
        return res.status(400).json({ message: "Too many new images. Maximum 4 allowed." });
      }

      // Keep only as many old images as we can
      existingImages = existingImages.slice(0, spaceLeft);
      updateData.images = [...existingImages, ...newImages];
    } else {
      updateData.images = existingProduct.images;
    }

    // Handle video
    if (req.files?.video?.[0]) {
      updateData.video = req.files.video[0].path;
    } else {
      updateData.video = existingProduct.video;
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ message: "Product updated", product: updated });
  } catch (error) {
    console.error("❌ Update error:", error);
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

// ✅ Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};

export const removeSingleProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imagePath } = req.body; // full image path to delete

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if image exists
    if (!product.images.includes(imagePath)) {
      return res.status(400).json({ message: "Image not found in product" });
    }

    // Remove the image
    const updatedImages = product.images.filter((img) => img !== imagePath);
    product.images = updatedImages;

    await product.save();

    res.status(200).json({ message: "Image removed", images: product.images });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove image", error: error.message });
  }
};

export const getProductsByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const products = await Product.find({ category: categoryId }).populate("category", "catname");

    res.status(200).json({
      success: true,
      categoryId,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products by category ID",
      error: error.message,
    });
  }
};

// ✅ Toggle isNewCollection
export const toggleNewCollection = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.isNewCollection = !product.isNewCollection;
    await product.save();

    res.status(200).json({
      message: `isNewCollection toggled to ${product.isNewCollection}`,
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to toggle isNewCollection",
      error: error.message,
    });
  }
};

// ✅ Get Products by Category Name (like "ring", "necklace")
export const getProductsByCategoryName = async (req, res) => {
  try {
    const { catname } = req.params;

    const category = await Category.findOne({
      catname: { $regex: new RegExp(`^${catname}$`, "i") }
    });

    if (!category) {
      return res.status(404).json({ message: `Category '${catname}' not found` });
    }

    const products = await Product.find({ category: category._id }).populate("category", "catname");

    res.status(200).json({ catname, products });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products by category name",
      error: error.message,
    });
  }
};
