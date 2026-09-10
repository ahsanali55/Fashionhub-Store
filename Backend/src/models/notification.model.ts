import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  message: string;
  type: string;
  status: string;
  orderId?: mongoose.Types.ObjectId;   
  productId?: mongoose.Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    type: { type: String, required: true }, // e.g., "ORDER_PLACED", "STATUS_UPDATE"
    status: { type: String }, // e.g., "pending", "processing", "shipped", "delivered"
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },     // <-- Added
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>("Notification", notificationSchema);