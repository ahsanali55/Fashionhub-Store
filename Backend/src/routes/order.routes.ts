import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getSupplierOrders,
  getAllOrdersForAdmin,
} from "../controllers/order.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// All order routes require authentication
router.use(protect);

// Customer routes
router.post("/", authorize("customer"), createOrder);
router.get("/my", authorize("customer"), getMyOrders);

// Supplier & Admin routes
router.get("/supplier/orders", authorize("supplier"), getSupplierOrders);
router.get("/admin/orders", authorize("admin"), getAllOrdersForAdmin);

// Shared / Specific ID routes
router.get("/:id", getOrderById);
router.patch("/:id/status", authorize("supplier"), updateOrderStatus);

export default router; 