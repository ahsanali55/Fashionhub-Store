import { Notification } from "../models/notification.model";

export const createNotification = async (
  userId: string, 
  message: string, 
  type: string, 
  meta?: { orderId?: string; productId?: string; status?: string }
) => {
  try {
    await Notification.create({ 
      userId, 
      message, 
      type, 
      status: meta?.status,
      orderId: meta?.orderId, 
      productId: meta?.productId 
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};