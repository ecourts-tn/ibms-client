import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import { ModelClose } from 'utils';

const ViewDocument = ({ url, title, show, handleClose, isDepartment }) => {
    const { t } = useTranslation();

    const [showRemarksModal, setShowRemarksModal] = useState(false);
    const [remarks, setRemarks] = useState('');

    const handleReturnClick = () => {
        setShowRemarksModal(true);
    };

    const handleRemarksClose = () => {
        setShowRemarksModal(false);
        setRemarks('');
    };

    const handleSubmitRemarks = async () => {
        try {
            // Send remarks to the backend (you can modify the endpoint and data format)
            const response = await fetch('/api/return-document', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ remarks }),
            });

            if (response.ok) {
                alert('Remarks submitted successfully');
                setShowRemarksModal(false);
                handleClose(); // Close the main modal too
            } else {
                alert('Failed to submit remarks');
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        }
    };

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size="xl"
            >
                <Modal.Header className='bg-info'>
                    <strong>{title}</strong>
                    <ModelClose handleClose={handleClose} />
                </Modal.Header>
                <Modal.Body>
                    <embed
                        src={url}
                        style={{ width: "100%", height: "600px" }}
                    />
                </Modal.Body>
                { isDepartment && (
                <Modal.Footer style={{ justifyContent: "end" }}>
                    <Button
                        variant="contained"
                        onClick={handleRemarksClose}
                        color="success"
                        className="mr-2"
                    >
                        Accept
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={handleReturnClick}
                    >
                        Return
                    </Button>
                </Modal.Footer>
                )}
            </Modal>

            { isDepartment && (
            <Modal
                show={showRemarksModal}
                onHide={handleRemarksClose}
                backdrop="static"
                keyboard={false}
                centered
                size="lg"
            >
                <Modal.Header className="bg-warning">
                    <strong>Remarks</strong>
                    <ModelClose handleClose={handleRemarksClose} />
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                {/* <label htmlFor="">Remarks</label> */}
                                <textarea 
                                    rows={5}
                                    name="remarks"
                                    value={remarks}
                                    className="form-control"
                                    onChange={(e) => setRemarks(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="contained" 
                        onClick={handleRemarksClose}
                        color="error"
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="contained" 
                        color="success" 
                        className='ml-1'
                        onClick={handleSubmitRemarks}
                    >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
            )}
            
        </>
    );
};

export default ViewDocument;
