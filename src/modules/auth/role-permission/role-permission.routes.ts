// src/routes/index.ts or wherever your routes are defined
import express from "express";
import {
  getRolePermissions,
  addRolePermission,
  deleteRolePermission,
} from "./role-permission.controller"; // Adjust the path as needed
import { asyncHandler } from "@src/shared/middlewares/asyncHandler.middleware";

const router = express.Router();

router.get("/", asyncHandler(getRolePermissions));

router.post("/", asyncHandler(addRolePermission));

router.delete("/", asyncHandler(deleteRolePermission));

export default router;
