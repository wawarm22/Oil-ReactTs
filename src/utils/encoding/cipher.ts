import CryptoJS from "crypto-js";

const secret = "my-secret-key";

// // Encrypt
// const encrypted = CryptoJS.AES.encrypt(token, secret).toString();
export const cipherEncrypt = (word: string) => {
  return CryptoJS.AES.encrypt(word, secret).toString();
};

// // Decrypt
// const bytes = CryptoJS.AES.decrypt(encrypted, secret);
// const decrypted = bytes.toString(CryptoJS.enc.Utf8);
export const cipherDecrypt = (word: string) => {
  return CryptoJS.AES.decrypt(word, secret).toString(CryptoJS.enc.Utf8);
};

// console.log({ encrypted, decrypted });