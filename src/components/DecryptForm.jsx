import React, { useState } from 'react';
import aes256Decryption from './Decrypt';

function DecryptForm() {
    const [encryptedText, setEncryptedText] = useState('');
    const [secret, setSecret] = useState('');
    const [decryptedText, setDecryptedText] = useState('');

    const handleDecrypt = () => {
        const decrypted = aes256Decryption(encryptedText, secret);
        setDecryptedText(decrypted);
    };

    return (
        <div>
            <h1>AES-256 Decryption</h1>
            <input
                type="text"
                placeholder="Encrypted Text"
                value={encryptedText}
                onChange={(e) => setEncryptedText(e.target.value)}
            />
            <input
                type="text"
                placeholder="Secret Key"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
            />
            <button onClick={handleDecrypt}>Decrypt</button>
            <p>Decrypted Text: {decryptedText}</p>
        </div>
    );
}

export default DecryptForm;
