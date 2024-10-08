import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ReqWithUser } from "./types";
interface TokenPayload {
  id: number;
  email: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authReq = req as ReqWithUser;

  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token || !authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    authReq.user = decoded; // Attach the decoded user information to the request
    authReq.token = token; // Attach the token to the request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized", tokenValid: false });
  }
};
