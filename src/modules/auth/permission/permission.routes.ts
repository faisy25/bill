// src/modules/permission/permission.routes.ts
import { Router } from "express";
import {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
} from "./permission.controller";
import { authenticate } from "@src/shared/middlewares/auth.middleware";
import { hasPermission } from "@src/shared/middlewares/hasPermission.middleware";
import { validate } from "@src/shared/middlewares/validation.middleware";
import {
  createPermissionSchema,
  updatePermissionSchema,
} from "./constant/permission.validation";
import { asyncHandler } from "@src/shared/middlewares/asyncHandler.middleware";

const router = Router();

router.use(authenticate); // All permission routes require authentication

router.get("/", asyncHandler(getAllPermissions));
router.get("/:id", asyncHandler(getPermissionById));
router.post(
  "/",
  validate(createPermissionSchema),
  asyncHandler(createPermission)
);
router.put(
  "/:id",
  validate(updatePermissionSchema),
  asyncHandler(updatePermission)
);
router.delete("/:id", asyncHandler(deletePermission));

export default router;
