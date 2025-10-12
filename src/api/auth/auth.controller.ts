import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import * as authService from "./auth.service.js";

export const register = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json({
    status: "success",
    message:
      "User registered. Please check your email for the verification OTP.",
    data: { user },
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { token, user } = await authService.login(email, password);
  res.status(200).json({
    status: "success",
    token,
    data: { user },
  });
});

export const verifyAccount = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const result = await authService.verifyOtp(email, otp);
  res.status(200).json({ status: "success", ...result });
});

export const resendVerificationOtp = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await authService.resendOtp(email);
    res.status(200).json({ status: "success", ...result });
  }
);

export const forgotPassword = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.status(200).json({ status: "success", ...result });
  }
);

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  const result = await authService.resetPassword(email, otp, newPassword);
  res.status(200).json({ status: "success", ...result });
});
