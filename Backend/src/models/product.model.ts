import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  supplier: mongoose.Types.ObjectId;
  rating: number;
  numReviews: number;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    description: { type: String, required: true, trim: true, minlength: 5, maxlength: 5000 },
    price: { type: Number, required: true, min: 0.01, max: 1000000000 },
    category: { type: String, required: true },
    image: { type: String, required: true },
    stock: { type: Number, required: true, default: 0, min: 0, validate: Number.isInteger },
    supplier: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", productSchema);