import { Request, Response } from "express";
import * as authService from "./auth.service";
import { sendError, sendSuccess } from "@src/utils/httpResponse";
import {
  ILoginRequestBody,
  IRegisterRequestBody,
} from "./constant/auth.interface";
import { MAuth } from "./constant/auth.message";

const ControllerName = "AuthController";

// Registeration controller of the user.
export const register = async (
  req: Request<any, any, IRegisterRequestBody>,
  res: Response
) => {
  try {
    const result = await authService.register(req.body);
    return sendSuccess(
      req,
      res,
      ControllerName,
      "register",
      MAuth.Success.Register(),
      result,
      201
    );
  } catch (error) {
    return sendError(res, error, req, ControllerName, "register");
  }
};

// Login controller of the user.
export const login = async (
  req: Request<any, any, ILoginRequestBody>,
  res: Response
) => {
  try {
    const result = await authService.login(req.body);

    return sendSuccess(
      req,
      res,
      ControllerName,
      "login",
      MAuth.Success.Login(),
      result,
      201
    );
  } catch (error) {
    return sendError(res, error, req, ControllerName, "login");
  }
};

// Logout contoller of the user.
export const logout = async (req: Request, res: Response) => {
  try {
    // Optional: Debug log
    res.clearCookie("token");

    return sendSuccess(
      req,
      res,
      ControllerName,
      "logout",
      MAuth.Success.Logout(),
      {},
      200
    );
  } catch (error) {
    return sendError(res, error, req, ControllerName, "logout");
  }
};
