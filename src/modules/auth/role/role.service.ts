import { prisma } from "@src/shared/prisma/client";
import { ErrorLog } from "@src/shared/logs/errorLog";
import { errorWrapper } from "@src/shared/error/errorWrapper";
import { NotFoundError, ConflictError } from "@src/shared/error/customError";
import {
  ICreateRoleRequestBody,
  IUpdateRoleRequestBody,
} from "./constant/role.interface";
import { roleOptions } from "./constant/role.profile";
import { Error } from "@src/shared/global/constant/error.message";
import { MRole } from "./constant/role.message";

const ServiceName = "RoleService";

export const getAllRoles = async () => {
  try {
    const roles = await prisma.role.findMany({
      where: {
        isDeleted: false, // Add this line
      },
      ...roleOptions,
    });
    return roles;
  } catch (error) {
    ErrorLog(ServiceName, "getAllRoles", error);
    throw errorWrapper(error, Error.Message.Retrieve(`roles`));
  }
};

export const getRoleById = async (id: string) => {
  try {
    const role = await prisma.role.findUnique({
      where: { roleId: id },
      ...roleOptions,
    });

    if (!role)
      throw new NotFoundError(Error.Message.NotFound(`role with ${id}`));

    return role;
  } catch (error) {
    ErrorLog(ServiceName, "getRoleById", error);
    throw errorWrapper(error, Error.Message.Retrieve(`role with ${id}`));
  }
};

export const createRole = async (data: ICreateRoleRequestBody) => {
  try {
    const { roleId, name, description } = data;

    const newRole = await prisma.role.create({
      data: {
        roleId,
        name,
        description,
      },
    });
    return newRole;
  } catch (error) {
    ErrorLog(ServiceName, "createRole", error);
    throw errorWrapper(error, Error.Message.Create(`role`));
  }
};

export const updateRole = async (id: string, data: IUpdateRoleRequestBody) => {
  try {
    const { name, description } = data;

    // Start a transaction if you need to ensure atomicity for permission updates
    const updatedRole = await prisma.$transaction(async (prisma) => {
      const role = await prisma.role.findUnique({ where: { roleId: id } });
      if (!role)
        throw new NotFoundError(Error.Message.NotFound(`role with ${id}`));

      return prisma.role.update({
        where: { roleId: id },
        data: {
          name,
          description,
        },
      });
    });

    return updatedRole;
  } catch (error) {
    ErrorLog(ServiceName, "updateRole", error, `roleId: ${id}`);
    throw errorWrapper(error, Error.Message.Update(`role with ${id}`));
  }
};

export const deleteRole = async (id: string) => {
  try {
    // Check if there are any users assigned to this role before deleting
    const usersInRole = await prisma.user.count({
      where: { roleId: id, isDeleted: false },
    });
    if (usersInRole > 0) {
      throw new ConflictError(MRole.Error.DeleteUserConflict());
    }

    const deletedRole = await prisma.role.delete({
      where: { roleId: id },
      select: { roleId: true },
    });
    return deletedRole;
  } catch (error) {
    ErrorLog(ServiceName, "deleteRole", error, `roleId: ${id}`);
    throw errorWrapper(error, Error.Message.Delete(`role with ${id}`));
  }
};
