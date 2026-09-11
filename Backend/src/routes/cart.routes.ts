import { Router } from "express";
import { getCart, addToCart, removeFromCart } from "../controllers/cart.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();
router.use(protect);
router.get("/", getCart);
router.post("/", addToCart);
router.delete("/:productId", removeFromCart);

export default router;