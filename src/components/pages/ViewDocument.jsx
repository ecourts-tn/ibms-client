import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from '@mui/material/Button';

const ViewDocument = ({ url, title, show, handleClose }) => {
    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            size="xl"
        >
            <Modal.Header closeButton>
                <Modal.Title><strong>{title}</strong></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <embed 
                    src={url}
                    style={{ width: "100%", height: "600px" }}
                />
            </Modal.Body>
            <Modal.Footer style={{ justifyContent: "end" }}>
                <Button variant="contained" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ViewDocument;
