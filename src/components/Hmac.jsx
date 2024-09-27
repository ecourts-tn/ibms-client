import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

const Hmac = () => {
  const [hmac, setHmac] = useState('');

  // Function to generate HMAC using SHA-512
  const generateHmac = () => {
    const login = "7";
    const pass = "Test@123";
    const ttype = "NBFundTransfer";
    const prodid = "NSE";
    const txnid = "Mer123";
    const amt = "3000.00";
    const txncurr = "INR";
    const reqHashKey = "KEY123657234";
    
    // Concatenating the required strings
    const sampleStr = login + pass + ttype + prodid + txnid + amt + txncurr;

    // Generating the HMAC using SHA-512
    const hmacGenerated = CryptoJS.HmacSHA512(sampleStr, reqHashKey).toString(CryptoJS.enc.Hex);

    // Setting the generated HMAC
    setHmac(hmacGenerated);
  };

  return (
    <div>
      <h2>Generate HMAC using SHA-512</h2>
      <button onClick={generateHmac}>Generate HMAC</button>
      {hmac && (
        <div>
          <h4>HMAC:</h4>
          <p>{hmac}</p>
        </div>
      )}
    </div>
  );
};

export default Hmac;
