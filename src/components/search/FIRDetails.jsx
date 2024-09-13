import React, {useState, useContext} from 'react'
import {CreateMarkup} from '../../utils'
import Modal from 'react-bootstrap/Modal'
import Button from '@mui/material/Button'
import { BaseContext } from '../../contexts/BaseContext'


const FIRDetails = () => {
    const {fir, accused} = useContext(BaseContext)
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
                                <div className="row">
                                    <div className="col-md-12">
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
                                                <td colSpan={4} width="500">
                                                    <p><strong>Gist of FIR / Allegations (In Local Language)</strong></p>
                                                    <span dangerouslySetInnerHTML={CreateMarkup(fir.gist_in_local)}></span>
                                                </td>
                                            </tr>
                                        </table>
                                        {accused && (
                                            <table className="table table-bordered table-striped table-sm">
                                                <thead>
                                                    <tr className="bg-navy">
                                                        <th>#</th>
                                                        <th>Accused Name</th>
                                                        <th>Age</th>
                                                        <th>Rank</th>
                                                        <th>Gender</th>
                                                        <th>Guardian Name</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {accused.map((a, index) => (
                                                    <tr>
                                                        <td>{ index+1 }</td>
                                                        <td>{a.name_of_accused}</td>
                                                        <td>{a.age}</td>
                                                        <td>{a.Rank_of_accused}</td>
                                                        <td>{a.gender}</td>
                                                        <td>{a.accused_guardian_name}</td>
                                                    </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer style={{ justifyContent: "end", alignItems:"center"}}>
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