import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";
import config from "../config/index.js";
import { AppDataSource } from "../config/data-source.js";
import { User, UserRole } from "../api/user/user.entity.js";

interface JwtPayload {
  id: string;
  iat: number;
  sessionVersion: string;
}

export const authenticate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("You are not logged in. Please log in to get access.", 401)
      );
    }

    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    const userRepository = AppDataSource.getRepository(User);
    // We must explicitly select the fields marked with { select: false }
    const currentUser = await userRepository
      .createQueryBuilder("user")
      .where("user.id = :id", { id: decoded.id })
      .addSelect("user.passwordChangedAt")
      .addSelect("user.sessionVersion")
      .getOne();

    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );
    }

    if (currentUser.passwordChangedAt) {
      const passwordChangedTimestamp = parseInt(
        (currentUser.passwordChangedAt.getTime() / 1000).toString(),
        10
      );

      if (decoded.iat < passwordChangedTimestamp) {
        return next(
          new AppError(
            "User recently changed password. Please log in again.",
            401
          )
        );
      }
    }

    if (decoded.sessionVersion !== currentUser.sessionVersion) {
      return next(
        new AppError(
          "Your session is no longer valid. Please log in again.",
          401
        )
      );
    }

    req.user = currentUser;
    next();
  }
);

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action.", 403)
      );
    }
    next();
  };
};
