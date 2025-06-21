import { z } from "zod";

export const createRoleSchema = z.object({
  roleId: z
    .string()
    .min(1, "Role id is required")
    .max(6, "RoleId must be upto 6 characters"),
  name: z.string().min(1, "Role name is required"),
  description: z.string().optional(),
});

export const updateRoleSchema = z
  .object({
    name: z.string().min(1, "Role name cannot be empty").optional(),
    description: z.string().optional(),
  })
  .strict()
  .partial();
