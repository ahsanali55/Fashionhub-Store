import { Router } from "express";
import { getAllNotificationsForAdmin, getMyNotifications, markAsRead } from "../controllers/notification.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.use(protect);
router.get("/my", getMyNotifications);
router.patch("/:id/read", markAsRead);
router.get("/admin/all", authorize("admin"), getAllNotificationsForAdmin);

export default router;