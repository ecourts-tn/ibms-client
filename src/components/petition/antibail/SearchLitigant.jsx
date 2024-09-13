import React, { useState, useEffect } from 'react'
import api from '../../../api'
import Form from 'react-bootstrap/Form'
import { useSelector, useDispatch } from 'react-redux'
import { getStates, getStatesStatus } from '../../../redux/features/StateSlice'
import { getDistrictByStateCode } from '../../../redux/features/DistrictSlice'
import { getPoliceSationByDistrict } from '../../../redux/features/PoliceStationSlice'
import { getBasicDetails, getFirStatus } from '../../../redux/features/FIRSeachSlice'
import { getCourtsByEstablishmentCode } from '../../../redux/features/CourtSlice';
import { getEstablishmentByDistrict } from '../../../redux/features/EstablishmentSlice'
import { getAccusedDetails } from '../../../redux/features/AccusedSlice'
import * as Yup from 'yup'
import {CreateMarkup} from '../../../utils'
import Modal from 'react-bootstrap/Modal'
import Button from '@mui/material/Button'
import Spinner from 'react-bootstrap/Spinner'
import { ToastContainer } from 'react-toastify'

const SearchLitigant = () => {


  const[petition, setPetition] = useState({})

  return (
    <>
      
      <div className="row">
        <div className="col-md-12 d-flex justify-content-center">
          <div className="form-group clearfix">
            <label htmlFor="" className="mr-2">Search Case By:</label>
            <div className="icheck-primary d-inline mx-2">
              <input 
                type="radio" 
                name="search_type" 
                id="search_type_fir" 
                onClick={(e) => setPetition({...petition, [e.target.name]: 1 })} 
                checked={ petition.search_type === 1 }
              />
              <label htmlFor="search_type_fir">FIR Number</label>
            </div>
            <div className="icheck-primary d-inline mx-2">
              <input 
                type="radio" 
                name="search_type" 
                id="search_type_case" 
                onClick={(e) => setPetition({...petition, [e.target.name]: 2 })}
                checked={ petition.search_type === 2 }
              />
              <label htmlFor="search_type_case">Case Number</label>
            </div>
          </div>
        </div>
      </div>  
      { petition.search_type === 1 && (<FIRSearch />)}
      { petition.search_type === 2 && (<CaseSearch  />)}
    </>
  )
}

export default SearchLitigant






