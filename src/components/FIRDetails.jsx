import React, {useState} from 'react'
import {CreateMarkup} from '../utils'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from '@mui/material/Button'

const FIRDetails = ({fir}) => {

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
                            <Modal.Footer style={{ justifyContent: "end", alignItems:"center"}}>
                                <Button variant="contained" onClick={handleClose}>
                                    Close
                                </Button>
                            </Modal.Footer>
                    </Modal>
                </div>
                {/* <div className="col-md-2">
                    <Form.Group className="mb-3">
                    <Form.Label>Date of Occurrence</Form.Label>
                    <Form.Control 
                        type="date"
                        name="dateOfOccurence"
                        readOnly={ fir.date_of_occurrence ? `readOnly` : ''}
                        value={ fir.date_of_occurrence }
                    ></Form.Control>
                    </Form.Group>
                </div>
                <div className="col-md-2">
                    <Form.Group className="mb-3">
                    <Form.Label>FIR Date & Time</Form.Label>
                    <Form.Control 
                        type="date" 
                        name="firDateTime"
                        readOnly={ fir.fir_date_time ? `readOnly` : '' }
                        value={ fir.fir_date_time }
                    ></Form.Control>
                    </Form.Group>
                </div>
                <div className="col-md-8">
                    <Form.Group className="mb-3">
                        <Form.Label>Place of Occurrence</Form.Label>
                        <Form.Control 
                            name="placeOfOccurence"
                            readOnly={ fir.place_of_occurrence ? "readOnly" : ''}
                            value={ fir.place_of_occurrence }
                        ></Form.Control>
                    </Form.Group>
                </div>
                <div className="col-md-4">
                    <Form.Group>
                        <Form.Label>Investigation Officer</Form.Label>
                        <Form.Control 
                            name="investigationOfficer"
                            readOnly={ fir.investigation_officer ? 'readOnly' : ''}
                            value={ fir.investigation_officer }
                        ></Form.Control>
                    </Form.Group>
                </div>
                <div className="col-md-4">
                    <Form.Group className="mb-3">
                        <Form.Label>Complaintant Name</Form.Label>
                        <Form.Control 
                            name="compliantantName"
                            readOnly={ fir.complainant_name ? 'readOnly' : ''}
                            value={ fir.complainant_name }></Form.Control>
                    </Form.Group>
                </div>
                <div className="col-md-6">
                    <Form.Group className="mb-3">
                        <Form.Label>Gist of FIR / Allegations</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows="5" 
                            readOnly={ fir.gist_of_fir ? 'readOnly' : ''}
                            value={ fir.gist_of_fir }
                        ></Form.Control>
                    </Form.Group>
                </div>
                <div className="col-md-6">
                    <Form.Group className="mb-3">
                        <Form.Label>Gist of FIR / Allegations (In Local Language)</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows="5"
                            readOnly={ fir.gist_in_local ? 'readOnly' : ''}
                            value={ fir.gist_in_local }
                        ></Form.Control>
                    </Form.Group>
                </div> */}
            </div>    
        </>
    )
}

export default FIRDetails