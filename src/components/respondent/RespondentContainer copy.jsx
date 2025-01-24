import React from 'react'
import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Badge from 'react-bootstrap/Badge'
import RespondentForm from './RespondentForm'
import RespondentList from './RespondentList'
import {toast, ToastContainer} from 'react-toastify'
import api from '../../api'
import { useTranslation } from 'react-i18next'

const RespondentContainer = () => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const[respondents, setRespondents] = useState([])
    const[selectedRespondent, setSelectedRespondent] = useState(null)
    const[cirme, setCrime] = useState({})
    const {t} = useTranslation()
    const efile_no = sessionStorage.getItem("efile_no")
    useEffect(() => {
        const fetchLitigants =  async() => {
            try{
                const response = await api.get(`litigant/list/`, {params:{efile_no}})
                if(response.status === 200){
                    const filtered_data = response.data.filter((respondent)=> {
                        return respondent.litigant_type === 2
                    })
                    setRespondents(filtered_data)
                }
            }catch(error){
                console.error(error)
            }
        }
        if(efile_no){
            fetchLitigants();
        }
    },[])

    const addRespondent = async(litigant) => {
        litigant.efile_no = sessionStorage.getItem("efile_no")
        try{
            const response = await api.post(`litigant/create/`, litigant)
            if(response.status === 201){
                setRespondents(respondents => [...respondents, litigant])
                toast.success(t('alerts.respondent_added').replace('{respondent}', response.data.litigant_id), {
                theme:"colored"
                })
            }
        }catch(error){
            console.error(error)
        }
    }

    const editRespondent = async(id) => {
        try{
            const response = await api.get(`litigant/${id}/read/`)
            setSelectedRespondent(response.data)
            handleClose()
        }catch(error){
            console.log(error)
        }

    }

    const deleteRespondent =async (respondent) => {
        const newRespondents = respondents.filter((p) => {
            return p.litigant_id !== respondent.litigant_id
        })
        try{
            if(window.confirm("Are you sure want to delete the litigant")){
                const response = await api.delete(`litigant/${respondent.litigant_id}/delete/`)
                setRespondents(newRespondents)
                toast.error(t('alerts.respondent_deleted').replace('{respondent}', respondent.litigant_id), {
                    theme: "colored"
                })
                handleClose()
            }
        }catch(error){
            console.log(error)
        }
    }
     
    return (
        <div className='container'>
        <div className="card card-outline card-info">
            <div className="card-header">
                <div className="d-flex justify-content-between">
                    <h3 className="card-title"><i className="fas fa-users mr-2"></i><strong>{t('respondent_details')}</strong></h3>
                    { respondents.length > 0 && (
                        <Button variant="warning" onClick={handleShow}>
                            <i className="fas fa-users mr-2"></i>
                                {t('respondents')}
                                <Badge bg="success" className="ml-2">{ respondents.length }</Badge>
                        </Button>
                    )}
                </div>
            </div>
            <Modal 
                    show={show} 
                    onHide={handleClose} 
                    backdrop="static"
                    keyboard={false}
                    size="xl"
                >
                    <Modal.Header closeButton>
                        <Modal.Title><strong>{t('respondents')}</strong></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <RespondentList 
                            respondents={respondents}
                            deleteRespondent={deleteRespondent}
                            editRespondent={editRespondent}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                        {t('close')}
                        </Button>
                    </Modal.Footer>
                </Modal>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-12">
                    </div>   
                    <div className="col-md-12"> 
                        <RespondentForm 
                            addRespondent={addRespondent}
                            selectedRespondent={selectedRespondent}
                        />
                    </div>
                </div>
            </div>
            {/* <div className="card-footer">
                <Button
                    className="float-right"
                ><i className="fa fa-plus mr-2"></i>Add Respondent</Button>
            </div> */}
        </div>
    </div>
  )
}

export default RespondentContainer