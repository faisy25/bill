/**
 * Base custom error class for operational errors.
 * These errors are expected and handled by the application logic.
 */
export class AppError extends Error {
  public statusCode: number;
  public status: "fail" | "error"; // Convention for success/fail status in API responses
  public isOperational: boolean;
  public details?: any; // Optional property for additional error details

  constructor(message: string, statusCode: number, details?: any) {
    super(message); // Call parent Error constructor
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"; // 'fail' for 4xx, 'error' for 5xx
    this.isOperational = true; // By default, custom AppErrors are operational
    this.details = details; // Store optional details

    // Capture stack trace, excluding the constructor call from the trace
    Error.captureStackTrace(this, this.constructor);
  }
}
