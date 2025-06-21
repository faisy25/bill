// src/modules/rolePermission/rolePermission.service.ts

import { prisma } from "@src/shared/prisma/client";
import { ErrorLog } from "@src/shared/logs/errorLog";
import { errorWrapper } from "@src/shared/error/errorWrapper";
import {
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
} from "@src/shared/error/customError";
import {
  IAddRolePermissionRequestBody,
  IDeleteRolePermissionRequestBody,
  IGetAllRolePermissionsFilter,
  IRolePermissionResponse,
} from "./constant/role-permission.interface";
import { Error } from "@src/shared/global/constant/error.message";
import { MRolePermission } from "./constant/role-permission.message";
import {
  addRolePermissionSchema,
  deleteRolePermissionSchema,
} from "./constant/role-permission.validation";

const ServiceName = "RolePermissionService";

export const getRolePermissions = async (
  filters: IGetAllRolePermissionsFilter
): Promise<IRolePermissionResponse[]> => {
  try {
    const all = await prisma.rolePermission.findMany({
      where: {
        roleId: filters.roleId,
        permissionId: filters.permissionId,
        isDeleted: false,
      },
      include: {
        role: true,
        permission: true,
      },
    });

    return all.map((rp) => ({
      roleId: rp.roleId,
      permissionId: rp.permissionId,
      isDeleted: rp.isDeleted,
      role: rp.role
        ? {
            roleId: rp.role.roleId,
            name: rp.role.name,
            description: rp.role.description ?? "",
          }
        : undefined,
      permission: rp.permission
        ? {
            permissionId: rp.permission.permissionId,
            name: rp.permission.name,
            description: rp.permission.description ?? "",
          }
        : undefined,
    }));
  } catch (error) {
    ErrorLog(ServiceName, "getRolePermissions", error);
    throw errorWrapper(error, Error.Message.Retrieve(`all role permissions`));
  }
};

export const addRolePermission = async (
  data: IAddRolePermissionRequestBody
): Promise<any> => {
  try {
    // Validate input data using Zod
    const validatedData = addRolePermissionSchema.parse(data);
    const { roleId, permissionId } = validatedData;

    // Validate that both role and permission exist
    const role = await prisma.role.findUnique({ where: { roleId } });
    if (!role) {
      throw new NotFoundError(Error.Message.NotFound(`role with ${roleId}`));
    }
    const permission = await prisma.permission.findUnique({
      where: { permissionId },
    });
    if (!permission) {
      throw new NotFoundError(Error.Message.Forbidden());
    }

    // Check if the association already exists (even if deleted)
    const existingAssociation = await prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          // Use unique compound key for lookup
          roleId: roleId,
          permissionId: permissionId,
        },
      },
    });

    if (existingAssociation) {
      if (existingAssociation.isDeleted === false) {
        // Association already active, no change needed
        throw new ConflictError(MRolePermission.Error.AlreadyActive());
      } else {
        // Association exists but is deleted, reactivate it
        const reactivatedAssociation = await prisma.rolePermission.update({
          where: {
            roleId_permissionId: {
              // Use unique compound key for lookup
              roleId: roleId,
              permissionId: permissionId,
            },
          },
          data: {
            isDeleted: false,
          },
        });
        return reactivatedAssociation;
      }
    } else {
      // Association does not exist, create a new one
      const newAssociation = await prisma.rolePermission.create({
        data: {
          roleId,
          permissionId,
          isDeleted: false, // Default to active
        },
      });
      return newAssociation;
    }
  } catch (error) {
    ErrorLog(ServiceName, "addRolePermission", error);
    throw errorWrapper(
      error,
      Error.Message.Create(`role permission association`)
    );
  }
};

export const deleteRolePermission = async (
  data: IDeleteRolePermissionRequestBody
): Promise<any> => {
  try {
    // Validate input data using Zod
    const validatedData = deleteRolePermissionSchema.parse(data);
    const { roleId, permissionId } = validatedData;

    // Find the association
    const existingAssociation = await prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          // Use unique compound key for lookup
          roleId: roleId,
          permissionId: permissionId,
        },
      },
    });

    if (!existingAssociation) {
      throw new NotFoundError(
        Error.Message.NotFound(
          ` for roleId: ${roleId}, permissionId: ${permissionId}`
        )
      );
    }

    if (existingAssociation.isDeleted === true) {
      // Already soft deleted
      throw new ConflictError(
        MRolePermission.Error.AlreadyDeleted(roleId, permissionId)
      );
    }

    // Perform soft delete
    const softDeletedAssociation = await prisma.rolePermission.update({
      where: {
        roleId_permissionId: {
          // Use unique compound key for lookup
          roleId: roleId,
          permissionId: permissionId,
        },
      },
      data: {
        isDeleted: true,
      },
    });
    return softDeletedAssociation;
  } catch (error) {
    ErrorLog(ServiceName, "deleteRolePermission", error);
    throw errorWrapper(
      error,
      Error.Message.Delete(`role permission association`)
    );
  }
};
