import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrdersByUser,
  getOrderById,         
  updateOrderStatus,
  deleteOrder
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);                     //  create order
router.get("/", getAllOrders);                     //  all orders
router.get("/user/:userId", getOrdersByUser);      //  user orders
router.get("/:id", getOrderById);                  // get single order by ID
router.put("/:id", updateOrderStatus);             //  update status
router.delete("/:id", deleteOrder);                //  delete

export default router;
