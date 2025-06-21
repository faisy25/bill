// src/shared/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../error/appError"; // Ensure this is imported
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ErrorLog } from "../logs/errorLog"; // Import your ErrorLog function
import {
  InternalServerError,
  DatabaseError,
  ConflictError,
  NotFoundError,
  BadRequestError, // Added for potential wrapping
} from "../error/customError"; // Import all relevant AppError types for potential wrapping

// It's good practice to ensure logDir is initialized here as well if this is the first file loaded
// and dependent on it, though typically your app bootstrap handles logDir creation.
import path from "path";
import fs from "fs";
const logDir = path.join(__dirname, "..", "..", "..", "logFile"); // Ensure this path matches
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): any => {
  let handledError: AppError;

  if (err instanceof AppError) {
    handledError = err;
  } else if (err instanceof PrismaClientKnownRequestError) {
    // Your existing Prisma error mapping logic
    switch (err.code) {
      // ... (your existing cases)
      default:
        handledError = new DatabaseError(
          "A database error occurred. Please try again later.",
          { prismaCode: err.code, originalError: err.message }
        );
        break;
    }
  } else {
    handledError = new InternalServerError(
      "An unexpected server error occurred. Please try again later.",
      { originalError: err.message || String(err), stack: err.stack }
    );
  }

  // --- Centralized Logging ---
  ErrorLog(
    "GlobalErrorHandler",
    req.method || "UNKNOWN_METHOD",
    handledError,
    req.originalUrl,
    handledError.details
  );
  // console.error("Error handled by global handler:", handledError);

  // --- Construct the Standardized Client Response ---
  const statusCode = handledError.statusCode;
  let clientMessage = handledError.message; // Use the message from the AppError instance

  // Override message for non-operational errors in production
  if (!handledError.isOperational && process.env.NODE_ENV !== "development") {
    clientMessage = "Something went wrong! Please try again later.";
    // Specific messages for known operational errors can be overridden here
    // based on original error type if needed for non-operational errors
    // but typically non-operational errors are generic.
  }

  // Final JSON response structure, matching your desired format
  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: clientMessage, // This is the user-friendly custom message
    error: handledError.constructor.name, // The class name (e.g., "BadRequestError")
    // // 'details' maps to your 'detail?'
    // details:
    //   process.env.NODE_ENV === "development" ? handledError.details : undefined,
  });
};
