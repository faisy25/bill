import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./user.controller";
import { authenticate } from "@src/shared/middlewares/auth.middleware";
import { validate } from "@src/shared/middlewares/validation.middleware";
import { updateUserSchema } from "./constant/user.validation"; // Create this validation schema
import { asyncHandler } from "@src/shared/middlewares/asyncHandler.middleware";

const router = Router();

router.use(authenticate); // All user routes require authentication

router.get("/", asyncHandler(getAllUsers));
router.get("/:id", asyncHandler(getUserById));
router.put("/:id", validate(updateUserSchema), asyncHandler(updateUser));
router.delete("/:id", asyncHandler(deleteUser));

export default router;
