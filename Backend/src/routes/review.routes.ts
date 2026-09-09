import { Router } from "express";
import {
  createProductReview,
  getProductReviews,
} from "../controllers/review.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// Anyone can view product reviews
router.get("/:id/reviews", getProductReviews);

// Only customers can submit a review
router.post("/:id/reviews", protect, authorize("customer"), createProductReview);

export default router;