const FIRSearch = () => {

    const stateStatus = useSelector(getStatesStatus)
    const states = useSelector((state) => state.states.states)
    const districts = useSelector((state) => state.districts.districts)
    const policeStations = useSelector((state) => state.police_stations.police_stations)

    const [showAdditionalFields, setShowAdditionalFields] = useState(false)
    const [loading, setLoading] = useState(false)
    const[errors, setErrors] = useState({})

    const[petition, setPetition] = useState({
        crime_state: '',
        crime_district: '',
        police_station: '',
        crime_number: '',
        crime_year: '',
        date_of_occurrence  : null,
        investigation_officer:'',
        fir_date_time: null,
        place_of_occurrence: '',
        gist_of_fir: '',
        gist_in_local: '',
        complainant_age: null,
        complainant_guardian:null,
        complainant_guardian_name: '',
        complainant_name:'',
        investigation_officer_rank:'',
        no_of_accused: null
    })

    const validationSchema = Yup.object({
        crime_state: Yup.string().required(),
        crime_district: Yup.string().required(),
        police_station: Yup.string().required(),
        crime_number: Yup.string().required(),
        crime_year: Yup.string().required()
    })

    const dispatch = useDispatch()

    useEffect(() => {
        if(stateStatus === 'idle'){
            dispatch(getStates())
        }
    }, [stateStatus, dispatch])

    useEffect(() => {
        if(petition.crime_state){
            dispatch(getDistrictByStateCode(petition.crime_state))
        }
    }, [petition.crime_state, dispatch])

    useEffect(() => {
        if(petition.crime_district){
            dispatch(getPoliceSationByDistrict(petition.crime_district))
        }
    }, [petition.crime_district, dispatch])

    
    const handleSearch = async (e) => {
        e.preventDefault()
        try{
            await validationSchema.validate(petition, { abortEarly:false})
            setLoading(true)
            setShowAdditionalFields(false)
            const {data} = await api.get("api/external/police/tamilnadu/fir-details/")
            if(data){
                setPetition({
                    ...petition,
                    date_of_occurrence: data.date_of_Occurrence,
                    investigation_officer :data.investigation_officer_name,
                    fir_date_time: data.FIR_DATE_Time,
                    place_of_occurrence: data.place_of_occurence,
                    gist_of_fir: data.gist_of_FIR,
                    gist_in_local: data.gist_of_FIR_local_language,
                    complainant_age: data.complainant_age,
                    complainant_guardian_name: data.complainant_guardian_name,
                    complainant_name: data.complaintant_name,
                    investigation_officer_rank: data.investigation_officer_rank,
                    no_of_accused: data.no_of_accused,
                    complainant_guardian: data.complainant_guardian
                })
                if(petition.no_of_accused){
                    const cino = localStorage.getItem("cino")
                    const update = await api.put(`api/bail/filing/${cino}/update/`, petition)
                    setLoading(false)
                    setShowAdditionalFields(true)
                    dispatch(getAccusedDetails())
                }
            }
        }catch(error){
            if(error.inner){
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
            }
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-3">
                    <label htmlFor="crime_state">State</label>
                    <select 
                        name="crime_state" 
                        id="crime_state" 
                        className={ `form-control ${errors.crime_state ? 'is-invalid': ''}`}
                        value={petition.crime_state}
                        onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value })}    
                    >
                       <option value="">Select state</option>
                       { states.map((item, index) => (
                         <option key={index} value={item.state_code }>{ item.state_name }</option>
                       ))}
                    </select>
                    <div className="invalid-feedback">
                        { errors.crime_state }
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="crime_district">District</label><br />
                        <select 
                            name="crime_district" 
                            id="crime_district" 
                            className={`form-control ${errors.crime_district ? 'is-invalid' : ''}`}
                            value={petition.crime_district} 
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value })}
                        >
                            <option value="">Select district</option>
                            { districts.map((item, index) => (
                            <option key={index} value={item.district_code }>{ item.district_name }</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">
                            { errors.crime_district }
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                <div className="form-group">
                    <label htmlFor="police_station">Police Station Name</label><br />
                    <select 
                        name="police_station" 
                        id="police_station" 
                        className={`form-control ${errors.police_station ? 'is-invalid' : ''}`}
                        value={petition.police_station}
                        onChange={(e)=> setPetition({...petition, [e.target.name]: e.target.value })}
                    >
                        <option value="">Select station</option>
                        { policeStations.map((item, index) => (
                            <option key={index} value={item.id}>{ item.station_name}</option>
                        ))}
                    </select>
                    <div className="invalid-feedback">{ errors.police_station }</div>
                    </div>
                </div>
                <div className="col-md-2 offset-4">
                    <div className="form-group">
                    <Form.Group className="mb-3">
                        <Form.Label>Crime Number</Form.Label>
                        <Form.Control 
                            type="text"
                            name="crime_number"
                            className={`${errors.crime_number ? 'is-invalid': ''}`}
                            value={petition.crime_number}
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.crime_number }</div>
                    </Form.Group>
                    </div>
                </div>
                <div className="col-md-1">
                    <Form.Group>
                        <Form.Label>Year</Form.Label>
                        <Form.Control 
                            type="text"
                            name="crime_year"
                            className={`${errors.crime_year ? 'is-invalid' : ''}`}
                            value={petition.crime_year}
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.crime_year }</div>
                    </Form.Group>   
                </div>  
                <div className="col-md-2 mt-4 pt-2">
                    <Form.Group>
                        <Button 
                            variant="info"
                            onClick={ handleSearch }
                        ><i className="fa fa-search mr-2"></i>Search</Button>
                    </Form.Group>
                </div>
                { loading && (
                    <Loader />
                )}
            </div>
            { showAdditionalFields && petition.date_of_occurrence !== '' ? (
                <FIRDetails fir={petition}/>
            ):(
                <div className="alert alert-danger">Details not found</div>
            )}
        </div>    
    )
}



