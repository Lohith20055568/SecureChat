import crypto from 'crypto';

const AES_SECRET_KEY = 'r05XA0HdmdEFYVDPyrkJ7wLqs-fkUMAyLX09tXlIiVs='; // Same as Python
const AES_KEY_LENGTH = 32; // AES-256
const IV_LENGTH = 16;
const SALT_LENGTH = 16;
const ITERATIONS = 100000;
const DIGEST = 'sha256';

/**
 * Derives a 256-bit AES key using PBKDF2.
 */
function deriveKey(password, salt) {
  return crypto.pbkdf2Sync(password, salt, ITERATIONS, AES_KEY_LENGTH, DIGEST);
}

/**
 * Encrypts a message using AES-256-CBC and PBKDF2 derived key.
 */
export function encryptMessage(message) {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = deriveKey(AES_SECRET_KEY, salt);

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(message, 'utf-8', 'base64');
  encrypted += cipher.final('base64');

  const finalData = Buffer.concat([salt, iv, Buffer.from(encrypted, 'base64')]);
  return finalData.toString('base64');
}

/**
 * Decrypts the message back using the extracted salt and iv.
 */
export function decryptMessage(encryptedBase64) {
  const encryptedBuffer = Buffer.from(encryptedBase64, 'base64');
  const salt = encryptedBuffer.slice(0, SALT_LENGTH);
  const iv = encryptedBuffer.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const ciphertext = encryptedBuffer.slice(SALT_LENGTH + IV_LENGTH);

  const key = deriveKey(AES_SECRET_KEY, salt);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

  let decrypted = decipher.update(ciphertext, undefined, 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}
