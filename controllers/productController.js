import Product from "../models/product.js";

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

// ✅ Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "catname") // populate category name
      .sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
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

    // Handle images (max 4 allowed in total)
    if (req.files?.images) {
      const newImages = req.files.images.map((file) => file.path);
      const combinedImages = [...existingProduct.images, ...newImages];
      updateData.images = combinedImages.slice(0, 4); // keep only first 4
      console.log("🖼️ Images received:", req.files?.images);

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
