import { Router } from "express";
import { getCategories, createCategory } from "../controllers/category.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.get("/", getCategories); // Public route for frontend filters
router.post("/", protect, authorize("admin"), createCategory); // Admin-only creation

export default router;