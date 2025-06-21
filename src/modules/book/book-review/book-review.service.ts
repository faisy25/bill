import { errorWrapper } from "@src/shared/error/errorWrapper";
import { Error } from "@src/shared/global/constant/error.message";
import { ErrorLog } from "@src/shared/logs/errorLog";

import { getOne as getBook, updateBookAverageRating } from "../book.service";
import { ForbiddenError, NotFoundError } from "@src/shared/error/customError";
import {
  ICreateBookReviewRequestBody,
  IGetBookReviewsQuery,
  IUpdateBookReviewRequestBody,
} from "../constant/book.interface";
import { prisma } from "@src/shared/prisma/client";
import { MBook } from "../constant/book.message";
import { bookReviewProfile } from "../constant/book.profile";

const ServiceName = "BookReviewService";

export const getAll = async (queries: IGetBookReviewsQuery) => {
  try {
    const { bookId, page = 1, limit = 5 } = queries; // Limit reviews per page, e.g., 5

    const whereClause: any = {
      bookId: bookId,
      isDeleted: false,
    };

    const [reviews, total] = await Promise.all([
      prisma.bookReview.findMany({
        where: whereClause,
        select: {
          reviewId: true,
          rating: true,
          comments: true,
          bookId: true, // Crucial for cursor-based pagination if you go that route
          createdAt: true,
          userInfo: {
            select: {
              username: true,
            },
          },
        },

        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" }, // Order reviews, latest first
      }),
      prisma.bookReview.count({ where: whereClause }),
    ]);

    return {
      data: reviews,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
    };
  } catch (error) {
    ErrorLog(ServiceName, "getAll", error);
    throw errorWrapper(error, Error.Message.Retrieve(`Book Reviews`));
  }
};

export const getOne = async (id: number, includeDeleted?: boolean) => {
  try {
    let whereClause: any = {};

    if (includeDeleted) {
      whereClause = { isDeleted: true };
    } else {
      whereClause = { isDeleted: false };
    }

    const getOne = await prisma.bookReview.findUnique({
      where: { reviewId: id, ...whereClause },
      include: bookReviewProfile,
    });

    if (!getOne)
      throw new NotFoundError(Error.Message.NotFound(`Book review with ${id}`));

    return getOne;
  } catch (error) {
    ErrorLog(ServiceName, "getOne", error);
    throw errorWrapper(error, Error.Message.Retrieve(`Book review with ${id}`));
  }
};

export const create = async (
  bookId: number,
  body: ICreateBookReviewRequestBody,
  userId: number
) => {
  try {
    console.log(bookId);
    const book = await getBook(bookId);
    if (!book)
      throw new NotFoundError(Error.Message.NotFound(`Book with ${bookId}`));

    if (book.createdBy === userId)
      throw new ForbiddenError(Error.Message.Forbidden());

    // Check if a review by this user for this book already exists
    const existingReview = await prisma.bookReview.findFirst({
      where: {
        bookId: bookId,
        userId: userId,
        isDeleted: false, // optional: only check non-deleted reviews
      },
    });

    if (existingReview) {
      throw new ForbiddenError(MBook.Error.AlreadyReviewed);
    }

    const createPayload = {
      ...body,
      bookId,
      userId,
      createdBy: userId,
      createdAt: new Date(),
    };

    const bookReview = await prisma.bookReview.create({ data: createPayload });
    await updateBookAverageRating(bookId);

    return bookReview;
  } catch (error) {
    ErrorLog(ServiceName, "create", error);
    throw errorWrapper(error, Error.Message.Create(`Book review`));
  }
};

export const update = async (
  id: number,
  body: IUpdateBookReviewRequestBody,
  userId: number
) => {
  try {
    const getbookReview = await getOne(id);
    if (!getbookReview)
      throw new NotFoundError(Error.Message.NotFound(`Book review with ${id}`));

    if (getbookReview.userId !== userId)
      throw new ForbiddenError(Error.Message.Forbidden());

    const updatePayload = {
      ...body,
      updatedBy: userId,
      updatedAt: new Date(),
    };

    const bookReview = await prisma.bookReview.update({
      where: { reviewId: id },
      data: updatePayload,
    });
    await updateBookAverageRating(getbookReview.bookId);

    return bookReview;
  } catch (error) {
    ErrorLog(ServiceName, "update", error);
    throw errorWrapper(error, Error.Message.Update(`Book review`));
  }
};

export const remove = async (id: number, userId: number) => {
  try {
    const bookReview = await getOne(id);
    if (!bookReview)
      throw new NotFoundError(Error.Message.NotFound(`Book review with ${id}`));

    if (bookReview.userId !== userId)
      throw new ForbiddenError(Error.Message.Forbidden());

    const deletePayload = {
      isDeleted: true,
      updatedBy: userId,
      updatedAt: new Date(),
    };

    const deleteReview = await prisma.bookReview.update({
      where: { reviewId: id },
      data: deletePayload,
    });
    await updateBookAverageRating(bookReview.bookId);

    return deleteReview;
  } catch (error) {
    ErrorLog(ServiceName, "remove", error);
    throw errorWrapper(error, Error.Message.Delete(`Book review with ${id}`));
  }
};
