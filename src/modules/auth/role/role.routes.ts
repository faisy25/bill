import { Router } from "express";
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "./role.controller";
import { authenticate } from "@src/shared/middlewares/auth.middleware";
import { validate } from "@src/shared/middlewares/validation.middleware";
import { createRoleSchema, updateRoleSchema } from "./constant/role.validation";
import { asyncHandler } from "@src/shared/middlewares/asyncHandler.middleware";

const router = Router();

router.use(authenticate); // All role routes require authentication

router.get("/", asyncHandler(getAllRoles));
router.get("/:id", asyncHandler(getRoleById));
router.post("/", validate(createRoleSchema), asyncHandler(createRole));
router.put("/:id", validate(updateRoleSchema), asyncHandler(updateRole));
router.delete("/:id", asyncHandler(deleteRole));

export default router;
