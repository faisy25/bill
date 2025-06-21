import { prisma } from "@src/shared/prisma/client";
import { ErrorLog } from "@src/shared/logs/errorLog";
import { errorWrapper } from "@src/shared/error/errorWrapper";
import { NotFoundError, ConflictError } from "@src/shared/error/customError";
import {
  ICreatePermissionRequestBody,
  IUpdatePermissionRequestBody,
} from "./constant/permission.interface";
import { Error } from "@src/shared/global/constant/error.message";
import { MPermission } from "./constant/permission.message";

const ServiceName = "PermissionService";

export const getAllPermissions = async () => {
  try {
    const permissions = await prisma.permission.findMany({});
    return permissions;
  } catch (error) {
    ErrorLog(ServiceName, "getAllPermissions", error);
    throw errorWrapper(error, Error.Message.Retrieve(`permissions`));
  }
};

export const getPermissionById = async (id: string) => {
  try {
    const permission = await prisma.permission.findUnique({
      where: { permissionId: id },
    });
    if (!permission)
      throw new NotFoundError(Error.Message.NotFound(`permission with ${id}`));
    return permission;
  } catch (error) {
    ErrorLog(ServiceName, "getPermissionById", error);
    throw errorWrapper(error, Error.Message.Retrieve(`permission with ${id}`));
  }
};

export const createPermission = async (data: ICreatePermissionRequestBody) => {
  try {
    const createData = {
      ...data,
      createdBy: 1,
    };

    const newPermission = await prisma.permission.create({ data: createData });
    return newPermission;
  } catch (error) {
    ErrorLog(ServiceName, "createPermission", error);
    throw errorWrapper(error, Error.Message.Create(`permission`));
  }
};

export const updatePermission = async (
  id: string,
  data: IUpdatePermissionRequestBody
) => {
  try {
    const updatedPermission = await prisma.permission.update({
      where: { permissionId: id },
      data,
    });
    return updatedPermission;
  } catch (error) {
    ErrorLog(ServiceName, "updatePermission", error, `permissionId: ${id}`);
    throw errorWrapper(error, Error.Message.Retrieve(`permission with ${id}`));
  }
};

export const deletePermission = async (id: string) => {
  try {
    // Check if this permission is assigned to any roles before deleting
    const rolesWithPermission = await prisma.rolePermission.count({
      where: { permissionId: id },
    });
    if (rolesWithPermission > 0) {
      throw new ConflictError(MPermission.Error.DeleteRoleConflict());
    }

    const deletedPermission = await prisma.permission.delete({
      where: { permissionId: id },
    });
    return deletedPermission;
  } catch (error) {
    ErrorLog(ServiceName, "deletePermission", error, `permissionId: ${id}`);
    throw errorWrapper(error, Error.Message.Delete(`permission with ${id}`));
  }
};
