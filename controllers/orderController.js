import Order from "../models/order.js";

// ➕ Create order
export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      addressId,
      products,
      paymentInfo,
      orderStatus,
      totalAmount,
      discount,
      isPaid,
    } = req.body;

    const newOrder = await Order.create({
      userId,
      addressId,
      products,
      paymentInfo,
      orderStatus,
      totalAmount,
      discount,
      isPaid,
    });

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Failed to place order", error: error.message });
  }
};

// 📥 Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("addressId")
      .populate("products.productId", "shortTitle price images");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// 📤 Get order by user
export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("products.productId", "shortTitle price images")
      .populate("addressId");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user orders", error: error.message });
  }
};

// 🔍 Get order by ID ✅
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email")
      .populate("addressId")
      .populate("products.productId", "shortTitle price images");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error: error.message });
  }
};

// ✏️ Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: req.body.orderStatus },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order status updated", order: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status", error: error.message });
  }
};

// ❌ Delete order
export const deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order", error: error.message });
  }
};
