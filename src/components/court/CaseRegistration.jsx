import React from 'react'
import api from '../../api'
import { useState, useEffect } from 'react'
import BasicContainer from '../basic/BasicContainer'
import PetitionerForm from '../petitioner/PetitionerForm'
import Button from '@mui/material/Button';

const CaseRegistration = () => {

    const[petition, setPetition] = useState({})
    const[petitioners, setPetitioners] = useState([])
    const[respondents, setRespondents] = useState([])
    const[grounds, setGrounds] = useState([])

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get(`api/bail/petition/TN20240607000001/detail/`)
                const { petition, petitioner, grounds} = response.data
                setPetition(petition)
                setPetitioners(petitioner)
                setGrounds(grounds)
            }catch(err){
                console.log(err)
            }
        }
        fetchData();
    }, [])

    return (
        <>
            <div className="content-wrapper">
                <div className="container-fluid">
                    <div className="card card-outline card-primary">
                        <div className="card-header">
                            <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Registration</strong></h3>
                        </div>
                        <div className="card-body">
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label htmlFor="filing_number" className="col-sm-3">Filing Number</label>
                                        <div className="col-sm-5">
                                            <select name="filing_number" id="filing_number" className="form-control">
                                                <option value="">Select Filing Number</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                    <li className="nav-item">
                                        <a className="nav-link active" id="basic-tab" data-toggle="tab" href="#basic" role="tab" aria-controls="basic" aria-selected="true">Basic Details</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="petitioner-tab" data-toggle="tab" href="#petitioner" role="tab" aria-controls="petitioner" aria-selected="false">Petitioner</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="respondent-tab" data-toggle="tab" href="#respondent" role="tab" aria-controls="respondent" aria-selected="false">Respondent</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="grounds-tab" data-toggle="tab" href="#grounds" role="tab" aria-controls="grounds" aria-selected="false">Grounds</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="previous-tab" data-toggle="tab" href="#previous" role="tab" aria-controls="previous" aria-selected="false">Previous Details</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="advocate-tab" data-toggle="tab" href="#advocate" role="tab" aria-controls="advocate" aria-selected="false">Advocate Details</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="documents-tab" data-toggle="tab" href="#documents" role="tab" aria-controls="documents" aria-selected="false">Documents</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="registration-tab" data-toggle="tab" href="#registration" role="tab" aria-controls="registration" aria-selected="false">Registration</a>
                                    </li>
                                </ul>
                                <div className="tab-content" id="myTabContent">
                                    <div className="tab-pane fade show active mt-3" id="basic" role="tabpanel" aria-labelledby="basic-tab">
                                        <BasicContainer petition={petition} setPetition={setPetition}/>
                                    </div>
                                    <div className="tab-pane fade" id="petitioner" role="tabpanel" aria-labelledby="petitioner-tab">
                                        <PetitionerForm petitioners={petitioners}/>
                                    </div>
                                    <div className="tab-pane fade" id="respondent" role="tabpanel" aria-labelledby="respondent-tab">

                                    </div>
                                    <div className="tab-pane fade" id="grounds" role="tabpanel" aria-labelledby="grounds-tab">

                                    </div>
                                    <div className="tab-pane fade" id="previous" role="tabpanel" aria-labelledby="previous-tab">

                                    </div>
                                    <div className="tab-pane fade" id="advocate" role="tabpanel" aria-labelledby="advocate-tab">

                                    </div>
                                    <div className="tab-pane fade" id="documnets" role="tabpanel" aria-labelledby="documnets-tab">

                                    </div>
                                    <div className="tab-pane fade" id="registration" role="tabpanel" aria-labelledby="registration-tab">
                                        <div className="row mt-3">
                                            <div className="col-md-6 offset-3">
                                                <div className="form-group row">
                                                    <label htmlFor="date_of_registration" className="col-sm-3">Date of Registration</label>
                                                    <div className="col-sm-3">
                                                        <input type="date" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor="first_hearing" className="col-sm-3">Date of Hearing</label>
                                                    <div className="col-sm-3">
                                                        <input type="date" className="form-control" />
                                                    </div>
                                                </div>
                                                <Button variant="contained" color="success">Contained</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
  )
}

export default CaseRegistration








