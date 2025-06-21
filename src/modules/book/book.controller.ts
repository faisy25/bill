import { Request, Response } from "express";
import {
  ICreateBookRequestBody,
  IUpdateBookRequestBody,
} from "./constant/book.interface";
import * as bookService from "./book.service";
import { sendError, sendSuccess } from "@src/utils/httpResponse";
import { Success } from "@src/shared/global/constant/success.message";
import { getUserId } from "@src/utils/getUserId";
import { getBooksQuerySchema } from "./constant/book.validation";

const ControllerName = "BookController";

export const getAll = async (req: Request, res: Response) => {
  try {
    const query = getBooksQuerySchema.parse(req.query);

    const page = parseInt(query.page || "1");
    const limit = parseInt(query.limit || "10");
    const author = query.author ? parseInt(query.author) : undefined;
    const genre = query.genre ? parseInt(query.genre) : undefined;

    const books = await bookService.getAll({ page, limit, author, genre });

    return sendSuccess(
      req,
      res,
      ControllerName,
      "getAll",
      Success.Message.Retrieved("books"),
      books
    );
  } catch (error) {
    return sendError(res, error, req, ControllerName, "getAll");
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = await bookService.getOne(+id);

    return sendSuccess(
      req,
      res,
      ControllerName,
      "getOne",
      Success.Message.Retrieved("books"),
      book
    );
  } catch (error) {
    return sendError(res, error, req, ControllerName, "getOne");
  }
};

export const create = async (
  req: Request<any, any, ICreateBookRequestBody>,
  res: Response
) => {
  try {
    const userId = await getUserId(req);
    const create = await bookService.create(req.body, userId);

    return sendSuccess(
      req,
      res,
      ControllerName,
      "create",
      Success.Message.Update("user"),
      create,
      200
    );
  } catch (error) {
    return sendError(res, error, req, ControllerName, "create");
  }
};

export const update = async (
  req: Request<any, any, IUpdateBookRequestBody>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const userId = await getUserId(req);
    const update = await bookService.update(+id, req.body, userId);

    return sendSuccess(
      req,
      res,
      ControllerName,
      "update",
      Success.Message.Update("user"),
      update,
      200
    );
  } catch (error) {
    return sendError(res, error, req, ControllerName, "update");
  }
};

export const remove = async (
  req: Request<any, any, IUpdateBookRequestBody>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const userId = await getUserId(req);
    const update = await bookService.remove(+id, userId);

    return sendSuccess(
      req,
      res,
      ControllerName,
      "remove",
      Success.Message.Update("user"),
      update,
      200
    );
  } catch (error) {
    return sendError(res, error, req, ControllerName, "remove");
  }
};

// Others

// Search api for author and genre
export const searchBooks = async (req: Request, res: Response) => {
  try {
    const { query = "", page = "1", limit = "10" } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const books = await bookService.searchBooks(
      query as string,
      pageNum,
      limitNum
    );

    return sendSuccess(
      req,
      res,
      ControllerName,
      "searchBooks",
      Success.Message.Retrieved("Books"),
      books
    );
  } catch (error) {
    return sendError(res, error, req, ControllerName, "searchBooks");
  }
};
