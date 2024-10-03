import React, { useState, useEffect, useContext } from 'react'
import Modal from 'react-bootstrap/Modal'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import PetitionerForm from './PetitionerForm'
import PetitionerList from './PetitionerList'
import {toast, ToastContainer} from 'react-toastify'
import api from '../../api'

const PetitionerContainer = () => {

    const [show, setShow] = useState(false);
    const[petitioners, setPetitioners] = useState([])
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const efile_no = sessionStorage.getItem("efile_no")
    useEffect(() => {
        const fetchPetitioners = async() => {
            if(efile_no){
                const response = await api.get("litigant/list/", {params:{efile_no}})
                if(response.status === 200){
                    const filtered_data = response.data.filter((petitioner)=> {
                        return petitioner.litigant_type === 1
                    })
                    setPetitioners(filtered_data)
                }
            }
        }
        fetchPetitioners()
    },[])

    const addPetitioner = async(litigant) => {
        if(efile_no){
            try{
                const response = await api.post(`litigant/create/`, litigant, {
                    params: {
                    efile_no
                    }
                })
                if(response.status === 201){
                    setPetitioners(petitioners => [...petitioners, litigant])
                    toast.success(`Petitioner ${response.data.litigant_id} added successfully`, {
                    theme:"colored"
                    })
                }
            }catch(error){
                console.error(error)
            }
        }
    }

    const deletePetitioner =async (petitioner) => {
        try{
            const newPetitioners = petitioners.filter((p) => {
                return p.litigant_id !== petitioner.litigant_id
            })
            setPetitioners(newPetitioners)
            toast.error(`Petitioner ${petitioner.litigant_id} deleted successfuly`, {
                theme: "colored"
            })

        }catch(error){
            console.error(error)
        }
    }
     
    return (
        <div className="container mt-4">
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
        </div>
    )
}

export default PetitionerContainer