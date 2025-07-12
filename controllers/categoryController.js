import Category from "../models/category.js";

//  Create
export const createCategory = async (req, res) => {
  try {
    const { catname, status } = req.body;

    // 🔍 Check for duplicate category name
    const existing = await Category.findOne({ catname });
    if (existing) {
      return res.status(400).json({ message: "Category with this name already exists" });
    }

    // 📦 Get uploaded image URL
    const imageUrl = req.file?.path || null;

    // ✅ Create new category
    const category = await Category.create({
      catname,
      status: status !== undefined ? status : true,
      image: imageUrl,
    });

    res.status(201).json({ message: "Category created", category });

  } catch (error) {
    res.status(500).json({ message: "Failed to create category", error: error.message });
  }
};

// Read all
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error: error.message });
  }
};

//  Read one
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category", error: error.message });
  }
};

//  Update
export const updateCategory = async (req, res) => {
  try {
    const { catname, status } = req.body;
    const updateData = {
      catname,
      status,
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updated = await Category.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ message: "Category updated", category: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update category", error: error.message });
  }
};

//  Delete
export const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category", error: error.message });
  }
};


export const getCategoryImageStats = async (req, res) => {
  try {
    // Fetch categories
    const categories = await Category.find();

    // Loop through each category and count images
    const result = await Promise.all(
      categories.map(async (cat) => {
        const products = await Product.find({ category: cat._id });
        const imageCount = products.reduce((acc, product) => {
          return acc + (product.images?.length || 0);
        }, 0);

        return {
          catname: cat.catname,
          categoryId: cat._id,
          imageCount,
        };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch image count per category",
      error: error.message,
    });
  }
};
