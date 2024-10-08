/// <reference path="../types/express.jwt.d.ts" />
require('dotenv').config();
import { AUTH_COOKIES } from '@/constants';
import { decryptDataWithPrivateKey } from '@utils/decryptData';
import { User } from 'db';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ReqWithUser } from 'middleware/types';
import { privateKey } from 'script/genKey';

interface TokenPayload extends JwtPayload {
  id: number;
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { encryptedData } = req.body;

  let email, password;

  if (process.env.ENCRYPTION_ENABLED === 'true') {
    if (!encryptedData) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    let decryptedData;
    try {
      decryptedData = decryptDataWithPrivateKey(encryptedData, privateKey);
    } catch {
      return res.status(400).json({ message: 'Invalid request' });
    }
    try {
      ({ email, password } = JSON.parse(decryptedData));
    } catch {
      return res.status(400).json({ message: 'Invalid request' });
    }
  } else {
    // If encryption is not enabled, use the plain email and password
    ({ email, password } = req.body);
    if (!email || !password) {
      return res.status(400).json({ message: 'Invalid request' });
    }
  }

  try {
    const { accessToken, refreshToken } = await User.authenticate(
      email,
      password
    );

    if (!accessToken) {
      throw new Error('Invalid login credentials');
    }

    res.cookie(AUTH_COOKIES.refreshTokenKey, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure flag for production only
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({ accessToken });
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
    const { encryptedData } = req.body;

    const decryptedData = decryptDataWithPrivateKey(encryptedData, privateKey);
    const { email, password, firstName, lastName } = JSON.parse(decryptedData);

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
    });

    console.log('need to send verification email here');
    const { accessToken, refreshToken } = user.generateTokens();

    res.cookie(AUTH_COOKIES.refreshTokenKey, refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      accessToken,
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
    const accessToken = authReq.token;

    if (!user || !accessToken) {
      return res
        .status(401)
        .json({ message: 'Unauthorized', tokenValid: false });
    }

    res.status(200).json({ tokenValid: true, accessToken });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const oldRefreshToken = req.cookies._jaRT;
    console.log('oldRefreshToken', oldRefreshToken);
    if (!oldRefreshToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(
      oldRefreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as JwtPayload;

    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { accessToken } = user.generateTokens();

    res.cookie(AUTH_COOKIES.accessTokenKey, accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 5 * 60 * 1000, // 5 minutes
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie(AUTH_COOKIES.refreshTokenKey);
    return res.status(200).send('Logout successful');
  } catch (error) {
    next(error);
  }
};

export const loginAuth0User = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const auth0UserId = req.auth?.payload.sub;
    console.log('req.body:', req.body);
    const user = await User.findOne({ where: { email, auth0UserId } });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

export const signupAuth0User = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    const auth0UserId = req.auth?.payload.sub;
    const userPayload = req.auth?.payload;
    console.log(
      'req.body!!! ** MADE TO THE SIGNUP USER CONTROLLER *** \n',
      req.body,
      auth0UserId,
      userPayload
    );
    const user = await User.create({ email, name, auth0UserId });
    console.log('user created:', {
      email: user.email,
      name: user.name,
      auth0UserId: user.auth0UserId,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};
