import { Router } from "express";
import { register, login, logout } from "./auth.controller";
import { asyncHandler } from "@src/shared/middlewares/asyncHandler.middleware";
import { validate } from "@src/shared/middlewares/validation.middleware";
import { loginSchema, registerSchema } from "./constant/auth.validation";

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(register));
router.post("/login", validate(loginSchema), asyncHandler(login));
router.post("/logout", asyncHandler(logout));

export default router;
