// src/shared/utils/errorWrapper.ts
import { AppError } from "./appError";
import {
  BadRequestError,
  ConflictError,
  DatabaseConnectionError,
  DatabaseError,
  InternalServerError,
  NotFoundError,
} from "./customError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export function errorWrapper(error: any, context: string): AppError {
  // If it's already an AppError, return it as is.
  if (error instanceof AppError) {
    return error;
  }

  // Handle specific external errors, e.g., Prisma errors
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": // Unique constraint violation
        return new ConflictError(
          `Duplicate entry: A record with this unique identifier already exists.`,
          { target: error.meta?.target, originalError: error.message, context }
        );
      case "P2025": // Record not found
        return new NotFoundError(`The requested resource was not found.`, {
          cause: error.meta?.cause,
          originalError: error.message,
          context,
        });
      case "P2000": // Value too long
      case "P2003": // Foreign key constraint failed
      case "P2007": // Data validation error (Prisma-level)
      case "P2011": // Null constraint violation
      case "P2012": // Missing required value
      case "P2013": // Missing required argument
        return new BadRequestError(
          `Invalid data provided or database constraint violation.`,
          { prismaCode: error.code, originalError: error.message, context }
        );
      case "P1000": // Authentication failed (DB connection)
      case "P1001": // Can't reach database server
        return new DatabaseConnectionError(
          `Failed to connect to the database.`,
          { prismaCode: error.code, originalError: error.message, context }
        );
      default:
        return new DatabaseError(`An unexpected database error occurred.`, {
          prismaCode: error.code,
          originalError: error.message,
          context,
        });
    }
  }

  // Fallback for any other unexpected error type (e.g., native Error, string, unknown object)
  return new InternalServerError(`An unexpected internal error occurred.`, {
    originalError: error.message || String(error),
    stack: error.stack,
    context,
  });
}
