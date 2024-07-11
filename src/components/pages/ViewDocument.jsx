import React, {useState} from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from '@mui/material/Button'

const ViewDocument = ({url, show, setShow, handleClose, handleShow}) => {

    return (
        <Modal 
            show={show} 
            onHide={handleClose} 
            backdrop="static"
            keyboard={false}
            size="xl"
        >
            <Modal.Header closeButton>
                <Modal.Title><strong>Document</strong></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <embed 
                    src={url}
                    frameborder="0" 
                    style={{ width:"100%", height:"600px"}}
                />
            </Modal.Body>
            <Modal.Footer style={{ justifyContent: "end"}}>
                <div>
                    <Button variant="contained" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default ViewDocument