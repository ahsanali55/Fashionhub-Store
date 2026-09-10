import mongoose, { Schema, Document } from "mongoose";

export interface IShippingAddress {
  address: string;
  city: string;
  postalCode: string;
}
export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  status: string;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  total: number;
  shippingAddress: IShippingAddress;
  paymentMethod: string; 
  status: "pending" | "processing" | "shipped" | "delivered";
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        status: {
          type: String,
          enum: ["pending", "processing", "shipped", "delivered"],
          default: "pending",
        },
      },
    ],
    total: { type: Number, required: true },
    shippingAddress: { 
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },

    },
    paymentMethod: { 
      type: String,
      enum: ["Cash on Delivery"],
      default: "Cash on Delivery",
      required: true,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);