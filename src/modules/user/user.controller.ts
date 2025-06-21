import { Request, Response } from "express";
import * as userService from "./user.service";
import { sendError, sendSuccess } from "@src/utils/httpResponse";
import { IUpdateUserRequestBody } from "./constant/user.interface";
import { Success } from "@src/shared/global/constant/success.message";

const ControllerName = "UserController";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();

    return sendSuccess(
      req,
      res,
      ControllerName,
      "getAllUsers",
      Success.Message.Retrieved("users"),
      users,
      200
    );
  } catch (error) {
    return sendError(res, error, req, ControllerName, "getAllUsers");
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(+id);

    return sendSuccess(
      req,
      res,
      ControllerName,
      "getUserById",
      Success.Message.Retrieved("user"),
      user,
      200
    );
  } catch (error) {
    return sendError(res, error, req, ControllerName, "getUserById");
  }
};

export const updateUser = async (
  req: Request<any, any, IUpdateUserRequestBody>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const updatedUser = await userService.updateUser(id, req.body);

    return sendSuccess(
      req,
      res,
      ControllerName,
      "updateUser",
      Success.Message.Update("user"),
      updatedUser,
      200
    );
  } catch (error) {
    return sendError(res, error, req, ControllerName, "updateUser");
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(+id);
    return sendSuccess(
      req,
      res,
      ControllerName,
      "deleteUser",
      Success.Message.Delete("user"),
      {},
      200
    );
  } catch (error) {
    return sendError(res, error, req, ControllerName, "deleteUser");
  }
};
