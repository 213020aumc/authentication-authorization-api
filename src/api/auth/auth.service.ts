import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../../config/data-source.js";
import { User } from "../user/user.entity.js";
import { AppError } from "../../utils/AppError.js";
import {
  sendOtpEmail,
  sendPasswordResetEmail,
} from "../../services/mailer.service.js";
import config from "../../config/index.js";

const userRepository = AppDataSource.getRepository(User);

const generateOtp = (): { otp: string; otpExpires: Date } => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return { otp, otpExpires };
};

const signToken = (id: string) => {
  const options: SignOptions = {
    expiresIn: config.jwt.expiresIn as any,
  };

  return jwt.sign({ id }, config.jwt.secret, options);
};

export const registerUser = async (userData: Partial<User>) => {
  const existingUser = await userRepository.findOneBy({
    email: userData.email,
  });
  if (existingUser) {
    throw new AppError("An account with this email already exists.", 409);
  }

  const { otp, otpExpires } = generateOtp();
  const newUser = userRepository.create({
    ...userData,
    otp,
    otpExpires,
  });

  await userRepository.save(newUser);
  await sendOtpEmail({ to: newUser.email, name: newUser.name, otp });

  // Don't send password back
  const { password, ...userResponse } = newUser;
  return userResponse;
};

export const login = async (email: string, pass: string) => {
  const user = await userRepository
    .createQueryBuilder("user")
    .addSelect("user.password")
    .where("user.email = :email", { email })
    .getOne();

  if (!user || !(await user.comparePassword(pass))) {
    throw new AppError("Incorrect email or password", 401);
  }

  if (!user.isVerified) {
    throw new AppError("Account not verified. Please verify your OTP.", 403);
  }

  const token = signToken(user.id);
  const { password, ...userResponse } = user;
  return { token, user: userResponse };
};

export const verifyOtp = async (email: string, otp: string) => {
  const user = await userRepository.findOneBy({ email });

  if (!user) {
    throw new AppError("User not found.", 404);
  }
  if (user.isVerified) {
    throw new AppError("Account already verified.", 400);
  }
  if (user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
    throw new AppError("Invalid or expired OTP.", 400);
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpires = null;
  await userRepository.save(user);

  return { message: "Account verified successfully." };
};

export const resendOtp = async (email: string) => {
  const user = await userRepository.findOneBy({ email });
  if (!user) throw new AppError("User not found.", 404);
  if (user.isVerified) throw new AppError("Account already verified.", 400);

  const { otp, otpExpires } = generateOtp();
  user.otp = otp;
  user.otpExpires = otpExpires;

  await userRepository.save(user);
  await sendOtpEmail({ to: user.email, name: user.name, otp });

  return { message: "New OTP has been sent to your email." };
};

export const forgotPassword = async (email: string) => {
  const user = await userRepository.findOneBy({ email });
  if (!user) throw new AppError("User with that email does not exist.", 404);

  const { otp, otpExpires } = generateOtp();
  user.otp = otp;
  user.otpExpires = otpExpires;

  await userRepository.save(user);

  await sendPasswordResetEmail({ to: user.email, name: user.name, otp });

  return { message: "Password reset token (OTP) sent to your email." };
};

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  const user = await userRepository.findOneBy({ email });

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  // Validating OTP
  if (user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
    throw new AppError("Invalid or expired OTP.", 400);
  }

  user.password = await bcrypt.hash(newPassword, 12);

  // Invalidating OTP after use
  user.otp = null;
  user.otpExpires = null;

  user.passwordChangedAt = new Date();

  await userRepository.save(user);

  return { message: "Password has been reset successfully." };
};
