import React, { useState } from 'react';
import { encrypt, decrypt } from './utils/crypto';

const EncryptionDemo = () => {
  const [original, setOriginal] = useState('');
  const [encrypted, setEncrypted] = useState('');
  const [decrypted, setDecrypted] = useState('');

  const handleEncrypt = () => {
    const enc = encrypt(original);
    setEncrypted(enc);
    setDecrypted(decrypt(enc));
  };

  return (
    <div>
      <h3>React AES Encryption/Decryption</h3>
      <input 
        type="text" 
        value={original} 
        onChange={(e) => setOriginal(e.target.value)} 
        placeholder="Enter text" 
      />
      <button onClick={handleEncrypt}>Encrypt</button>
      <p><strong>Encrypted:</strong> {encrypted}</p>
      <p><strong>Decrypted:</strong> {decrypted}</p>
    </div>
  );
};

export default EncryptionDemo;
