import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { ToastContainer } from 'react-toastify';
import * as Yup from 'yup';
import Editor from 'react-simple-wysiwyg';
import { useTranslation } from 'react-i18next';
import './style.css';

const GroundsForm = ({ addGround, count, selectedGround }) => {
    // Yup validation schema
    const validationSchema = Yup.object({
        description: Yup.string()
            .max(3000, "Description should not be more than 3000 characters") // Max 3000 characters
            .required("The description field may not be blank") // Required field
    });

    const initialState = {
        description: ''
    };

    const [ground, setGround] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [remainingChars, setRemainingChars] = useState(3000); // Set to 10 as per your requirement
    const { t } = useTranslation();

    // Save the ground to the parent component
    const saveGround = async () => {
        try {
            // Validate using Yup validation schema
            await validationSchema.validate(ground, { abortEarly: false });
            addGround(ground); // If valid, add the ground and reset
            setGround(initialState);
            setRemainingChars(3000); // Reset remaining characters to 10 after save
        } catch (error) {
            const newErrors = {};
            error.inner.forEach((err) => {
                newErrors[err.path] = err.message;
            });
            setErrors(newErrors); // Update errors with validation messages
        }
    };

    // If there is a selected ground, populate it in the state
    useEffect(() => {
        if (selectedGround) {
            setGround(selectedGround);
        }
        setRemainingChars(3000); // Ensure it starts at 10
        setErrors({ description: '' }); // Clear any errors on initial render
    }, [selectedGround]);

    // Handle the editor change and limit the characters
    const handleEditorChange = (e) => {
        const newValue = e.target.value;

        // Directly calculate the remaining characters from the input
        const updatedRemainingChars = 3000 - newValue.length;

        // Update state if the length is within the limit (3000 characters)
        if (updatedRemainingChars >= 0) {
            setGround({ ...ground, description: newValue });
            setRemainingChars(updatedRemainingChars); // Update remaining characters correctly
            setErrors({ ...errors, description: '' }); // Clear error if within limit
        } else {
            setErrors({ ...errors, description: 'Maximum 3000 characters only allowed' }); // Show error message if limit is exceeded
        }
    };

    const handlePaste = (e) => {
        // Get the pasted content
        const pastedContent = e.clipboardData.getData('text');
        
        // Combine the current content and pasted content
        const newContent = ground.description + pastedContent;

        // Check if the new content exceeds the 10 character limit
        if (newContent.length > 3000) {
            e.preventDefault(); // Prevent the paste
            const truncatedContent = newContent.slice(0, 3000); // Truncate to 10 characters
            setGround({ ...ground, description: truncatedContent });
            setRemainingChars(0); // No remaining characters if truncated
        } else {
            // Allow the paste if it's within the limit
            setGround({ ...ground, description: newContent });
            setRemainingChars(3000 - newContent.length); // Update remaining characters correctly
            setErrors({ ...errors, description: '' }); // Clear error if within limit
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();  // Prevent the default behavior (line break)
        }
      };

    return (
        <>
            {count < 3 && (
                <>
                    <ToastContainer />
                    <div className="form-group">
                        <Editor
                            value={ground.description}
                            onChange={handleEditorChange}  // Handle text change
                            onPaste={handlePaste}  // Handle paste event
                            onKeyDown={handleKeyDown} 
                            style={{ minHeight: '300px', width: '100%' }}  // Added width to ensure it's full-width
                        />
                        {/* Display remaining characters */}
                        <div>
                            <span>{remainingChars} characters remaining</span>
                        </div>
                        {errors.description && (
                            <div style={{ color: 'red' }}>{errors.description}</div> // Display error if max limit exceeded
                        )}
                    </div>
                    <div className="form-group">
                        <Button variant="contained" color="success" onClick={saveGround}>
                            <i className="fa fa-plus mr-2"></i>
                            {t('add_ground')}
                        </Button>
                    </div>
                </>
            )}
        </>
    );
};

export default GroundsForm;
