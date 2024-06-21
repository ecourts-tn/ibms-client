import React from 'react'
import { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom';
import FormControl from 'react-bootstrap/FormControl'
import FormGroup from 'react-bootstrap/FormGroup'
import FormLabel from 'react-bootstrap/FormLabel'
import Button from 'react-bootstrap/Button'
import api from '../../api'



const ResponseCreate = () => {
    
    const { state } = useLocation();
    const { petition } = state || {};
    const initialState = {
        crime_number        : null,
        crime_year          : null,
        gist_of_fir         : null,
        fir_date_time       : null,
        date_of_occurrence  : null
    }
    const[response, setResponse] = useState(initialState)

    useEffect(() => {
        setResponse({
            ...response,
            crime_number        : petition.crime_number,
            crime_year          : petition.crime_year,
            gist_of_fir         : petition.gist_in_local,
            fir_date_time       : petition.fir_date_time,
            date_of_occurrence  : petition.date_of_occurrence
        })
    },[])



    return (
    <>
        <div className="content-wrapper">
        <div className="container-fluid mt-3">
            <div className="card card-outline card-primary">
                <div className="card-header">
                    <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Police Response</strong></h3>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-2">
                            <FormGroup>
                                <FormLabel>Petition Number</FormLabel>
                                <FormControl></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-2">
                            <FormGroup>
                                <FormLabel>Crime Number</FormLabel>
                                <FormControl
                                    name="crime_number"
                                    value={ response.crime_number }
                                ></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-2">
                            <FormGroup>
                                <FormLabel>Year</FormLabel>
                                <FormControl
                                    name="crime_year"
                                    value={ response.crime_year }
                                ></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-2">
                            <FormGroup className='mb-3'>
                                <FormLabel>Date of FIR</FormLabel>
                                <FormControl
                                    name="fir_date_time"
                                    value={ response.fir_date_time }
                                ></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-3">
                            <FormGroup className='mb-3'>
                                <FormLabel>Name of the Police Station</FormLabel>
                                <FormControl></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-3">
                            <FormGroup className='mb-3'>
                                <FormLabel>Petitioner Name</FormLabel>
                                <FormControl></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-2">
                            <FormGroup className='mb-3'>
                                <FormLabel>Rank</FormLabel>
                                <FormControl></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-3">
                            <FormGroup className='mb-3'>
                                <FormLabel>Father's Name</FormLabel>
                                <FormControl></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-1">
                            <FormGroup className='mb-3'>
                                <FormLabel>Age</FormLabel>
                                <FormControl></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-6">
                            <FormGroup className='mb-3'>
                                <FormLabel>Address</FormLabel>
                                <FormControl as="textarea" rows={2}></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-6">
                            <FormGroup className='mb-3'>
                                <FormLabel>Offences</FormLabel>
                                <FormControl as="textarea" rows={2}></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-2">
                            <FormGroup className='mb-3'>
                                <FormLabel>Date of Occurence</FormLabel>
                                <FormControl 
                                    type="date"
                                    name="date_of_occurrence"
                                    value={ response.date_of_occurrence }
                                ></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-5">
                            <FormGroup className='mb-3'>
                                <FormLabel>Name of the Defacto Complainant</FormLabel>
                                <FormControl type="text"></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-5">
                            <FormGroup className='mb-3'>
                                <FormLabel>Name of the accused/suspected person(s)</FormLabel>
                                <FormControl type="text"></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-11">
                            <FormGroup className='mb-3'>
                                <FormLabel>Gist of Allegations in the Complaint</FormLabel>
                                <FormControl 
                                    as="textarea" 
                                    rows={4}
                                    name="gist_of_fir"
                                    value={ response.gist_of_fir }
                                    readonly = "readonly"
                                ></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-1 mt-5 pt-5">
                            <FormGroup className='mb-3'>
                                <Button>Modify</Button>
                            </FormGroup>
                        </div>
                        <div className="col-md-2">
                            <FormGroup className='mb-3'>
                                <FormLabel>Date of Arrest</FormLabel>
                                    <FormControl type="date"></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-1 mt-4 pt-2">
                            <FormGroup className='mb-3'>
                                <Button>Modify</Button>
                            </FormGroup>
                        </div>
                        <div className="col-md-4">
                            <FormGroup className='mb-3'>
                                <FormLabel>Specific Allegations /Overt Acts against the Petitioner(s)</FormLabel>
                                <FormControl as="textarea" rows={2}></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-4">
                            <FormGroup className='mb-3'>
                                <FormLabel>Materials & Circumstances against the Petitioner</FormLabel>
                                <FormControl as="textarea" rows={2}></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-12">
                            <FormGroup className='mb-3'>
                                <FormLabel>Particulars of Injury - Nature, Condition of Victim, whether in Hospital etc.</FormLabel>
                                <FormControl as="textarea" rows={4}></FormControl>
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <p><strong>Stage of Investigation / Trial</strong></p>
                        </div>
                        <div className="col-md-3">
                            <select className='form-control'>
                                <option value="">Select</option>
                                <option value="Pending Investigation">Pending Investigation</option>
                                <option value="Chargesheet filed">Chargesheet filed</option>
                            </select>
                        </div>
                    </div>
                    <div className="row mt-3">    
                        <div className="col-md-2">
                            <FormGroup className="mb-3">
                                <FormControl placeholder='CNR Number'></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-3">
                            <FormGroup className="mb-3">
                                <FormControl placeholder='Name of the Court'></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-2">
                            <FormGroup className="mb-3">
                                <FormControl placeholder='Stage of the Case'></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-2">
                            <FormGroup className="mb-3">
                                <FormControl placeholder='Next Hearing' as="date"></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-2">
                            <FormGroup className="mb-3">
                                <FormControl placeholder='Number of witness'></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-1">
                            <Button variant="success">Add</Button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <FormGroup className="mb-3">
                                <FormLabel>Antecedents/Previous Cases against the Petitioner(s)</FormLabel>
                                <FormControl></FormControl>
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <FormGroup className="mb-3">
                                <FormLabel>Details of Previous Bail Applications</FormLabel>
                                <FormControl as="textarea" rows={2}></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-6">
                            <FormGroup className="mb-3">
                                <FormLabel>Status of other accused</FormLabel>
                                <FormControl as="textarea" rows={2}></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-6">
                            <FormGroup className="mb-3">
                                <FormLabel>Why Bail/AB Should Not be Granted</FormLabel>
                                <FormControl as="textarea" rows={2}></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-6">
                            <FormGroup className="mb-3">
                                <FormLabel>Any other Information</FormLabel>
                                <FormControl as="textarea" rows={2}></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-12">
                            <FormGroup className="mb-3">
                                <FormLabel>Court Details: FIR/ Committal/Trial/ Appellate</FormLabel>
                                <FormControl as="textarea" rows={2}></FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-12">
                            <FormGroup>
                                <Button variant='success'>Submit</Button>
                            </FormGroup>
                        </div>
                    </div>
                </div>
            </div>
        </div>  
        </div>          
    </>
  )
}

export default ResponseCreate