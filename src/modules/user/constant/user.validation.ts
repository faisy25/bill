import { z } from "zod";

export const updateUserSchema = z
  .object({
    firstName: z.string().min(1, "First name cannot be empty").optional(),
    lastName: z.string().min(1, "Last name cannot be empty").optional(),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters")
      .toLowerCase()
      .optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    isActive: z.boolean().optional(),
    roleId: z.string().min(1, "Invalid role ID format").optional(), // Assuming UUID
  })
  .strict()
  .partial(); // Use .partial() to make all fields optional for updates
