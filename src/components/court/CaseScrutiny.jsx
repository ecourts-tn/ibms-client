import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import api from '../../api'
import './style.css'

const CaseScrutiny = () => {

    const {state} = useLocation();
    const navigate = useNavigate()

    const[petition, setPetition]        = useState({
        court_type: '',
        case_type: '',
        bail_type: '',
        complaint_type: ''
    })
    const[petitioner, setPetitioner]    = useState([])
    const[respondent, setRespondent]    = useState([])
    const[grounds, setGrounds] = useState([])
    const[advocates, setAdvocates] = useState([])
    const[verify, setVerify] = useState('')

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get(`api/bail/petition/detail/`, {params: {cino:state.cino}})
                const { petition, petitioner, grounds, respondent,advocate} = response.data
                setPetition(petition)
                setPetitioner(petitioner)
                setRespondent(respondent)
                setAdvocates(advocate)
                setGrounds(grounds)
            }catch(err){
                console.log(err)
            }
        }
        fetchData();
    }, [state.cino])


    useEffect(() => {
        if(!state){
            navigate("/not-found")
        }
    })


    const doNothing = () => {}


    if(!state){
        return (
            <div className="content-wrapper">
                <div className="container-fluid pt-5">
                    <div className="alert alert-danger">
                        Details not found
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="content-wrapper">
                <div className="container-fluid">
                    <div className="card card-outline card-primary">
                        <div className="card-header">
                            <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Petition Details</strong></h3>
                        </div>
                        <div className="card-body">
                            <div id="accordion">
                                <div className="card m-1">
                                    <div className="card-header" id="headingOne">
                                        <a data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" href="/#">Basic Details</a>
                                    </div>
                                    <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <Form.Group className="row mb-2">
                                                        <Form.Label className="col-sm-3">Court Type</Form.Label>
                                                        <div className="col-sm-9">
                                                            <Form.Control
                                                                value={petition.court_type.name}
                                                                readOnly={true}
                                                            ></Form.Control>
                                                        </div>
                                                    </Form.Group>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    { petition.court_type.code === 1 && (
                                                    <div className="form-group row">
                                                        <label htmlFor="bench_type" className="col-sm-3">High Court Bench</label>
                                                        <div className="col-sm-9">
                                                            <Form.Control
                                                                value={petition.bench_type.name}
                                                                readOnly={true}
                                                            ></Form.Control>
                                                        </div>
                                                    </div>
                                                    )}
                                                </div>
                                            </div>  
                                            { petition.court_type.code === 2 && (
                                            <div className="row mb-0">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="state">State</label>
                                                            <Form.Control
                                                                value={petition.state.state_name}
                                                                readOnly={true}
                                                            ></Form.Control>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="district">District</label>
                                                            <Form.Control
                                                                value={petition.district.district_name}
                                                                readOnly={true}
                                                            ></Form.Control>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="establishment">Establishment Name</label>
                                                            <Form.Control
                                                                value={petition.establishment.establishment_name}
                                                                readOnly={true}
                                                            ></Form.Control>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="court">Court Name</label>
                                                            <Form.Control
                                                                value={petition.court.court_name}
                                                                readOnly={true}
                                                            ></Form.Control>
                                                    </div>
                                                </div>
                                            </div>
                                            )}
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="caseType">Case Type</label>
                                                            <Form.Control
                                                                value={petition.case_type.name}
                                                                readOnly={true}
                                                            ></Form.Control>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="bailType">Bail Type</label>
                                                            <Form.Control
                                                                value={petition.bail_type.name}
                                                                readOnly={true}
                                                            ></Form.Control>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <Form.Group>
                                                        <Form.Label>Compliant Type</Form.Label>
                                                            <Form.Control
                                                                value={petition.complaint_type.name}
                                                                readOnly={true}
                                                            ></Form.Control>
                                                    </Form.Group>
                                                </div>
                                                <div className="col-sm-12">
                                                    <div className="form-group clearfix">
                                                    <label htmlFor="" className="mr-2">Crime Registered?</label>
                                                    <div className="icheck-success d-inline mx-2">
                                                        <input type="radio" id="radioPrimary1" name="crime_registered" checked={petition.crime_registered === 1 ? true : false} onChange={doNothing}/>
                                                        <label htmlFor="radioPrimary1">Yes</label>
                                                    </div>
                                                    <div className="icheck-danger d-inline mx-2">
                                                        <input type="radio" id="radioPrimary2" name="crime_registered" checked={petition.crime_registered === 2 ? true : false} onChange={doNothing}/>
                                                        <label htmlFor="radioPrimary2">No</label>
                                                    </div>
                                                    <div className="icheck-primary d-inline mx-2">
                                                        <input type="radio" id="radioPrimary3" name="crime_registered" checked={petition.crime_registered === 3 ? true : false} onChange={doNothing}/>
                                                        <label htmlFor="radioPrimary3">Not Known</label>
                                                    </div>
                                                    </div>
                                                </div>
                                                { petition.crime_state && (
                                                <div className="col-md-2">
                                                    <div className="form-group">
                                                        <label htmlFor="crime_state">Crime State</label>
                                                        <input type="text" readOnly={true} className="form-control" value={petition.crime_state.state_name}/>
                                                    </div>
                                                </div>
                                                )}
                                                { petition.crime_district && (
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="crime_district">Crime District</label><br />
                                                        <input type="text" className="form-control" readOnly={true} value={petition.crime_district.district_name} /> 
                                                    </div>
                                                </div>
                                                )}
                                                { petition.police_station && (
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="police_station">Police Station Name</label><br />
                                                        <input type="text" className="form-control" readOnly={true} value={petition.police_station.station_name} />
                                                    </div>
                                                </div>
                                                )}
                                                <div className="col-md-2">
                                                    <div className="form-group">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Crime Number</Form.Label>
                                                        <Form.Control 
                                                            type="text"
                                                            name="crime_number"
                                                            value={petition.crime_number}
                                                            readOnly={true}
                                                        ></Form.Control>
                                                    </Form.Group>
                                                    </div>
                                                </div>
                                                <div className="col-md-1">
                                                    <Form.Group>
                                                        <Form.Label>Year</Form.Label>
                                                        <Form.Control 
                                                            type="text"
                                                            name="crime_year"
                                                            value={petition.crime_year}
                                                            readOnly={true}
                                                        ></Form.Control>
                                                    </Form.Group>   
                                                </div>  
                                                <div className="col-md-2">
                                                    <Form.Group className="mb-3">
                                                    <Form.Label>Date of Occurrence</Form.Label>
                                                    <Form.Control 
                                                        type="date"
                                                        name="dateOfOccurence"
                                                        readOnly={ petition.date_of_occurrence ? `readOnly` : ''}
                                                        value={ petition.date_of_occurrence }
                                                    ></Form.Control>
                                                    </Form.Group>
                                                </div>
                                                <div className="col-md-2">
                                                    <Form.Group className="mb-3">
                                                    <Form.Label>petition Date & Time</Form.Label>
                                                    <Form.Control 
                                                        type="date" 
                                                        name="petitionDateTime"
                                                        readOnly={ petition.fir_date_time ? `readOnly` : '' }
                                                        value={ petition.fir_date_time }
                                                    ></Form.Control>
                                                    </Form.Group>
                                                </div>
                                                <div className="col-md-8">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Place of Occurrence</Form.Label>
                                                        <Form.Control 
                                                            name="placeOfOccurence"
                                                            readOnly={ petition.place_of_occurrence ? "readOnly" : ''}
                                                            value={ petition.place_of_occurrence }
                                                        ></Form.Control>
                                                    </Form.Group>
                                                </div>
                                                <div className="col-md-4">
                                                    <Form.Group>
                                                        <Form.Label>Investigation Officer</Form.Label>
                                                        <Form.Control 
                                                            name="investigationOfficer"
                                                            readOnly={ petition.investigation_officer ? 'readOnly' : ''}
                                                            value={ petition.investigation_officer }
                                                        ></Form.Control>
                                                    </Form.Group>
                                                </div>
                                                <div className="col-md-4">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Complaintant Name</Form.Label>
                                                        <Form.Control 
                                                            name="compliantantName"
                                                            readOnly={ petition.complaintant_name ? 'readOnly' : ''}
                                                            value={ petition.complaintant_name }></Form.Control>
                                                    </Form.Group>
                                                </div>
                                                <div className="col-md-6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Gist of FIR / Allegations</Form.Label>
                                                        <Form.Control 
                                                            as="textarea" 
                                                            rows="5" 
                                                            readOnly={ petition.gist_of_fir ? 'readOnly' : ''}
                                                            value={ petition.gist_of_fir }
                                                        ></Form.Control>
                                                    </Form.Group>
                                                </div>
                                                <div className="col-md-6">
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Gist of FIR / Allegations (In Local Language)</Form.Label>
                                                        <Form.Control 
                                                            as="textarea" 
                                                            rows="5"
                                                            readOnly={ petition.gist_in_local ? 'readOnly' : ''}
                                                            value={ petition.gist_in_local }
                                                        ></Form.Control>
                                                    </Form.Group>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card m-1">
                                    <div className="card-header" id="headingTwo">
                                        <a data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo" href="/#">
                                            Litigant Details
                                        </a>
                                    </div>
                                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                                        <div className="card-body p-2">
                                            <div className="card">
                                                <div className="card-header bg-secondary">
                                                    <strong>Petitioner Details</strong>
                                                </div>
                                                <div className="card-body p-2">
                                                    { petitioner.map((p, index) => (
                                                    <table className="table table-sm table-bordered table-striped mb-2" key={index}>
                                                        <tbody>
                                                            <tr>
                                                                <td colSpan="8"><strong>Petitioner { index+1 }</strong></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Petitioner Name</td>
                                                                <td>{ p.petitioner_name }</td>
                                                                <td>Age</td>
                                                                <td>{ p.age }</td>
                                                                <td>Gender</td>
                                                                <td>{ p.gender }</td>
                                                                <td>Rank</td>
                                                                <td>{ p.rank }</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Relation</td>
                                                                <td>{p.relation}</td>
                                                                <td>Relation Name</td>
                                                                <td>{p.relation_name}</td>
                                                                <td>Mobile Number</td>
                                                                <td>{p.mobile_number}</td>
                                                                <td>Email Address</td>
                                                                <td>{p.email_address}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Address</td>
                                                                <td colSpan="7">{p.address}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-header bg-secondary">
                                                    <strong>Respondent Details</strong>
                                                </div>
                                                <div className="card-body p-2">
                                                    { respondent.map((res, index) => (
                                                    <table className="table table-sm table-bordered table-striped mb-2" key={index}>
                                                        <tbody>
                                                            <tr>
                                                                <td colSpan="8"><strong>Respondent { index+1 }</strong></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Respondent Name</td>
                                                                <td>{ res.respondent_name }</td>
                                                                <td>Designation</td>
                                                                <td>{ res.designation }</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Address</td>
                                                                <td>{ res.address }</td>
                                                                <td>District</td>
                                                                <td>{ res.district }</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card m-1">
                                    <div className="card-header" id="headingThree">
                                        <a data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree" href="/#">
                                            Grounds & Previous Case Details
                                        </a>
                                    </div>
                                    <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                                        <div className="card-body p-2">
                                            { grounds.map((ground, index) => (
                                            <div className="card" key={index}>
                                                <div className="card-body mt-0">
                                                    { ground.description}
                                                </div>
                                            </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="card m-1">
                                    <div className="card-header" id="headingFour">
                                        <a data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour" href="/#">
                                            Advocate Details & Documents
                                        </a>
                                    </div>
                                    <div id="collapseFour" className="collapse" aria-labelledby="headingFour" data-parent="#accordion">
                                        <div className="card-body">
                                            { Object.keys(advocates).length > 0 && (
                                            <table className="table table-striped table-bordered table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>Advocate Name</th>
                                                        <th>Enrolment Number</th>
                                                        <th>Mobile Number</th>
                                                        <th>Email Address</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row my-3">
                                <div className="col-md-6 offset-3">
                                    <div className="form-group row">
                                        <label htmlFor="date" className="col-sm-3">Verification Date</label>
                                        <div className="col-sm-3">
                                            <input type="date" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="form-group row mt-4">
                                        <label htmlFor="verify" className="col-sm-3">Verify</label>
                                        <div className="col-sm-9">
                                            <div className="icheck-success d-inline mx-2">
                                                <input type="radio" id="radioVerify1" name="verify" onChange={(e) => setVerify(1)}/>
                                                <label htmlFor="radioVerify1">Accept</label>
                                            </div>
                                            <div className="icheck-danger d-inline mx-2">
                                                <input type="radio" id="radioVerify2" name="verify" onChange={(e) => setVerify(2)}/>
                                                <label htmlFor="radioVerify2">Return</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                { verify === 2 && (
                                <>
                                    <div className="col-md-6 offset-3">
                                        <div className="form-group row">
                                            <label htmlFor="date" className="col-sm-3">Complaince Date</label>
                                            <div className="col-sm-3">
                                                <input type="date" className="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 offset-3">
                                        <div className="form-group">
                                            <label htmlFor="remarks">Remarks</label>
                                            <textarea name="remarks" id="remarks" className="form-control" rows="2"></textarea>
                                        </div>
                                    </div>
                                </>
                                )}
                                { verify !== '' && verify === 1 && (
                                <div className="col-md-12 d-flex justify-content-center">
                                    <button className="btn btn-success px-3">Submit</button>
                                </div>
                                )}
                                { verify !== '' && verify === 2 && (
                                <div className="col-md-12 d-flex justify-content-center">
                                    <button className="btn btn-danger px-3">Return</button>
                                </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
  )
}

export default CaseScrutiny
