import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "@src/shared/prisma/client";
import { UnauthorizedError } from "@src/shared/error/customError";
import { sendError } from "@src/utils/httpResponse";

// Extend the Request object to include user data
declare module "express-serve-static-core" {
  interface Request {
    user?: {
      userId: number;
      username: string;
      roleId: string;
      roleName: string;
      permissions: string[]; // Array of permission names (e.g., "user:read", "role:create")
    };
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const MiddlewareName = "AuthMiddleware";
  try {
    let token;

    // Check for token in Authorization header (Bearer Token)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // You can also check for a cookie if you set one on login
    // else if (req.cookies && req.cookies.token) {
    //   token = req.cookies.token;
    // }

    if (!token) {
      throw new UnauthorizedError("Access denied. No token provided.");
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    // Fetch user with their role and associated permissions
    const user = await prisma.user.findUnique({
      where: { userId, isActive: true, isDeleted: false },
      include: {
        role: {
          include: {
            role_permission: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.role) {
      throw new UnauthorizedError("User not found or role not assigned.");
    }

    // Extract permission names
    const permissions = user.role.role_permission.map(
      (rp) => rp.permission.name
    );

    req.user = {
      userId: user.userId,
      username: user.username,
      roleId: user.roleId,
      roleName: user.role.name,
      permissions: permissions,
    };

    next();
  } catch (error) {
    // Handle JWT errors (TokenExpiredError, JsonWebTokenError) specifically

    if (error instanceof jwt.JsonWebTokenError) {
      if (error instanceof jwt.TokenExpiredError) {
        return sendError(
          res,
          new UnauthorizedError("Access denied. Token expired."),
          req,
          MiddlewareName,
          "authenticate"
        );
      }
      return sendError(
        res,
        new UnauthorizedError("Access denied. Invalid token."),
        req,
        MiddlewareName,
        "authenticate"
      );
    }
    // Pass other errors to the general error handler via sendError
    sendError(res, error, req, MiddlewareName, "authenticate");
  }
};
