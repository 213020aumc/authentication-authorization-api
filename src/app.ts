import express, { Request, Response, NextFunction } from "express";
import { AppError } from "./utils/AppError.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";
import authRouter from "./api/auth/auth.routes.js";
import userRouter from "./api/user/user.routes.js";

const app = express();

// Global Middleware
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

// Handling Not Found Routes
app.all("/*splat", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handling Middleware
app.use(globalErrorHandler);

export default app;
