import React, { useState, useEffect} from 'react'
import Modal from 'react-bootstrap/Modal'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import PetitionerForm from './PetitionerForm'
import PetitionerList from './PetitionerList'
import {toast} from 'react-toastify'
import api from '../../api'
import { useTranslation } from 'react-i18next'
import { LocalConvenienceStoreOutlined } from '@mui/icons-material'

const PetitionerContainer = () => {

    const [show, setShow] = useState(false);
    const[petitioners, setPetitioners] = useState([])
    const[selectedPetitioner, setSelectedPetitioner] = useState(null)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const {t} = useTranslation()
    const efile_no = sessionStorage.getItem("efile_no")
    
    useEffect(() => {
        const fetchPetitioners = async() => {
            try{
                if(!efile_no){
                    return;
                }
                const response = await api.get("litigant/list/", {params:{efile_no}})
                if(response.status === 200){
                    const filtered_data = response.data.filter((petitioner)=> {
                        return petitioner.litigant_type === 1
                    })
                    setPetitioners(filtered_data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchPetitioners()
    },[])

    const addPetitioner = async(litigant) => {
        if(efile_no){
            try{
                litigant.efile_no = efile_no;
                const response = await api.post(`litigant/create/`, litigant, {
                    headers:{
                        'Content-Type': 'multipart/form-data',
                    }
                })
                if(response.status === 201){
                    setPetitioners(petitioners => [...petitioners, litigant])
                    toast.success(t('alerts.petitioner_added').replace('{petitioner}', response.data.litigant_id), {
                    theme:"colored"
                    })
                }
            }catch(error){
                console.error(error)
            }
        }
    }

    const editPetitioner = async(id) => {
        try{
            const response = await api.get(`litigant/${id}/read/`)
            setSelectedPetitioner(response.data)
            handleClose()
        }catch(error){
            console.log(error)
        }

    }

    const deletePetitioner =async(petitioner) => {
        const newPetitioners = petitioners.filter((p) => {
            return p.litigant_id !== petitioner.litigant_id
        })
        try{
            if(window.confirm("Are you sure want to delete the litigant")){
                const response = await api.delete(`litigant/${petitioner.litigant_id}/delete/`)
                // if(response.status === 204){
                    setPetitioners(newPetitioners)
                    toast.error(t('alerts.petitioner_deleted').replace('{petitioner}', petitioner.litigant_id), {
                        theme: "colored"
                    }) 
                    handleClose(); 
                // }
            }
        }catch(error){
            console.log(error)
        }
    }
     
    return (
        <div className="container mt-4">
            <div className="card card-outline card-danger">
                <div className="card-header">
                    <div className="d-flex justify-content-between">
                        <h3 className="card-title"><i className="fas fa-users mr-2"></i><strong>{t('petitioner_details')}</strong></h3>
                        { petitioners.length > 0 && (
                            <Button variant="warning" onClick={handleShow}>
                                <i className="fas fa-users mr-2"></i>{t('petitioners')} <Badge bg="success" className="ml-2">{ petitioners.length }</Badge>
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
                            <Modal.Title><strong>{t('petitioners')}</strong></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <PetitionerList petitioners={petitioners} deletePetitioner={deletePetitioner} editPetitioner={editPetitioner}/>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                            {t('close')}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                <div className="card-body">
                    <PetitionerForm addPetitioner={addPetitioner} petitioners={petitioners} selectedPetitioner={selectedPetitioner}/>
                </div>
            </div>
        </div>
    )
}

export default PetitionerContainer