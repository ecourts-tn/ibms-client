import CryptoJS from 'crypto-js';

function aes256Decryption(encryptedText, secret) {
    const salt = 'I^j&N($2*#';
    const iv = CryptoJS.lib.WordArray.create(new Array(16).fill(0));
    const keySize = 256 / 32;
    const iterations = 65536;

    // Generate key from the secret using PBKDF2
    const key = CryptoJS.PBKDF2(secret, CryptoJS.enc.Utf8.parse(salt), {
        keySize: keySize,
        iterations: iterations,
        hasher: CryptoJS.algo.SHA256
    });

    // Decrypt
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    // Convert decrypted data to UTF-8 string and replace | with ,
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    console.log(decryptedText)
    return decryptedText //.replace(/\u0010/g, '').replace(/\|/g, ', ');

}

export default aes256Decryption;
