import CryptoJS from "crypto-js";

export const CreateMarkup = (content) => {
    return {__html: content}
}

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
};

export const formatLitigant = (petitioners, respondents) => {
    return (
        <div className="text-center">
            <ol className="centered-list">
                { petitioners.map((petitioner, index) => (
                <li key={index}>{petitioner.petitioner_name}</li>
                ))}
            </ol>
            <span className="text-danger"><strong>Vs</strong></span>
            <ol className="centered-list">
                { respondents.map((respondent, index) => (
                <li key={index}>{respondent.respondent_name}</li>
                ))}
            </ol>
        </div>
    )
}


export const RequiredField = () => {
    return(
        <span className="text-danger ml-1">*</span>
    )
}

export const ModelClose = (props) => {
    return(
        <i 
            className="fa fa-times btn-close" 
            data-bs-dismiss="modal" 
            aria-label="Close"
            onClick={props.handleClose}
        ></i>
    )
}

export const truncateChars = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
};

export const encode_efile_number = (pk) => {
    return btoa(pk); 
};

export const decode_file_number = (encodedPk) => {
    return atob(encodedPk);
  };


  const SECRET_KEY = CryptoJS.enc.Hex.parse("7a8b9c10d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1");
  const IV = CryptoJS.enc.Hex.parse("1234567890abcdef1234567890abcdef");

  console.log("🔑 SECRET_KEY:", SECRET_KEY.toString());
console.log("🔑 IV:", IV.toString());

// 🔹 AES-256 Encryption Function
export const encryptData = (data) => {
    if (!data) {
        console.error("❌ Encryption failed: Data is empty or undefined");
        return "";
    }

    const jsonData = typeof data === "object" ? JSON.stringify(data) : data;

    try {
        const encrypted = CryptoJS.AES.encrypt(jsonData, SECRET_KEY, {
            iv: IV,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString();

        console.log("🔐 Successfully Encrypted Data:", encrypted);
        return encrypted;
    } catch (e) {
        console.error("❌ Encryption Error:", e);
        return "";
    }
};


// 🔹 AES-256 Decryption Function
export const decryptData = (cipherText) => {
    if (!cipherText || typeof cipherText !== "string") {
        console.error("❌ Decryption failed: Ciphertext is invalid or empty");
        return "";
    }

    console.log("🛠️ Ciphertext Before Decryption:", cipherText);

    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY, {
            iv: IV,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        console.log("🔍 Raw Decrypted Data:", decryptedData);

        return decryptedData ? JSON.parse(decryptedData) : decryptedData;
    } catch (e) {
        console.error("❌ Decryption failed:", e);
        return "";
    }
};