const CaseSearch = () => {

    const stateStatus = useSelector(getStatesStatus)

    const states = useSelector((state) => state.states.states)
    const districts = useSelector((state) => state.districts.districts)
    const establishments = useSelector(state => state.establishments.establishments)
    const courts = useSelector((state) => state.courts.courts)
    const dispatch = useDispatch()

    const[petition, setPetition] = useState({
        case_state: null,
        case_district: null,
        case_establishment: null,
        case_court: null,
        case_case_type:  null,
        case_number: null,
        case_year: null,
        cnr_number: null,
    })

    const[loading, setLoading] = useState(false)
    const[errors, setErrors] = useState({})

    useEffect(() => {
        if(stateStatus === 'idle'){
          dispatch(getStates())
        }
      }, [stateStatus, dispatch])
    
      useEffect(() => {
        if(petition.case_state !== ''){
          dispatch(getDistrictByStateCode(petition.case_state))
        }
      }, [petition.case_state, dispatch])
    
    useEffect(() => {
        if( petition.case_district !== ''){
            dispatch(getEstablishmentByDistrict(petition.case_district))
        }
    },[petition.case_district, dispatch])

    useEffect(() => {
        if(petition.case_establishment !== ''){
          dispatch(getCourtsByEstablishmentCode(petition.case_establishment))
        }
    },[petition.case_establishment, dispatch])

    const validationSchema = Yup.object({
        case_search: Yup.string().required(),
        cnr_number: Yup.string().when('case_search', (case_search, schema) => {
            if(case_search === 1){
                return schema.required()
            }
        }),
        case_state: Yup.string().when("case_search", (case_search, schema) => {
            if(parseInt(case_search) === 2){
                return schema.required()
            }
        }),
        case_district: Yup.string().when("case_search", (case_search, schema) => {
            if(parseInt(case_search) === 2){
                return schema.required()
            }
        }),
        case_establishment: Yup.string().when("case_search", (case_search, schema) => {
            if(parseInt(case_search) === 2){
                return schema.required()
            }
        }),
        case_court: Yup.string().when("case_search", (case_search, schema) => {
            if(parseInt(case_search) === 2){
                return schema.required()
            }
        }),
        case_case_type: Yup.string().when("case_search", (case_search, schema) => {
            if(parseInt(case_search) === 2){
                return schema.required()
            }
        }),
        case_case_number: Yup.string().when("case_search", (case_search, schema) => {
            if(parseInt(case_search) === 2){
                return schema.required()
            }
        }),
        case_case_year: Yup.string().when("case_search", (case_search, schema) => {
            if(parseInt(case_search) === 2){
                return schema.required()
            }
        })
    })

    const handleSearch = async() => {
        try{
            // await validationSchema.validate(petition, {abortEarly:false})
            const cino = localStorage.getItem("cino")
            const response = await  api.put(`api/bail/filing/${cino}/update/`, petition)
            setLoading(true)
        }catch(error){
            const newErrors = {}
            error.inner.forEach((err) => {
                newErrors[err.path] = err.message
            })
            setErrors(newErrors)
        }
    }



    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12 d-flex justify-content-center">
                    <div className="form-group clearfix">
                        {/* <label htmlFor="" className="mr-2">Search Case By:</label> */}
                        <div className="icheck-info d-inline mx-2">
                            <input 
                                type="radio" 
                                name="case_search" 
                                id="case_search_basic" 
                                onClick={(e) => setPetition({...petition, [e.target.name]: 1})} 
                                checked={ petition.case_search === 1 }
                            />
                            <label htmlFor="case_search_basic">Basic Search</label>
                        </div>
                        <div className="icheck-warning d-inline mx-2">
                            <input 
                                type="radio" 
                                name="case_search" 
                                id="case_search_advanced" 
                                onClick={(e) => setPetition({...petition, [e.target.name]: 2})}
                                checked={ petition.case_search === 2 }
                            />
                            <label htmlFor="case_search_advanced">Advance Search</label>
                        </div>
                    </div>
                </div>
            </div>  
            <div className="row mb-3">
                { petition.case_search === 1 && (
                    <div className="col-md-4 offset-4">
                        <Form.Group className="row mt-2">
                            <Form.Label className="col-sm-4 text-right">CNR&nbsp;Number</Form.Label>
                            <div className="col-sm-8">
                                <Form.Control
                                    name="cnr_number"
                                    value={petition.cnr_number}
                                    className={`${errors.cnr_number ? 'is-invalid' : ''}`}
                                    onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                                    placeholder='CNR Number'
                                ></Form.Control>
                                <div className="invalid-feedback">{ errors.cnr_number }</div>
                            </div>
                        </Form.Group>
                    </div>
                )}
                { petition.case_search === 2 && (
                <>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="case_state">State</label>
                            <select 
                                name="case_state" 
                                id="case_state" 
                                className={`form-control ${errors.case_state ? 'is-invalid' : ''}`}
                                value={ petition.case_state} 
                                onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value })}
                            >
                                <option value="">Select state</option>
                                { states.map( (item, index) => (
                                    <option key={index} value={item.state_code}>{item.state_name}</option>)
                                )}
                            </select>
                            <div className="invalid-feedback">{ errors.case_state }</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="case_district">District</label>
                            <select 
                                name="case_district" 
                                id="case_district" 
                                className={`form-control ${errors.case_district ? 'is-invalid' : ''}`}
                                value={ petition.case_district }
                                onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                            >
                                <option value="">Select district</option>
                                { districts.map( (item, index) => (
                                    <option key={index} value={item.district_code}>{item.district_name}</option>)
                                )}
                            </select>
                            <div className="invalid-feedback">{ errors.case_district }</div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="case_establishment">Establishment Name</label>
                            <select 
                                name="case_establishment" 
                                id="case_establishment" 
                                className={`form-control ${errors.case_establishment ? 'is-invalid' : ''}`}
                                value={petition.case_establishment}
                                onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value })}
                            >
                                <option value="">Select Establishment</option>
                                { establishments.map((item, index) => (
                                <option value={item.establishment_code} key={index}>{item.establishment_name}</option>
                                ))}
                            </select>
                            <div className="invalid-feedback">{ errors.case_establishment }</div>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className="form-group">
                            <label htmlFor="court">Court Name</label>
                            <select 
                                name="case_court" 
                                id="case_court" 
                                className={`form-control ${errors.case_court ? 'is-invalid' : ''}`}
                                value={ petition.case_court}
                                onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value })}
                            >
                                <option value="">Select Court</option>
                                { courts.map((item, index) => (
                                    <option key={index} value={item.court_code}>{ item.court_name}</option>
                                ))}
                            </select>
                            <div className="invalid-feedback">{ errors.court }</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <Form.Group>
                            <Form.Label>Case Type</Form.Label>
                            <select 
                                name="case_case_type" 
                                className={`form-control ${errors.case_case_type ? 'is-invalid' : ''}`}
                                value={petition.case_case_type}
                                onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}    
                            >
                                <option value="">Select case type</option>
                                <option value="1">CRLMP</option>
                            </select>
                            <div className="invalid-feedback">{ errors.case_case_type }</div>
                        </Form.Group>
                    </div>
                    <div className="col-md-2">
                        <Form.Group>
                            <Form.Label>Case Number</Form.Label>
                            <Form.Control
                                name="case_number"
                                value={petition.case_number}
                                className={`${errors.case_number ? 'is-invalid' : ''}`}
                                onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value })}
                            ></Form.Control>
                            <div className="invalid-feedback">{ errors.case_number }</div>
                        </Form.Group>
                    </div>
                    <div className="col-md-2">
                        <Form.Group>
                            <Form.Label>Case Year</Form.Label>
                            <Form.Control
                                name="case_year"
                                value={petition.case_year}
                                className={`${errors.case_state ? 'is-invalid' : ''}`}
                                onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                            ></Form.Control>
                            <div className="invalid-feedback">{ errors.case_year }</div>
                        </Form.Group>
                    </div>
                </>
                )}
                <div className="col-md-12 text-center mt-3">
                    <Form.Group>
                        <Button 
                            variant="info"
                            onClick={handleSearch}
                        ><i className="fa fa-search mr-2"></i>Search</Button>
                    </Form.Group>
                </div>
                { loading && (
                    <Loader />
                )}
            </div>           
        </div>
  )
}



