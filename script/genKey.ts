import crypto from "crypto";

// Generate RSA key pair
export function generateKeyPair(): { publicKey: string; privateKey: string } {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  return { publicKey, privateKey };
}

// Exported for use in other modules, you would typically store the private key securely
const { publicKey, privateKey } = generateKeyPair();
export { publicKey, privateKey };
