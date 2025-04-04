import CryptoJS from 'crypto-js';

const secretKey = process.env.REACT_APP_SECRET_KEY;

// Encrypt any object or string
export const encrypt = (data) => {
    const stringifiedData = typeof data === 'string' ? data : JSON.stringify(data);
    const ciphertext = CryptoJS.AES.encrypt(stringifiedData, secretKey).toString();
    return ciphertext;
  };
  
  // Decrypt and return object if JSON, else return plain string
  export const decrypt = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  
    // Try to parse JSON. If not JSON, return as plain string
    try {
      return JSON.parse(decryptedText);
    } catch {
      return decryptedText;
    }
};