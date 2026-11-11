import { Notification } from "../models/notification.model";
import User from "../models/user.model";

export const createNotification = async (
  userId: string, 
  message: string, 
  type: string, 
  meta?: { orderId?: string; productId?: string; status?: string }
) => {
  try {
    const user = await User.findById(userId).select("notificationsEnabled");
    if (!user || user.notificationsEnabled === false) return;
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