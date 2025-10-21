import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppDataSource } from "../../config/data-source.js";
import { User } from "./user.entity.js";
import { toUserResponseDto } from "./user.dto.js";

const userRepository = AppDataSource.getRepository(User);

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    data: {
      user: toUserResponseDto(req.user!),
    },
  });
});

export const getAllProfiles = catchAsync(
  async (req: Request, res: Response) => {
    const users = await userRepository.find();

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users: users.map(toUserResponseDto),
      },
    });
  }
);
