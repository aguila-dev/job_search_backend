import jwt from 'jsonwebtoken';
import { User } from '../db';
import { NextFunction, Request, Response } from 'express';
import { ReqWithUser } from './types';
interface TokenPayload {
  id: number;
  email: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('authenticating middleware');
  const authReq = req as ReqWithUser;
  const token = req.cookies._jaV1;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    authReq.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
