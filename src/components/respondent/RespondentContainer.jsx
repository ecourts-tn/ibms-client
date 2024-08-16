import React from 'react'
import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Badge from 'react-bootstrap/Badge'
import RespondentForm from './RespondentForm'
import RespondentList from './RespondentList'
import {toast, ToastContainer} from 'react-toastify'
import api from '../../api'

const RespondentContainer = () => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const[respondents, setRespondents] = useState([])
    useEffect(() => {
        const fetchLitigants =  async() => {
            try{
                const efile_no = localStorage.getItem("efile_no")
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
        fetchLitigants();
    },[])

    const addRespondent = async(litigant) => {
        const efile_no = localStorage.getItem("efile_no")
        try{
            const response = await api.post(`litigant/create/`, litigant, {
                params: {
                efile_no
                }
            })
            if(response.status === 201){
                setRespondents(respondents => [...respondents, litigant])
                toast.success(`Respondent ${response.data.litigant_id} added successfully`, {
                theme:"colored"
                })
            }
        }catch(error){
            console.error(error)
        }
    }

    const deleteRespondent =async (respondent) => {
        try{
            const newRespondents = respondents.filter((p) => {
                return p.litigant_id !== respondent.litigant_id
            })
            setRespondents(newRespondents)
            toast.error(`Respondent ${respondent.litigant_id} deleted successfuly`, {
                theme: "colored"
            })

        }catch(error){
            console.error(error)
        }
    }
    
    return (
        <div className='container'>
        <div className="card card-outline card-info">
            <div className="card-header">
                <div className="d-flex justify-content-between">
                    <h3 className="card-title"><i className="fas fa-users mr-2"></i><strong>Respondent Details</strong></h3>
                    { respondents.length > 0 && (
                        <Button variant="warning" onClick={handleShow}>
                            <i className="fas fa-users mr-2"></i>
                                Respondents 
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
                        <Modal.Title><strong>Respondents</strong></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <RespondentList 
                            respondents={respondents}
                            deleteRespondent={deleteRespondent}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                        Close
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