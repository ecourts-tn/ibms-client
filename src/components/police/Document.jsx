import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import UploadIcon from '@mui/icons-material/UploadRounded';
import Button from '@mui/material/Button';
import api from '../../api';
import config from '../../config';
import { nanoid } from '@reduxjs/toolkit';

const Document = ({ documents, setDocuments, addDocument, deleteDocument }) => {
    const initialState = {
        id: nanoid(),
        title: '',
        document: '' // Ensure document is empty initially
    };

    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState(initialState);

    const validationSchema = {
        // Add validation if needed
    };

    const handleSubmit = async () => {
        try {
            const efile_no = localStorage.getItem('efile_no');
            const response = await api.post(`case/document/create/`, form, {
                headers: {
                    'content-type': 'multipart/form-data',
                },
                params: {
                    efile_no,
                },
            });

            if (response.status === 201) {
                setDocuments((documents) => [...documents, response.data]);
                setForm(initialState); // Reset form state after adding document
                toast.success(`Document ${response.data.id} uploaded successfully`, {
                    theme: 'colored',
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleFileChange = (e, fileType) => {
        const file = e.target.files[0]; // Get the first file
        if (!file) return; // If no file is selected, return early

        let errorMessage = '';

        // PDF Validation (for notary_order and reg_certificate)
        if (fileType === 'document') {
            // Validate file type (only PDF)
            if (file.type !== 'application/pdf') {
                errorMessage = 'Only PDF files are allowed for Response Documents';
            }

            // Validate file size (max 5MB for PDF)
            if (file.size > 5 * 1024 * 1024) { // 5MB in bytes
                errorMessage = errorMessage || 'File size must be less than 5MB.';
            }
        }

        // If there's an error, show it
        if (errorMessage) {
            setErrors({
                ...errors,
                [fileType]: errorMessage,
            });
            return; // Stop further execution if file type or size is invalid
        }

        // If validation passes, update the form with the file data
        setForm({
            ...form,
            [fileType]: {
                name: file.name, // Display the file name
                file: file, // Store the actual file
            },
        });

        // Clear any previous errors for this file type
        setErrors({
            ...errors,
            [fileType]: '',
        });
    };

    const handleAddDocument = () => {
        if (!form.document || !form.document.file) {
            // If no file is selected, show an error message
            // toast.error('Please select a valid document before adding.', {
            //     theme: 'colored',
            // });
            return;
        }

        // If file is valid, proceed with adding the document
        addDocument(form);
        setForm(initialState); // Clear form fields after adding
    };

    return (
        <>
            <ToastContainer />
            {documents.length > 0 && (
                <table className="table table-bordered table-striped table-sm">
                    <thead className="bg-info">
                        <tr>
                            <th>S.No</th>
                            <th>Title</th>
                            <th>Document</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map((document, index) => (
                            <tr key={document.id}>
                                <td>{index + 1}</td>
                                <td>{document.title}</td>
                                <td>{document.document.name}</td>
                                <td>
                                    <a
                                        href={`${config.apiUrl}${document.document}`}
                                        target="_blank"
                                        className="btn btn-info btn-sm"
                                    >
                                        View
                                    </a>
                                    <button
                                        className="btn btn-danger btn-sm ml-2"
                                        onClick={() => deleteDocument(index)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <form encType="multipart/form-data">
                <div className="row">
                    <div className="col-md-5">
                        <div className="form-group">
                            <label htmlFor="title">Document Title</label>
                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className="form-group">
                            <label htmlFor="document">Document</label>
                            <input
                                type="file"
                                name="document"
                                className="form-control"
                                onChange={(e) => handleFileChange(e, 'document')}
                                accept=".pdf"
                            />
                            {/* Display selected file name */}
                            {form.document && form.document.name && (
                                <span className="mx-2">{form.document.name}</span>
                            )}
                            {/* Display error message if any */}
                            {errors.document && (
                                <div className="invalid-feedback" style={{ display: 'block' }}>
                                    {errors.document}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-md-1 mt-4 pt-2">
                        <div className="">
                            <Button
                                variant="contained"
                                color="info"
                                onClick={handleAddDocument} // Use this function to add document
                                startIcon={<UploadIcon />}
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default Document;
