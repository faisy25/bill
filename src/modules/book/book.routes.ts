import { asyncHandler } from "@src/shared/middlewares/asyncHandler.middleware";
import { authenticate } from "@src/shared/middlewares/auth.middleware";
import { validate } from "@src/shared/middlewares/validation.middleware";
import { Router } from "express";
import { createBookSchema, updateBookSchema } from "./constant/book.validation";
import {
  create,
  getAll,
  getOne,
  remove,
  searchBooks,
  update,
} from "./book.controller";
import bookReviewRoutes from "./book-review/book-review.routes";

const router = Router();

router.use(authenticate); // All user routes require authentication

router.get("/", asyncHandler(getAll));
router.get("/search", asyncHandler(searchBooks));
router.get("/:id", asyncHandler(getOne));
router.post("/", validate(createBookSchema), asyncHandler(create));
router.put("/:id", validate(updateBookSchema), asyncHandler(update));
router.delete("/:id", asyncHandler(remove));

router.use("/:bookId/reviews", bookReviewRoutes);

export default router;
