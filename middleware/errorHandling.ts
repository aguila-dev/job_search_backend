import { NextFunction, Request, Response } from "express";

export const errorHandling = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errStatus = (err as any).status || 500;
  res.status(errStatus).json(err.message || "Internal server error.");
};
