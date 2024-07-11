import React from 'react'
import { useState } from 'react'
import Form from 'react-bootstrap/Form'

const FIRDetails = ({fir}) => {

    return (
        <>
            <div className="row mb-5">
                <div className="col-md-2">
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
                </div>
            </div>    
        </>
    )
}

export default FIRDetails