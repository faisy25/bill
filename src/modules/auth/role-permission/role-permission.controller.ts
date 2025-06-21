// src/modules/rolePermission/rolePermission.controller.ts

import { Request, Response } from "express";
import * as rolePermissionService from "./role-permission.service";
import { sendError, sendSuccess } from "@src/utils/httpResponse";
import {
  IAddRolePermissionRequestBody,
  IDeleteRolePermissionRequestBody,
  IGetAllRolePermissionsFilter,
} from "./constant/role-permission.interface";
import { Success } from "@src/shared/global/constant/success.message";
import { MRolePermission } from "./constant/role-permission.message";
import {
  addRolePermissionSchema,
  deleteRolePermissionSchema,
  getAllRolePermissionsFilterSchema,
} from "./constant/role-permission.validation";

const ControllerName = "RolePermissionController";

export const getRolePermissions = async (req: Request, res: Response) => {
  try {
    const filters: IGetAllRolePermissionsFilter =
      getAllRolePermissionsFilterSchema.parse(req.query);

    // ✅ Pass filters to service
    const permissions = await rolePermissionService.getRolePermissions(filters);

    return sendSuccess(
      req,
      res,
      ControllerName,
      "getRolePermissions",
      Success.Message.Retrieved(`all role permissions`),
      permissions,
      200
    );
  } catch (error) {
    return sendError(res, error, req, ControllerName, "getRolePermissions");
  }
};

export const addRolePermission = async (
  req: Request<any, any, IAddRolePermissionRequestBody>,
  res: Response
) => {
  try {
    // Validate request body using Zod
    addRolePermissionSchema.parse(req.body);

    const newRolePermission = await rolePermissionService.addRolePermission(
      req.body
    );

    return sendSuccess(
      req,
      res,
      ControllerName,
      "addRolePermission",
      MRolePermission.Success.Activated(), // Custom success message
      newRolePermission,
      200 // 200 OK because it might be an update/reactivation, not just a create (201)
    );
  } catch (error) {
    return sendError(res, error, req, ControllerName, "addRolePermission");
  }
};

/**
 * Handles the request to soft delete a permission from a role.
 * The roleId and permissionId are expected in the request body.
 *
 * @param {Request<any, any, IDeleteRolePermissionRequestBody>} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>}
 */
export const deleteRolePermission = async (
  req: Request<any, any, IDeleteRolePermissionRequestBody>,
  res: Response
) => {
  try {
    // Validate request body using Zod
    deleteRolePermissionSchema.parse(req.body);

    await rolePermissionService.deleteRolePermission(req.body);

    return sendSuccess(
      req,
      res,
      ControllerName,
      "deleteRolePermission",
      MRolePermission.Success.Deactivated(), // Custom success message for soft delete
      {}, // No specific data needed in response body for delete
      200
    );
  } catch (error) {
    return sendError(res, error, req, ControllerName, "deleteRolePermission");
  }
};
