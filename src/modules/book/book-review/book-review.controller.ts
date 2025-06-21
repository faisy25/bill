import { errorWrapper } from "@src/shared/error/errorWrapper";
import { Error } from "@src/shared/global/constant/error.message";
import { ErrorLog } from "@src/shared/logs/errorLog";
import { Request, Response } from "express";
import {
  ICreateBookReviewRequestBody,
  IUpdateBookReviewRequestBody,
} from "../constant/book.interface";
import { getUserId } from "@src/utils/getUserId";
import * as bookReviewService from "./book-review.service";
import { sendSuccess } from "@src/utils/httpResponse";
import { Success } from "@src/shared/global/constant/success.message";

const ControllerName = "BookReviewController";

export const getAll = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const page = parseInt((req.query.page as string) || "1", 10);
    const limit = parseInt((req.query.limit as string) || "5", 10);

    const id = parseInt(bookId);

    const getOne = await bookReviewService.getAll({
      bookId: id,
      page,
      limit,
    });

    return sendSuccess(
      req,
      res,
      ControllerName,
      "getAll",
      Success.Message.Retrieved("book reveiws"),
      getOne,
      200
    );
  } catch (error) {
    ErrorLog(ControllerName, "getAll", error);
    throw errorWrapper(error, Error.Message.Retrieve(`Book reviews`));
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const getOne = await bookReviewService.getOne(+id);

    return sendSuccess(
      req,
      res,
      ControllerName,
      "getOne",
      Success.Message.Retrieved("book reveiw"),
      getOne,
      200
    );
  } catch (error) {
    ErrorLog(ControllerName, "getOne", error);
    throw errorWrapper(error, Error.Message.Retrieve(`Book review`));
  }
};

export const create = async (
  req: Request<any, any, ICreateBookReviewRequestBody>,
  res: Response
) => {
  try {
    const userId = await getUserId(req);
    console.log(req.params);
    const bookId = req.params.bookId;
    console.log(bookId, "in controller");

    const create = await bookReviewService.create(
      +bookId,
      { ...req.body },
      userId
    );

    return sendSuccess(
      req,
      res,
      ControllerName,
      "create",
      Success.Message.Create("book reveiw"),
      create,
      200
    );
  } catch (error) {
    ErrorLog(ControllerName, "create", error);
    throw errorWrapper(error, Error.Message.Create(`Book review`));
  }
};

export const update = async (
  req: Request<any, any, IUpdateBookReviewRequestBody>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const userId = await getUserId(req);
    const update = await bookReviewService.update(+id, req.body, userId);

    return sendSuccess(
      req,
      res,
      ControllerName,
      "update",
      Success.Message.Update("book reveiw"),
      update,
      200
    );
  } catch (error) {
    ErrorLog(ControllerName, "update", error);
    throw errorWrapper(error, Error.Message.Update(`Book review`));
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = await getUserId(req);
    const removed = await bookReviewService.remove(+id, userId);

    return sendSuccess(
      req,
      res,
      ControllerName,
      "delete",
      Success.Message.Delete("book reveiw"),
      removed,
      200
    );
  } catch (error) {
    ErrorLog(ControllerName, "delete", error);
    throw errorWrapper(error, Error.Message.Delete(`Book review`));
  }
};
