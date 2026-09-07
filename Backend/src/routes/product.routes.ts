import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post("/", protect, authorize("supplier"), upload.single("image"), createProduct);
router.put("/:id", protect, authorize("supplier"), upload.single("image"), updateProduct);
router.delete("/:id", protect, authorize("supplier", "admin"), deleteProduct);

export default router;