
// Validate Email using Regular Expression
// Email validation function
// export const validateEmail = (email_address) => {
//     if (!email_address) {
//         return ''; // No error if the email is empty
//     }

//     const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!emailPattern.test(email_address)) {
//         return 'Invalid email address'; // Return error if email doesn't match the pattern
//     }
//     return ''; // Return empty string if valid
// };


export const validateEmail = (fieldName, value) => {
    let errorMessage = '';

    // A map of field names to their respective validation logic
    const validationRules = {
        email: (value) => {
            if (!value) return ''; // No error if empty
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailPattern.test(value) ? '' : 'Invalid email address';
        },
        email_address: (value) => {
            if (!value) return ''; // No error if empty
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailPattern.test(value) ? '' : 'Invalid email address';
        }, 
       
        // Add more fields and their validations here
    };

    // Check if there's a validation function for the field, and call it
    if (validationRules[fieldName]) {
        errorMessage = validationRules[fieldName](value);
    }

    return errorMessage;
};


// Handle the blur event for the email field
// export const handleBlur = (litigant, setErrors) => {
//     // Validate the email when the input field loses focus
//     const emailError = validateEmail(litigant.email_address);

//     // Update the errors state with the email validation result
//     setErrors((prevErrors) => {
//         const newErrors = { ...prevErrors, email_address: emailError };
//         return newErrors;
//     });
// };

export const handleBlur = (fieldName, value, setErrors, validateEmail) => {
    let errorMessage = '';

    // Check if there is a specific validation function for the field
    if (validateEmail[fieldName]) {
        errorMessage = validateEmail[fieldName](value); // Call the specific validation function
    }

    // Update the errors state with the error message for the specific field
    setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: errorMessage, // Dynamically set the error for the specific field
    }));
};


export const validateMobile = (mobile_number) => {
    if (!mobile_number) return 'Mobile number is required';
    if (mobile_number.length !== 10) return 'Mobile number must be 10 digits';
    return ''; // ''; return empty string if valid
  };

// Validate Mobile Number (for example, valid if it's 10 digits)
export const handleMobileChange = (e, setField, field, fieldName) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
    if (value.length <= 10) {
        setField({ ...field, [fieldName]: value });
      return '';
    }
    return 'Mobile number should be a valid number and up to 10 digits only';
};


export const handleAgeChange = (e, setLitigant, litigant) => {
    const value = e.target.value;
  
    // Validate that the value is numeric and the length is <= 2
    if (/^\d*$/.test(value) && value.length <= 2) {
      setLitigant({...litigant, [e.target.name]: value}); // Update the litigant state
      return ''; // Return empty if no error
    }
    
    return 'Age should be a valid number and up to 2 digits only'; // Return error message if invalid
};

export const handlePincodeChange = (e, setLitigant, litigant) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setLitigant({...litigant, [e.target.name]: value});
      return '';
    }
    return 'Pincode should be a valid number and up to 6 digits only';
};


export const handleNameChange = (e, setField, field, fieldName) => {
    const value = e.target.value; // Access the value from e.target.value
    if (/^[A-Za-z\s]*$/g.test(value)) {
        setField({ ...field, [fieldName]: value }); // Dynamically update the field
        return null; // No error
    } else {
        return 'Only letters and spaces are allowed.'; // Error message
    }
};


