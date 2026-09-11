import { Router } from "express";
import { getCurrentUserProfile, login, register, getCustomerDashboard, getSupplierDashboard, getAdminDashboard, logout, getCurrentUser, forgotPasswordController } from "../controllers/auth.controller";
import { registerSchema, loginSchema } from "../validations/auth.validation";
import { validate } from "../middleware/validate.middleware";
import { authorize } from "../middleware/role.middleware";
import { refreshToken } from "../controllers/auth.controller";
import { resetPasswordController, } from "../controllers/auth.controller";
import { updateAvatar } from "../controllers/auth.controller";
import { updateProfile } from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", protect, getCurrentUser);
router.get("/profile", protect, getCurrentUserProfile);
router.get("/customer-dashboard", protect, authorize("customer"), getCustomerDashboard);
router.get("/supplier-dashboard", protect, authorize("supplier"), getSupplierDashboard);
router.get("/admin-dashboard", protect, authorize("admin"), getAdminDashboard);
router.post("/refresh-token", refreshToken);
router.post("/logout", protect, logout);
router.post("/forgot-password", forgotPasswordController);
router.patch( "/reset-password/:token", resetPasswordController );
router.patch("/avatar", protect, upload.single("avatar"), updateAvatar);
router.patch("/profile", protect, updateProfile);

export default router;