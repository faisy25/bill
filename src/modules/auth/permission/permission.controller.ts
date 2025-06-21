import { Request, Response } from "express";
import * as permissionService from "./permission.service";
import { sendError, sendSuccess } from "@src/utils/httpResponse";
import {
  ICreatePermissionRequestBody,
  IUpdatePermissionRequestBody,
} from "./constant/permission.interface";
import { Success } from "@src/shared/global/constant/success.message";

const ControllerName = "PermissionController";

export const getAllPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await permissionService.getAllPermissions();
    return sendSuccess(
      req,
      res,
      ControllerName,
      "getAllPermissions",
      Success.Message.Retrieved("permissions"),
      permissions,
      200
    );
  } catch (error) {
    return sendError(res, error, req, ControllerName, "getAllPermissions");
  }
};

export const getPermissionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const permission = await permissionService.getPermissionById(id);

    return sendSuccess(
      req,
      res,
      ControllerName,
      "getPermissionById",
      Success.Message.Retrieved("permission"),
      permission,
      200
    );
  } catch (error) {
    return sendError(res, error, req, ControllerName, "getPermissionById");
  }
};

export const createPermission = async (
  req: Request<any, any, ICreatePermissionRequestBody>,
  res: Response
) => {
  try {
    const newPermission = await permissionService.createPermission(req.body);

    return sendSuccess(
      req,
      res,
      ControllerName,
      "createPermission",
      Success.Message.Create("permission"),
      newPermission,
      200
    );
  } catch (error) {
    return sendError(res, error, req, ControllerName, "createPermission");
  }
};

export const updatePermission = async (
  req: Request<any, any, IUpdatePermissionRequestBody>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const updatedPermission = await permissionService.updatePermission(
      id,
      req.body
    );

    return sendSuccess(
      req,
      res,
      ControllerName,
      "updatePermission",
      Success.Message.Update("permission"),
      updatedPermission,
      200
    );
  } catch (error) {
    return sendError(res, error, req, ControllerName, "updatePermission");
  }
};

export const deletePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await permissionService.deletePermission(id);

    return sendSuccess(
      req,
      res,
      ControllerName,
      "deletePermission",
      Success.Message.Retrieved("permissions"),
      {},
      200
    );
  } catch (error) {
    return sendError(res, error, req, ControllerName, "deletePermission");
  }
};
