import { UnauthorizedError } from "@src/shared/error/customError";
import { Request } from "express";

export function getUserId(req: Request): any {
  const userId = req.user?.userId;

  if (!userId) {
    // You can throw a custom error if you have a global error handler
    throw new UnauthorizedError("Unauthorized: User not authenticated");
  }

  return userId;
}
