/**
 * Register a new user
 */

import { User } from 'db';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ReqWithUser } from 'middleware/types';

interface TokenPayload extends JwtPayload {
  id: number;
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const token = await User.authenticate(email, password);
    if (!token) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    res.cookie('_jaV1', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(token);
  } catch (error) {
    next(error);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;
    console.log('register route hit and the body \n', req.body);
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
    });

    console.log('need to send verification email here');
    const userToken = user.generateToken();
    // Store token in HTTP-only cookie
    res.cookie('_jaV1', userToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: 'User created successfully',
      token: userToken,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    user.authenticated = true;
    await user.save();
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as ReqWithUser;
    const user = authReq.user;
    const token = req.cookies._jaV1;
    res.status(200).json({ token, user });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie('_jaV1');
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};
