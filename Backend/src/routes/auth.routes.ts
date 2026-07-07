import { Router } from "express";
import { getCurrentUserProfile, login, register } from "../controllers/auth.controller";
import { registerSchema, loginSchema } from "../validations/auth.validation";
import { validate } from "../middleware/validate.middleware";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/profile", protect, getCurrentUserProfile);

export default router;