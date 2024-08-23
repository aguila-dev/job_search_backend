import crypto from "crypto";

export const generateRandom256BitKey = (): string => {
  const secret = crypto.randomBytes(32).toString("hex");
  return secret;
};

generateRandom256BitKey();

console.log("Secret:", generateRandom256BitKey());
