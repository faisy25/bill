// src/shared/utils/httpResponse.ts
import { AppError } from "@src/shared/error/appError";
import { errorWrapper } from "@src/shared/error/errorWrapper";
import { AccessLog } from "@src/shared/logs/accessLog";
import { ErrorLog } from "@src/shared/logs/errorLog";
import { Response, Request } from "express";

/**
 * Sends a standardized success response.
 */
export const sendSuccess = (
  req: Request,
  res: Response,
  moduleName: string,
  methodName: string,
  message: string,
  data: any = {},
  statusCode: number = 200
) => {
  const responseBody: any = {
    success: true,
    statusCode: statusCode,
    message,
    data,
  };
  // --- Call AccessLog here if all necessary logging parameters are provided ---
  if (req && moduleName && methodName) {
    AccessLog(moduleName, methodName, req, responseBody);
  }

  return res.status(statusCode).json(responseBody);
};

/**
 * Sends a standardized error response directly from a controller/middleware.
 * It also logs the error using your provided ErrorLog function.
 */
export const sendError = (
  res: Response,
  error: any,
  req: Request, // Request object is needed for logging metadata like URL
  moduleName: string,
  functionName: string
) => {
  // 1. Classify/Wrap the error to ensure it's an AppError for consistent processing
  const handledError: AppError = errorWrapper(
    error,
    `${moduleName}.${functionName} operation`
  );

  // 2. Log the error using YOUR ErrorLog function
  ErrorLog(
    moduleName,
    functionName, // Or req.method, depending on what you prefer for 'method' in ErrorLog
    handledError,
    req.originalUrl,
    handledError.details
  );

  // 3. Prepare the standardized client response
  const statusCode = handledError.statusCode;
  let clientMessage = handledError.message;

  // Mask generic 5xx error messages in production
  if (!handledError.isOperational && process.env.NODE_ENV === "production") {
    clientMessage =
      "An unexpected server error occurred. Please try again later.";
  }

  // Send the error response in your desired format
  return res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: clientMessage,
    error: handledError.constructor.name, // The error class name (e.g., "BadRequestError")
    // // Include details only in development mode for debugging
    // details:
    //   process.env.NODE_ENV === "development" ? handledError.details : undefined,
  });
};
