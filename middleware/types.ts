import { Request } from "express";
import { User } from "../db";

export interface ReqWithUser extends Request {
  user?: typeof User;
  token?: string;
}