const FIRDetails = ({fir}) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const[allChecked, setAllChecked] =  useState(true)
    const[isConfirm, setIsConfirm] = useState(false)

    return (
        <>
            <div className="row mb-5">
                <div className="col-md-12 d-flex justify-content-center">
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleShow}
                        disabled={ !allChecked }
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
                                        <td>{ fir.place_of_occurrence }</td>
                                        <td>Investigation Officer</td>
                                        <td>{ fir.investigation_officer }</td>
                                    </tr>
                                    <tr>
                                        <td>Complaintant&nbsp;Name</td>
                                        <td colSpan={3}>{ fir.complainant_name }</td>
                                    </tr>
                                    <tr>
                                        <td>Gist of FIR / Allegations</td>
                                        <td colSpan={3}>{ fir.gist_of_fir }</td>
                                    </tr>
                                    <tr>
                                        <td>Gist of FIR / Allegations (In Local Language)</td>
                                        <td colSpan={3}><span dangerouslySetInnerHTML={CreateMarkup(fir.gist_in_local)}></span></td>
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




const Loader = () => {
  return (
        <>
            <div className="col-sm-12 d-flex justify-content-center py-3">
                <Spinner animation="grow" variant="primary" />
                <Spinner animation="grow" variant="secondary" />
                <Spinner animation="grow" variant="success" />
                <Spinner animation="grow" variant="danger" />
                <Spinner animation="grow" variant="warning" />
                <Spinner animation="grow" variant="info" />
                <Spinner animation="grow" variant="dark" />
            </div>
        </>
    )
}
