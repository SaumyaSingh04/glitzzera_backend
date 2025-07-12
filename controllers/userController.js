import User from "../models/userModel.js";
import Order from "../models/order.js";
import Wishlist from "../models/wishlist.js";
import Product from "../models/product.js"; 

// Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, alternatePhone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const avatarUrl = req.file?.path || "";

    const newUser = await User.create({
      name,
      email,
      password,
      phone,
      alternatePhone,
      avatar: avatarUrl,
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    res.status(200).json({
      message: "Login successful",
      userId: user._id,
      name: user.name,
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

export const getAllUsersWithDetails = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        // ✅ Orders by userId
        const orders = await Order.find({ userId: user._id })
          .populate("products.productId", "shortTitle price images")
          .populate("addressId", "name street city pincode phone")
          .lean();

        // ✅ Wishlist: collect productIds for this user
        const wishlistEntries = await Wishlist.find({ userId: user._id }).lean();

        const productIds = wishlistEntries.map((entry) => entry.productId);
        const wishlistProducts = await Product.find({ _id: { $in: productIds } }).select("shortTitle price images");

        return {
          user,
          orders: orders || [],
          wishlist: wishlistProducts || [],
        };
      })
    );

    res.status(200).json({
      count: usersWithDetails.length,
      users: usersWithDetails,
    });
  } catch (error) {
    console.error("❌ Error fetching user data:", error);
    res.status(500).json({ message: "Failed to fetch user data", error: error.message });
  }
};


