import React from 'react'
import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import PetitionerForm from './PetitionerForm'
import PetitionerList from './PetitionerList'

const PetitionerContainer = (props) => {

    const {
            petitioners, 
            addPetitioner, 
            deletePetitioner
        } = props

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
     
    return (
        <>
            <div className="card card-outline card-danger">
                <div className="card-header">
                    <div className="d-flex justify-content-between">
                        <h3 className="card-title"><i className="fas fa-users mr-2"></i><strong>Petitioner Details</strong></h3>
                        { petitioners.length > 0 && (
                            <Button variant="warning" onClick={handleShow}>
                                <i className="fas fa-users mr-2"></i>Petitioners <Badge bg="success" className="ml-2">{ petitioners.length }</Badge>
                            </Button>
                        )}
                    </div>
                    <Modal 
                        show={show} 
                        onHide={handleClose} 
                        backdrop="static"
                        keyboard={false}
                        size="xl"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title><strong>Petitioners</strong></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <PetitionerList petitioners={petitioners} deletePetitioner={deletePetitioner}/>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                            Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                <div className="card-body">
                    <PetitionerForm addPetitioner={addPetitioner} petitioners={petitioners}/>
                </div>
            </div>
        </>
    )
}

export default PetitionerContainer