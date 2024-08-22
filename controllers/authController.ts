require("dotenv").config();
import { AUTH_COOKIES } from "@/constants";
import { decryptDataWithPrivateKey } from "@utils/decryptData";
import { User } from "db";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ReqWithUser } from "middleware/types";
import { privateKey } from "script/genKey";

const { accessTokenKey, refreshTokenKey } = AUTH_COOKIES;

interface TokenPayload extends JwtPayload {
  id: number;
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { encryptedData } = req.body;

  const decryptedData = decryptDataWithPrivateKey(encryptedData, privateKey);

  const { email, password } = JSON.parse(decryptedData);

  try {
    const { accessToken, refreshToken } = await User.authenticate(
      email,
      password
    );

    if (!accessToken) {
      throw new Error("Invalid login credentials");
    }

    res.cookie(accessTokenKey, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure flag for production only
      maxAge: 1 * 5 * 60 * 1000, // 5 minutes
    });

    res.cookie(refreshTokenKey, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure flag for production only
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({ accessToken });
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

    console.log("need to send verification email here");
    const { accessToken, refreshToken } = user.generateTokens();

    res.cookie(accessTokenKey, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure flag for production only
      maxAge: 1 * 5 * 60 * 1000, // 5 minutes
    });

    res.cookie(refreshTokenKey, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure flag for production only
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // setAuthCookies(res, accessToken, refreshToken);

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
      return res.status(400).json({ error: "Invalid token" });
    }

    user.authenticated = true;

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
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
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json({ tokenValid: true, accessToken: accessToken });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies._jaRT;
    if (!refreshToken) {
      res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as JwtPayload;

    const user = await User.findByPk(decoded.id);
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
    }

    const { accessToken } = user.generateTokens();

    res.cookie(AUTH_COOKIES.accessTokenKey, accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 5 * 60 * 1000, // 5 minutes
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie(AUTH_COOKIES.accessTokenKey, {
      httpOnly: true,
      secure: true,
    });
    res.clearCookie(AUTH_COOKIES.refreshTokenKey, {
      httpOnly: true,
      secure: true,
    });
    return res.status(200).send("Logout successful");
  } catch (error) {
    next(error);
  }
};
