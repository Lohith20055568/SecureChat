import CryptoJS from 'crypto-js';

export function encryptText(text, key) {
  const encrypted = CryptoJS.AES.encrypt(text, key).toString();
  return encrypted;
}

export function decryptText(encryptedText, key) {
  try {
    if (!encryptedText || !key) {
      console.warn('⚠️ Skipping decryption: missing key or message');
      return encryptedText; // fallback to raw text
    }

    const bytes = CryptoJS.AES.decrypt(encryptedText, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      console.warn('⚠️ Failed to decode decrypted text. Returning original encrypted text.');
      return encryptedText;
    }

    return decrypted;
  } catch (error) {
    console.warn('⚠️ Safe decrypt fallback:', error.message);
    return encryptedText; // fallback to avoid crashing UI
  }
}
