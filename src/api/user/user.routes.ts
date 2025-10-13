import { Router } from "express";
import * as userController from "./user.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { UserRole } from "./user.entity.js";

const router = Router();

router.get(
  "/profile",
  authenticate,
  authorize(UserRole.USER, UserRole.ADMIN),
  userController.getProfile
);

router.get(
  "/",
  authenticate,
  authorize(UserRole.USER),
  userController.getAllProfiles
);

export default router;
