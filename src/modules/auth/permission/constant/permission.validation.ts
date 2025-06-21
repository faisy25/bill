import { z } from "zod";

export const createPermissionSchema = z.object({
  permissionId: z
    .string()
    .min(1, "Permission name is required")
    .max(8, "Max characters upto 8"),
  name: z.string().min(1, "Permission name is required"),
  description: z.string().optional(),
});

export const updatePermissionSchema = z
  .object({
    permissionId: z
      .string()
      .min(1, "Permission name is required")
      .max(8, "Max characters upto 8")
      .optional(),
    name: z.string().min(1, "Permission name cannot be empty").optional(),
    description: z.string().optional(),
  })
  .strict()
  .partial();
