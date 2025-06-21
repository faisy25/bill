import { Request, Response } from "express";
import * as roleService from "./role.service";
import { sendError, sendSuccess } from "@src/utils/httpResponse";
import {
  ICreateRoleRequestBody,
  IUpdateRoleRequestBody,
} from "./constant/role.interface";
import { Success } from "@src/shared/global/constant/success.message";

const ControllerName = "RoleController";

export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await roleService.getAllRoles();

    return sendSuccess(
      req,
      res,
      ControllerName,
      "getAllRoles",
      Success.Message.Retrieved(`roles`),
      roles,
      200
    );
  } catch (error) {
    return sendError(res, error, req, ControllerName, "getAllRoles");
  }
};

export const getRoleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = await roleService.getRoleById(id);

    return sendSuccess(
      req,
      res,
      ControllerName,
      "getRoleById",
      Success.Message.Retrieved(`role`),
      role,
      200
    );
  } catch (error) {
    return sendError(res, error, req, ControllerName, "getRoleById");
  }
};

export const createRole = async (
  req: Request<any, any, ICreateRoleRequestBody>,
  res: Response
) => {
  try {
    const newRole = await roleService.createRole(req.body);

    return sendSuccess(
      req,
      res,
      ControllerName,
      "createRole",
      Success.Message.Create(`role`),
      newRole,
      201
    );
  } catch (error) {
    return sendError(res, error, req, ControllerName, "createRole");
  }
};

export const updateRole = async (
  req: Request<any, any, IUpdateRoleRequestBody>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const updatedRole = await roleService.updateRole(id, req.body);

    return sendSuccess(
      req,
      res,
      ControllerName,
      "updateRole",
      Success.Message.Update(`role`),
      updatedRole,
      200
    );
  } catch (error) {
    return sendError(res, error, req, ControllerName, "updateRole");
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await roleService.deleteRole(id);

    return sendSuccess(
      req,
      res,
      ControllerName,
      "deleteRole",
      Success.Message.Delete(`role`),
      {},
      200
    );
  } catch (error) {
    return sendError(res, error, req, ControllerName, "deleteRole");
  }
};
