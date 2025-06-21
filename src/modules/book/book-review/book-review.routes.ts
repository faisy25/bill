import { asyncHandler } from "@src/shared/middlewares/asyncHandler.middleware";
import { authenticate } from "@src/shared/middlewares/auth.middleware";
import { validate } from "@src/shared/middlewares/validation.middleware";
import { Router } from "express";
import {
  create,
  update,
  remove,
  getOne,
  getAll,
} from "./book-review.controller";
import {
  createBookReviewSchema,
  updateBookReviewSchema,
} from "../constant/book.validation";

const router = Router({ mergeParams: true });

router.use(authenticate); // All user routes require authentication

router.get("/", asyncHandler(getAll));
router.get("/:id", asyncHandler(getOne));
router.post("/", validate(createBookReviewSchema), asyncHandler(create));
router.put("/:id", validate(updateBookReviewSchema), asyncHandler(update));
router.delete("/:id", asyncHandler(remove));

export default router;
