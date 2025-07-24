// utils/aesUtils.js
import CryptoJS from 'crypto-js';

export const generateAESKey = () => {
  return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
};
