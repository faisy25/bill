import { z } from "zod";

export const addRolePermissionSchema = z.object({
  roleId: z.string().min(1, "Role ID is required."),
  permissionId: z.string().min(1, "Permission ID is required."),
});

export const deleteRolePermissionSchema = z.object({
  roleId: z.string().min(1, "Role ID is required."),
  permissionId: z.string().min(1, "Permission ID is required."),
});

export const getAllRolePermissionsFilterSchema = z.object({
  roleId: z.string().optional(),
  permissionId: z.string().optional(),
});
