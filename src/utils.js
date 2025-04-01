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


export const encryptData = (data) => {
    if (typeof data === "undefined" || data === null) return ""; // Prevent null/undefined errors
    const jsonData = typeof data === "object" ? JSON.stringify(data) : data;
    return btoa(unescape(encodeURIComponent(jsonData)));
};

export const decryptData = (cipherText) => {
    if (!cipherText) return ""; // Prevent null/undefined errors
    let decoded;
    try {
        decoded = decodeURIComponent(escape(atob(cipherText)));
        return JSON.parse(decoded); // Try parsing JSON
    } catch (e) {
        return decoded || ""; // Return as string if parsing fails
    }
};  