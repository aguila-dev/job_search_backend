import crypto from "crypto";

// Decrypt function using the server's private key
export function decryptDataWithPrivateKey(
  encryptedData: string,
  privateKey: string
): string {
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(encryptedData, "base64")
  );

  return decrypted.toString("utf8");
}
