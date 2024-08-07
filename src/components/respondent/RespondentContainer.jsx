import React from 'react'
import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Badge from 'react-bootstrap/Badge'
import RespondentForm from './RespondentForm'
import RespondentList from './RespondentList'
import api from '../../api'

const RespondentContainer = ({addRespondent, deleteRespondent}) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const[respondents, setRespondents] = useState([])
    useEffect(() => {
        const fetchLitigants =  async() => {
            try{
                const efile_no = localStorage.getItem("efile_no")
                const response = await api.get(`api/litigant/list/`, {params:{efile_no}})
                if(response.status === 200){
                    setRespondents(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
    })
    
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