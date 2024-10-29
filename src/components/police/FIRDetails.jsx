import React, {useState, useContext} from 'react'
import {CreateMarkup} from '../../utils'
import Modal from 'react-bootstrap/Modal'
import Button from '@mui/material/Button'
import { toast, ReactToastify } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import api from '../../api'

const FIRDetails = ({fir, efile_no, setFirTagged}) => {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const navigate =  useNavigate()

    const tagFir = async() => {
        const response = await api.post(`case/crime/details/create/`, fir, {params:{efile_no}})
        if(response.status === 201){
            handleClose();
            setFirTagged(true)
        }
    }

    return (
        <>
            <div className="row mb-5">
                <div className="col-md-12 d-flex justify-content-center">
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={handleShow}
                    >   
                        <i className="fa fa-paper-plane mr-2"></i>
                        View FIR Details
                    </Button>
                    <Modal 
                            show={show} 
                            onHide={handleClose} 
                            backdrop="static"
                            keyboard={false}
                            size="xl"
                        >
                            <Modal.Header>
                                <Modal.Title><strong>FIR Details</strong></Modal.Title>
                                <button 
                                    type="button" 
                                    class="close" 
                                    data-dismiss="modal"
                                    onClick={handleClose}
                                >&times;</button>
                            </Modal.Header>
                            <Modal.Body>
                                <table className="table table-bordered table-striped table-sm">
                                    <tr>
                                        <td>Date&nbsp;of&nbsp;Occurrence</td>
                                        <td>{ fir.date_of_occurrence }</td>
                                        <td>FIR Date & Time</td>
                                        <td>{ fir.fir_date_time }</td>
                                    </tr>
                                    <tr>
                                        <td>Place of Occurence</td>
                                        <td colSpan={3}>{ fir.place_of_occurrence }</td>
                                    </tr>
                                    <tr>
                                        <td>Investigation Officer</td>
                                        <td>{ fir.investigation_officer }</td>
                                        <td>Investigation Officer Rank</td>
                                        <td>{ fir.investigation_officer_rank }</td>
                                    </tr>
                                    <tr>
                                        <td>Complaintant&nbsp;Name</td>
                                        <td>{ fir.complainant_name }</td>
                                        <td>Complaintant&nbsp;Age</td>
                                        <td>{ fir.complainant_age }</td>
                                    </tr>
                                    <tr>
                                        <td>Complaintant&nbsp;Guardian</td>
                                        <td>{ fir.complainant_guardian }</td>
                                        <td>Complaintant&nbsp;Guardian Name</td>
                                        <td>{ fir.complainant_guardian_name }</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={4}>
                                            <p><strong>Gist of FIR / Allegations</strong></p>
                                            <span dangerouslySetInnerHTML={CreateMarkup(fir.gist_of_fir)}></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={4}>
                                            <p><strong>Gist of FIR / Allegations (In Local Language)</strong></p>
                                            <span dangerouslySetInnerHTML={CreateMarkup(fir.gist_in_local)}></span>
                                        </td>
                                    </tr>
                                </table>
                            </Modal.Body>
                            <Modal.Footer style={{ justifyContent: "space-between", alignItems:"center"}}>
                                <Button variant="contained" color="success" onClick={() => tagFir()}>Tag FIR </Button>
                                <Button variant="contained" onClick={handleClose}>
                                    Close
                                </Button>
                            </Modal.Footer>
                    </Modal>
                </div>
            </div>    
        </>
    )
}

export default FIRDetails