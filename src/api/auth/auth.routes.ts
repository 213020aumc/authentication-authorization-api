import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  emailSchema,
  resetPasswordSchema,
} from "./auth.validation.js";
import * as authController from "./auth.controller.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post(
  "/verify-otp",
  validate(verifyOtpSchema),
  authController.verifyAccount
);
router.post(
  "/resend-otp",
  validate(emailSchema),
  authController.resendVerificationOtp
);
router.post(
  "/forgot-password",
  validate(emailSchema),
  authController.forgotPassword
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword
);

export default router;
