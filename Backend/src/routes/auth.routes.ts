import { Router } from "express";
import {
  getCurrentUserProfile,
  login,
  register,
  getCustomerDashboard,
  getSupplierDashboard,
  getAdminDashboard,
  logout,
  getCurrentUser,
  refreshToken,
  updateAvatar,
  updateProfile,
  updateNotificationPreference,
  changePassword,
  getPasswordRecoveryQuestion,
  recoverPassword,
  setPasswordRecoveryQuestion,
} from "../controllers/auth.controller";
import {
  changePasswordSchema,
  loginSchema,
  notificationPreferenceSchema,
  profileSchema,
  recoverPasswordSchema,
  recoveryQuestionLookupSchema,
  registerSchema,
  setRecoveryQuestionSchema,
} from "../validations/auth.validation";
import { validate } from "../middleware/validate.middleware";
import { authorize } from "../middleware/role.middleware";
import { protect } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";
import {
  limitLoginAttempts,
  limitPasswordRecoveryAttempts,
} from "../middleware/loginRateLimit.middleware";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", limitLoginAttempts, validate(loginSchema), login);
router.post(
  "/password/recovery-question",
  limitPasswordRecoveryAttempts,
  validate(recoveryQuestionLookupSchema),
  getPasswordRecoveryQuestion,
);
router.post(
  "/password/recover",
  limitPasswordRecoveryAttempts,
  validate(recoverPasswordSchema),
  recoverPassword,
);
router.get("/me", protect, getCurrentUser);
router.get("/profile", protect, getCurrentUserProfile);
router.get("/customer-dashboard", protect, authorize("customer"), getCustomerDashboard);
router.get("/supplier-dashboard", protect, authorize("supplier"), getSupplierDashboard);
router.get("/admin-dashboard", protect, authorize("admin"), getAdminDashboard);
router.post("/refresh-token", refreshToken);
router.post("/logout", protect, logout);
router.patch("/avatar", protect, upload.single("avatar"), updateAvatar);
router.patch("/profile", protect, validate(profileSchema), updateProfile);
router.patch("/password", protect, validate(changePasswordSchema), changePassword);
router.patch(
  "/password/recovery-question",
  protect,
  validate(setRecoveryQuestionSchema),
  setPasswordRecoveryQuestion,
);
router.patch(
  "/notification-preference",
  protect,
  authorize("customer"),
  validate(notificationPreferenceSchema),
  updateNotificationPreference,
);

export default router;