import { Router } from "express";
import authRoutes from "./auth/auth.routes";
import userRoutes from "./user/user.routes";
import logRoutes from "./logs/logs.routes";
import roleRoutes from "./auth/role/role.routes";
import permissionRoutes from "./auth/permission/permission.routes";
import rolePermissionRoutes from "./auth/role-permission/role-permission.routes";
import bookRoutes from "./book/book.routes";

const router = Router();
router.use("/auth", authRoutes);
router.use("/users", userRoutes); // Mount new routes
router.use("/roles", roleRoutes); // Mount new routes
router.use("/permissions", permissionRoutes); // Mount new routes
router.use("/role-permissions", rolePermissionRoutes); // Mount new routes
router.use("/books", bookRoutes);
router.use("/logs", logRoutes);

export default router;
