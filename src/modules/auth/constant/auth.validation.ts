// src/modules/auth/auth.validation.ts (New file for validation schemas)
import { z } from "zod";

// Define a Zod schema for registration data
export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleId: z.string().min(1, "Invalid role ID format"), // Assuming roleId is a UUID
});

// Define a Zod schema for login data
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
