import { prisma } from "@src/shared/prisma/client";
import {
  ICreateBookRequestBody,
  IGetBooksQuery,
  IUpdateBookRequestBody,
} from "./constant/book.interface";
import { errorWrapper } from "@src/shared/error/errorWrapper";
import { ErrorLog } from "@src/shared/logs/errorLog";
import { Error } from "@src/shared/global/constant/error.message";
import { NotFoundError } from "@src/shared/error/customError";

import { bookProfile } from "./constant/book.profile";

const ServiceName = "BookService";

export const getAll = async (queries: IGetBooksQuery) => {
  try {
    const { page = 1, limit = 10, author, genre } = queries;

    const whereClause: any = {
      isDeleted: false,
    };

    if (author) whereClause.author = author;
    if (genre) whereClause.genre = genre;

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where: whereClause,
        include: bookProfile,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" }, // Optional: sort latest first
      }),
      prisma.book.count({ where: whereClause }),
    ]);

    return {
      data: books,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
    };
  } catch (error) {
    ErrorLog(ServiceName, "getAll", error);
    throw errorWrapper(error, Error.Message.Retrieve(`Books`));
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

    const getOne = await prisma.book.findUnique({
      where: { bookId: id, ...whereClause },
      include: bookProfile,
    });

    if (!getOne)
      throw new NotFoundError(Error.Message.NotFound(`Book with ${id}`));

    return getOne;
  } catch (error) {
    ErrorLog(ServiceName, "getOne", error);
    throw errorWrapper(error, Error.Message.Retrieve(`Book with ${id}`));
  }
};

export const create = async (body: ICreateBookRequestBody, userId: number) => {
  try {
    const createData = {
      ...body,
      author: userId,
      createdBy: userId,
    };
    const createBook = await prisma.book.create({ data: createData });
    return createBook;
  } catch (error) {
    ErrorLog(ServiceName, "create", error);
    throw errorWrapper(error, Error.Message.Create("Book"));
  }
};

export const update = async (
  id: number,
  body: IUpdateBookRequestBody,
  userId: number
) => {
  try {
    const updateData = {
      ...body,
      updatedBy: userId,
      updatedAt: new Date(),
    };
    const updateBook = await prisma.book.update({
      where: { bookId: id, isDeleted: false },
      data: updateData,
    });

    return updateBook;
  } catch (error) {
    ErrorLog(ServiceName, "update", error);
    throw errorWrapper(error, Error.Message.Update("Book"));
  }
};

export const remove = async (id: number, userId: number) => {
  try {
    const book = await getOne(id);
    if (!book)
      throw new NotFoundError(Error.Message.NotFound(`Book with ${id}`));

    const deletingPayload = {
      isDeleted: true,
      updatedBy: userId,
      updatedAt: new Date(),
    };

    const remove = await prisma.book.update({
      where: { bookId: id },
      data: deletingPayload,
    });

    // Step 2: Soft delete all associated book reviews
    await prisma.bookReview.updateMany({
      where: { bookId: id },
      data: {
        isDeleted: true,
        updatedBy: userId,
        updatedAt: new Date(),
      },
    });

    return remove;
  } catch (error) {
    ErrorLog(ServiceName, "remove", error);
    throw errorWrapper(error, Error.Message.Retrieve(`Book with ${id}`));
  }
};

// Others

export const updateBookAverageRating = async (id: number) => {
  try {
    const result = await prisma.bookReview.aggregate({
      where: {
        bookId: id,
        isDeleted: false,
      },
      _avg: {
        rating: true,
      },
    });

    const averageRating = result._avg.rating ?? 0;

    await prisma.book.update({
      where: { bookId: id },
      data: { review: averageRating },
    });
  } catch (error) {
    ErrorLog(ServiceName, "updateBookAverageRating", error);
    throw errorWrapper(error, Error.Message.Update(`Book with ${id}`));
  }
};

export const searchBooks = async (
  query: string,
  page: number,
  limit: number
) => {
  try {
    const whereClause: any = {
      isDeleted: false,
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          authorInfo: {
            OR: [
              {
                firstName: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                lastName: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                username: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          },
        },
      ],
    };

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where: whereClause,
        include: bookProfile,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.book.count({ where: whereClause }),
    ]);

    return {
      data: books,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
    };
  } catch (error) {
    ErrorLog(ServiceName, "searchBooks", error);
    throw errorWrapper(error, Error.Message.Retrieve("Search results"));
  }
};
