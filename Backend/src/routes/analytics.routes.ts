import { Router } from "express";
import {
  getAdminAnalytics,
  getTopProducts,
  getSupplierAnalytics,
} from "../controllers/analytics.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// All analytics routes require authentication
router.use(protect);

// Supplier routes
router.get("/supplier", authorize("supplier"), getSupplierAnalytics);

// Admin routes
router.get("/admin", authorize("admin"), getAdminAnalytics);
router.get("/admin/top-products", authorize("admin"), getTopProducts);

export default router;