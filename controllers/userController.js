import User from "../models/userModel.js";

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
