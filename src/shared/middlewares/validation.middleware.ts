// src/shared/middlewares/validation.middleware.ts
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../error/customError";
import { sendError } from "../../utils/httpResponse";

// Define a type for your generic schema interface
interface GenericSchema {
  parse?: (data: any) => any;
  safeParse?: (data: any) => { success: boolean; data?: any; error?: any };
  validate?: (data: any, options?: any) => { error?: any; value?: any };
}

export const validate =
  (schema: GenericSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (typeof schema.parse === "function") {
        schema.parse(req.body);
        next(); // Call next if successful
        return; // Explicitly return void after calling next
      }

      if (typeof schema.validate === "function") {
        const { error, value } = schema.validate(req.body, {
          abortEarly: false,
        });
        if (error) {
          const validationErrors = error.details.map((detail: any) => ({
            field: detail.context?.key || detail.path.join("."),
            message: detail.message,
          }));
          const err = new BadRequestError("Validation failed.", {
            validationErrors,
          });
          // sendError will send the response and terminate, so we just return void from validate
          sendError(res, err, req, "ValidationMiddleware", "validate");
          return; // Explicitly return void after sending error
        }
        next(); // Call next if successful
        return; // Explicitly return void after calling next
      }

      // If schema doesn't have a recognized validation method, treat as an internal error
      throw new Error(
        "Validation schema does not have a recognized 'parse' or 'validate' method."
      );
    } catch (error) {
      // Handle specific validation library errors (ZodError, Joi.ValidationError)
      if (error && typeof error === "object") {
        // ZodError check
        if ("name" in error && error.name === "ZodError") {
          const zodError = error as any; // Cast for accessing properties
          const validationErrors = zodError.errors.map((issue: any) => ({
            field: issue.path.join("."),
            message: issue.message,
          }));
          const err = new BadRequestError("Validation failed.", {
            validationErrors,
          });
          sendError(res, err, req, "ValidationMiddleware", "validate");
          return; // Explicitly return void after sending error
        }

        // Joi.ValidationError check (if you use Joi, ensure to handle its throwing behavior if any)
        if (
          "name" in error &&
          error.name === "ValidationError" &&
          "isJoi" in error
        ) {
          const joiError = error as any;
          const validationErrors = joiError.details.map((detail: any) => ({
            field: detail.context?.key || detail.path.join("."),
            message: detail.message,
          }));
          const err = new BadRequestError("Validation failed.", {
            validationErrors,
          });
          sendError(res, err, req, "ValidationMiddleware", "validate");
          return; // Explicitly return void after sending error
        }
      }

      // For any other unexpected errors during validation process
      sendError(res, error, req, "ValidationMiddleware", "validate");
      return; // Explicitly return void after sending error
    }
  };
