import { prisma } from "@src/shared/prisma/client";
import { ErrorLog } from "@src/shared/logs/errorLog";
import { errorWrapper } from "@src/shared/error/errorWrapper";
import { NotFoundError } from "@src/shared/error/customError";
import { IUpdateUserRequestBody } from "./constant/user.interface";
import { userOptions } from "./constant/user.profile";
import { Error } from "@src/shared/global/constant/error.message";

const ServiceName = "UserService";

export const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      where: { isDeleted: false },
      ...userOptions,
    });
    return users;
  } catch (error) {
    ErrorLog(ServiceName, "getAllUsers", error);
    throw errorWrapper(error, Error.Message.Retrieve("users"));
  }
};

export const getUserById = async (id: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { userId: id, isDeleted: false },
      ...userOptions,
    });
    if (!user)
      throw new NotFoundError(Error.Message.NotFound(`user with ${id}`));
    return user;
  } catch (error) {
    ErrorLog(ServiceName, "getUserById", error);
    throw errorWrapper(error, Error.Message.Retrieve(`user with ${id}`));
  }
};

export const updateUser = async (id: number, data: IUpdateUserRequestBody) => {
  try {
    // Prevent updating sensitive fields directly here if not intended
    const { roleId, ...updateData } = data; // Destructure to exclude password/roleId if handled elsewhere

    // const user = await getUserById(id);
    // if (!user)
    //   throw new NotFoundError(Error.Message.NotFound(`user with ${id}`));

    const updatedUser = await prisma.user.update({
      where: { userId: id, isDeleted: false },
      data: {
        ...updateData,
        ...(roleId && { roleId: roleId }), // Example: allow role update
      },
      ...userOptions,
    });

    if (!updatedUser)
      throw new NotFoundError(Error.Message.NotFound(`user with ${id}`));

    return updatedUser;
  } catch (error) {
    ErrorLog(ServiceName, "updateUser", error, `userId: ${id}`);
    throw errorWrapper(error, Error.Message.Update(`user with ${id}`));
  }
};

export const deleteUser = async (id: number) => {
  try {
    // Soft delete the user
    const deletedUser = await prisma.user.update({
      where: { userId: id, isDeleted: false },
      data: { isDeleted: true, isActive: false }, // Also deactivate on soft delete
      select: { userId: true },
    });
    if (!deletedUser)
      throw new NotFoundError(Error.Message.NotFound(`user with ${id}`));
    return deletedUser;
  } catch (error) {
    ErrorLog(ServiceName, "deleteUser", error, `userId: ${id}`);
    throw errorWrapper(error, Error.Message.Delete(`user with ${id}`));
  }
};
