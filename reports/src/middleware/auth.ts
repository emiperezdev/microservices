import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import CustomRequest from "../dtos/auth";

export default function (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.header("x-auth-token");
  if (!token)
    return res
      .status(401)
      .send(">>> [REPORTS SERVICE] Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (ex: any) {
    res.status(400).send("[REPORTS SERVICE] Invalid token.");
  }
}
