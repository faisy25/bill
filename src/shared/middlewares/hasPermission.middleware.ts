import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "@src/shared/error/customError";
import { sendError } from "@src/utils/httpResponse";

export const hasPermission = (requiredPermissions: string | string[]) => {
  const permissionsArray = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions];

  return (req: Request, res: Response, next: NextFunction): void => {
    const MiddlewareName = "PermissionMiddleware";
    try {
      if (!req.user) {
        // This case should ideally be caught by 'authenticate' middleware first
        throw new ForbiddenError("Access denied. User not authenticated.");
      }

      const userPermissions = req.user.permissions || [];

      // Check if the user has AT LEAST ONE of the required permissions
      const hasAccess = permissionsArray.some((rp) =>
        userPermissions.includes(rp)
      );

      if (!hasAccess) {
        throw new ForbiddenError("Access denied. Insufficient permissions.");
      }

      next();
    } catch (error) {
      sendError(res, error, req, MiddlewareName, "hasPermission");
    }
  };
};
