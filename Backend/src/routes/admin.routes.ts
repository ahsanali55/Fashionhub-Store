import { Router } from "express";
import {
  getPendingSuppliers,
  approveSupplier,
  rejectSupplier,
} from "../controllers/admin.controller"; 
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// Express checks the incoming request headers to see who is making the request.
// All routes here require the user to be logged in as an admin
router.use(protect, authorize("admin"));

router.get("/suppliers/pending", getPendingSuppliers);
router.patch("/suppliers/:id/approve", approveSupplier);
router.patch("/suppliers/:id/reject", rejectSupplier);

export default router;