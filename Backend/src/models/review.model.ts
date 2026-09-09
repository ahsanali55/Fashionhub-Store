import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number; // 1 to 5
  numReviews: number;
  comment: string;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Prevent a user from reviewing the same product multiple times if desired, 
// or let them review per order. For simplicity, let's allow 1 review per user per product:
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

export const Review = mongoose.model<IReview>("Review", reviewSchema);