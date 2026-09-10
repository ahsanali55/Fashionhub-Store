import { Request, Response } from "express";
import { Notification } from "../models/notification.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

// 1. Get logged-in user's notifications
export const getMyNotifications = asyncHandler(async (req: Request, res: Response) => {
  const notifications = await Notification.find({ userId: req.user?._id }).sort({ createdAt: -1 });
  if (!notifications || notifications.length === 0) {
    throw new ApiError(404, "Notification not found");
  }
  return res.status(200).json(
    new ApiResponse("Notifications fetched successfully", notifications)
  );
});

// for View button then mark as read
// 2. Mark a notification as read (PATCH /notifications/:id/read customer or supplier)
export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("Marks As Read request for notification ID: ", id);
  console.log("Current Logged-in User ID from Token:", req.user?._id);

  // Find the notification first to see what userId it actually has stored
  const existingNotification = await Notification.findById(id);
  console.log("Notification found in DB:", existingNotification);

  const notification = await Notification.findOneAndUpdate(
    { _id: id, userId: req.user?._id },
    { isRead: true },
    { returnDocument: "after" }
  );

  if (!notification) {
    throw new ApiError(404, "Notification not found or unauthorized");
  }

  return res.status(200).json(
    new ApiResponse("Notification marked as read", notification)
  );
});

// Get all notifications across the entire platform (Admin only)
export const getAllNotificationsForAdmin = asyncHandler(async (req: Request, res: Response) => {
  const notifications = await Notification.find({})
    .populate("userId", "fullName email role") // Populates user details so admin knows who the notification belongs to
    .sort({ createdAt: -1, _id: -1 });

  return res.status(200).json(
    new ApiResponse("All platform notifications fetched successfully", notifications || [])
  );
});