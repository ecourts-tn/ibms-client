import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import UploadIcon from '@mui/icons-material/UploadRounded';
import Button from '@mui/material/Button';
import config from 'config';
import * as Yup from 'yup';

const FILE_SIZE = 10 * 1024 * 1024; // 10MB
const SUPPORTED_FORMATS = ['application/pdf'];

const initialState = {
  title: '',
  document: ''
};

const Document = ({ documents, setDocuments, addDocument, deleteDocument }) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState(initialState);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewTitle, setPreviewTitle] = useState('');

  const validationSchema = Yup.object({
    title: Yup.string().required('Document title is required'),
    document: Yup.mixed()
      .required('Document is required')
      .test('fileSize', 'File size too large (max 10MB)', (value) => value && value.size <= FILE_SIZE)
      .test('fileType', 'Unsupported file format', (value) => value && SUPPORTED_FORMATS.includes(value.type))
  });

  const handleAddDocument = async () => {
    try {
      await validationSchema.validate(form, { abortEarly: false });
      addDocument(form);
      setForm(initialState);
      setErrors(initialState);
    //   toast.success("Document added successfully", { theme: "colored" });
    } catch (error) {
      const newErrors = {};
      if (error.inner) {
        error.inner.forEach(err => {
          newErrors[err.path] = err.message;
        });
      }
      setErrors(newErrors);
    }
  };

  const openPreview = (doc) => {
    const file = doc.document;
    const blobUrl = typeof file === 'string' ? `${config.apiUrl}${file}` : URL.createObjectURL(file);
    setPreviewUrl(blobUrl);
    setPreviewTitle(doc.title);
    const modal = new window.bootstrap.Modal(document.getElementById('pdfPreviewModal'));
    modal.show();
  };

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <>
      <ToastContainer />
        {documents.length > 0 && (
            <DocumentList
            documents={documents}
            deleteDocument={deleteDocument}
            openPreview={openPreview}
            />
        )}
        <form encType="multipart/form-data" onSubmit={(e) => e.preventDefault()}>
                <div className="row">
                    <div className="col-md-5">
                        <div className="form-group">
                            <label htmlFor="title">Document Title</label>
                            <input
                                type="text"
                                name="title"
                                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                value={form.title}
                                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                            />
                            <div className="invalid-feedback">{errors.title}</div>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className="form-group">
                            <label htmlFor="document">Document</label>
                            <input
                                type="file"
                                name="document"
                                accept="application/pdf"
                                className={`form-control ${errors.document ? 'is-invalid' : ''}`}
                                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.files[0] })}
                            />
                            <div className="invalid-feedback">{errors.document}</div>
                        </div>
                    </div>
                    <div className="col-md-2 mt-4 pt-2">
                        <Button
                            variant="contained"
                            color="info"
                            onClick={handleAddDocument}
                            startIcon={<UploadIcon />}
                        >
                            Add
                        </Button>
                    </div>
                </div>
        </form>     
        <div className="modal fade" id="pdfPreviewModal" tabIndex="-1" aria-labelledby="pdfPreviewModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{previewTitle}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {previewUrl ? (
                            <iframe
                            src={previewUrl}
                            title="PDF Preview"
                            width="100%"
                            height="600px"
                            style={{ border: 'none' }}
                            />
                        ) : (
                            <p className="text-muted">No PDF selected for preview.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};

export default Document;

const DocumentList = ({ documents, deleteDocument, openPreview }) => {
  return (
    <table className="table table-bordered table-striped table-sm mt-3">
        <thead className="bg-info text-white">
            <tr>
                <th>S.No</th>
                <th>Title</th>
                <th>Document</th>
                <th width="200">Actions</th>
            </tr>
        </thead>
        <tbody>
            {documents.map((doc, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{doc.title}</td>
                <td>{doc.document?.name || 'Uploaded file'}</td>
                <td>
                    <button
                        type="button"
                        className="btn btn-info btn-sm"
                        onClick={() => openPreview(doc)}
                    >Preview</button>
                    <button
                        className="btn btn-danger btn-sm ml-2"
                        onClick={() => deleteDocument(index)}
                    >Delete</button>
                </td>
            </tr>
            ))}
        </tbody>
    </table>
  );
};
