import { AUTH_COOKIES } from "@/constants";
import { Response } from "express";

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
): void => {
  const { accessTokenKey, refreshTokenKey } = AUTH_COOKIES;

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
};
