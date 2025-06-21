// src/modules/auth/service/auth.service.ts
import { prisma } from "../../shared/prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  ILoginRequestBody,
  IRegisterRequestBody,
} from "./constant/auth.interface";
import { BadRequestError, ConflictError } from "@src/shared/error/customError";
import { ErrorLog } from "@src/shared/logs/errorLog";
import { errorWrapper } from "@src/shared/error/errorWrapper";
import { Error } from "@src/shared/global/constant/error.message";
import { MAuth } from "./constant/auth.message";

const ServiceName = "AuthService";

// Register Service for the new user.
export const register = async (body: IRegisterRequestBody) => {
  try {
    const { username, firstName, lastName, password, roleId } = body;
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser)
      throw new ConflictError(Error.Message.AlreadyExists("user"));

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { firstName, lastName, username, password: hashedPassword, roleId },
    });

    return {
      userId: newUser.userId,
      username: newUser.username,
      role: newUser.roleId,
    };
  } catch (error) {
    ErrorLog(ServiceName, "register", error);
    throw errorWrapper(error, MAuth.Error.Register());
  }
};

// Login Service for the new user.
export const login = async (body: ILoginRequestBody) => {
  try {
    const { username, password } = body;
    const user = await prisma.user.findUnique({
      where: { username, isDeleted: false },
    });
    if (!user) throw new BadRequestError(MAuth.Error.Invalid());
    if (!user.isActive) throw new BadRequestError(MAuth.Error.InActive());
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequestError(MAuth.Error.Invalid());

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    return {
      token,
      user: {
        id: user.userId,
        name: user.firstName + user.lastName,
        username: user.username,
        role: user.roleId,
      },
    };
  } catch (error) {
    ErrorLog(ServiceName, "login", error);
    throw errorWrapper(error, MAuth.Error.Login());
  }
};
