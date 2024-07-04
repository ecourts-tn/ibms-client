import React, { useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import Form from 'react-bootstrap/Form'
import Button from '@mui/material/Button'
import { useDispatch, useSelector } from "react-redux";
import { getDistrictByStateCode } from '../../redux/features/DistrictSlice'
import { getStatesStatus, getStates } from '../../redux/features/StateSlice';
import { getCaseTypeStatus,getCaseTypes } from '../../redux/features/CaseTypeSlice';
import { getBailTypeByCaseType } from '../../redux/features/BailTypeSlice';
import { getCourtsByEstablishmentCode } from '../../redux/features/CourtSlice';
import { getEstablishmentByDistrict } from '../../redux/features/EstablishmentSlice';
import { getComplaintTypes, getComplaintTypeStatus } from '../../redux/features/ComplaintTypeSlice';
import { getCourtTypes, getCourtTypeStatus } from '../../redux/features/CourtTypeSlice';
import { getBenchTypes, getBenchTypeStatus } from '../../redux/features/BenchTypeSlice';
import { toast, ToastContainer } from 'react-toastify';
import * as Yup from 'yup'
import api from '../../api';
import Select from 'react-select'
import { BorderColor } from '@mui/icons-material';

const BasicContainer = ({setActiveStep}) => {

    const dispatch = useDispatch()
    const stateStatus       = useSelector(getStatesStatus);
    const complaintStatus   = useSelector(getComplaintTypeStatus)
    const caseTypeStatus    = useSelector(getCaseTypeStatus)
    const courtTypeStatus   = useSelector(getCourtTypeStatus)
    const benchTypeStatus   = useSelector(getBenchTypeStatus)

    const states            = useSelector((state) => state.states.states)
    const districts         = useSelector((state) => state.districts.districts)
    const casetypes         = useSelector((state) => state.casetypes.casetypes)
    const bailtypes         = useSelector((state) => state.bailtypes.bailtypes)
    const establishments    = useSelector((state) => state.establishments.establishments)
    const courts            = useSelector((state) => state.courts.courts)
    const complainttypes    = useSelector((state) => state.complainttypes.complainttypes)
    const courttypes        = useSelector((state) => state.courttypes.courttypes)
    const benchtypes        = useSelector((state) => state.benchtypes.benchtypes)

    const[petition, setPetition] = useState({
        court_type: 1,
        bench_type: null,
        state: '',
        district:'',
        establishment: '',
        court:'',
        case_type: '',
        bail_type: '',
        complaint_type:'',
        crime_registered: '',
    })

    const[errors, setErrors] = useState({})

    let validationSchema = Yup.object({
        court_type: Yup.string().required("Please select court type"),
        bench_type: Yup.string().when("court_type",(court_type, schema) => {
            if(parseInt(court_type) === 1){
                return schema.required("Please select the bench type")
            }
        }),
        state: Yup.string().when("court_type", (court_type, schema) => {
            if(parseInt(court_type) === 2){
                return schema.required("Please select the state")
            }
        }),
        district: Yup.string().when("court_type", (court_type, schema) => {
            if(parseInt(court_type) === 2){
                return schema.required("Please select the district")
            }
        }),
        establishment: Yup.string().when("court_type", (court_type, schema) => {
            if(parseInt(court_type) === 2){
                return schema.required("Please select the establishment")
            }
        }),
        court: Yup.string().when("court_type", (court_type, schema) => {
            if(parseInt(court_type) === 2){
                return schema.required("Please select the court")
            }
        }),
        case_type: Yup.string().required("Please select the case type"),
        bail_type: Yup.string().required("Please select the bail type"),
        complaint_type: Yup.string().required("Please select the complaint type"),
        crime_registered: Yup.string().required("Please choose any one option")
    })

    useEffect(() => {
        if(courtTypeStatus === 'idle'){
            dispatch(getCourtTypes())
        }
    },[dispatch]) 

    useEffect(() => {
        if(benchTypeStatus === 'idle' && petition.court_type !== ''){
            dispatch(getBenchTypes())
        }
    }, [benchTypeStatus, dispatch])

    useEffect(() => {
        if(caseTypeStatus === 'idle'){
          dispatch(getCaseTypes())
        }
    }, [caseTypeStatus, dispatch])

    useEffect(() => {
        if(complaintStatus === 'idle'){
            dispatch(getComplaintTypes())
        }
    }, [complaintStatus, dispatch])
    
    useEffect(() => {
        if(petition.case_type !== ''){
            dispatch(getBailTypeByCaseType(petition.case_type));
        }
    }, [petition.case_type, dispatch]);
    
    useEffect(() => {
    if(stateStatus === 'idle'){
        dispatch(getStates())
    }
    }, [stateStatus, dispatch])
    
    useEffect(() => {
    if(petition.state !== ''){
        dispatch(getDistrictByStateCode(petition.state))
    }
    }, [petition.state, dispatch])
    
    useEffect(() => {
        if( petition.district !== ''){
            dispatch(getEstablishmentByDistrict(petition.district))
        }
    },[petition.district, dispatch])

    useEffect(() => {
        if(petition.establishment !== ''){
          dispatch(getCourtsByEstablishmentCode(petition.establishment))
        }
    },[petition.establishment, dispatch])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            await validationSchema.validate(petition, { abortEarly:false})
            const response = await api.post("api/bail/filing/", {petition})
            if(response.status === 201){
                // setActiveStep(1)
                localStorage.setItem("cino", response.data.cino)
                toast.success(`${response.data.cino} details submitted successfully`, {
                    theme:"colored"
                })
            }
          }catch(error){
            const newErrors = {};
            error.inner.forEach((err) => {
                newErrors[err.path] = err.message;
            });
            setErrors(newErrors);
            console.log(error)
        }
    }

    const districtOptions = districts.map((district, index) => {
        return {
            value : district.district_code,
            label : district.district_name
        }
    })

    return (
        <>
            <ToastContainer />
            <div className="row">
                <div className="col-md-12">
                    <div className="">
                        {/* <div className="card-header">
                            <h3 className="text-center card-title">
                                <i className="fa fa-pencil-alt mr-2"></i>
                                <strong>Basic Details</strong>
                            </h3>
                        </div> */}
                        <div className="">
                            <div className="row mt-4">
                                <div className="col-md-6 offset-md-3">
                                    <Form.Group className="row mb-4">
                                        <Form.Label className="col-sm-3">Court Type</Form.Label>
                                        <div className="col-sm-9">
                                            <select 
                                                name="court_type" 
                                                id="court_type" 
                                                className="form-control" 
                                                value={petition.court_type} 
                                                onChange={(e) => setPetition({...petition, [e.target.name]:e.target.value})}
                                            >
                                                { courttypes.map((type, index) => (
                                                    <option key={index} value={type.id}>{type.court_type}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </Form.Group>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 offset-md-3">
                                    { petition.court_type == 1 && (
                                    <div className="form-group row mb-4">
                                        <label htmlFor="bench_type" className="col-sm-3">High Court Bench</label>
                                        <div className="col-sm-9">
                                            <select 
                                                name="bench_type" 
                                                className={`form-control ${errors.bench_type ? 'is-invalid' : ''} `}
                                                value={petition.bench_type}
                                                onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                                            >
                                                <option value="">Select bench</option>
                                                { benchtypes.map((bench, index) => (
                                                    <option key={index} value={bench.id}>{ bench.bench_type}</option>
                                                ))}
                                            </select>
                                            <div className="invalid-feedback">
                                                { errors.bench_type }
                                            </div>
                                        </div>
                                    </div>
                                    )}
                                </div>
                            </div>  
                            { petition.court_type == 2 && (
                            <div className="row">
                                <div className="col-md-8 offset-md-2">
                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="state">State</label>
                                                <select 
                                                    name="state" 
                                                    className={`form-control ${errors.state ? 'is-invalid': null }`}
                                                    value={petition.state} onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}>
                                                    <option value="">Select state</option>
                                                    { states.map( (item, index) => (
                                                        <option key={index} value={item.state_code}>{item.state_name}</option>)
                                                    )}
                                                </select>
                                                <div className="invalid-feedback">
                                                    { errors.state }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="district">District</label>
                                                {/* <select 
                                                    id="basic_district"
                                                    name="district" 
                                                    className={`form-control ${errors.district ? 'is-invalid' : null}`}
                                                    value={petition.district}
                                                    onChange={(e) => setPetition({...petition, [e.target.name]:e.target.value})}
                                                >
                                                    <option value="">Select district</option>
                                                    { districts.map( (item, index) => (
                                                        <option key={index} value={item.district_code}>{item.district_name}</option>)
                                                    )}
                                                </select> */}
                                                <Select 
                                                    name="district"
                                                    style={{BorderColor:'red'}}
                                                    options={districtOptions} 
                                                    className={`${errors.district ? 'is-invalid' : null}`}
                                                    onChange={(e) => setPetition({...petition, district:e.value})}
                                                />
                                                <div className="invalid-feedback">
                                                    { errors.district }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="establishment">Establishment Name</label>
                                                <select 
                                                    name="establishment" 
                                                    id="establishment" 
                                                    className={`form-control ${errors.establishment ? 'is-invalid' : null}`}
                                                    value={petition.establishment}
                                                    onChange={(e) => setPetition({...petition, [e.target.name]:e.target.value})}
                                                >
                                                    <option value="">Select Establishment</option>
                                                    {
                                                        establishments.filter((establishment) => {
                                                            return establishment.bail_filing && establishment.display
                                                        })
                                                        .map((item, index) => (
                                                            <option value={item.establishment_code} key={index}>{item.establishment_name}</option>
                                                        ))
                                                    }
                                                </select>
                                                <div className="invalid-feedback">
                                                    { errors.establishment }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="court">Court Name</label>
                                                <select 
                                                    name="court" 
                                                    id="court" 
                                                    className={`form-control ${errors.court ? 'is-invalid' : null }`}
                                                    value={petition.court}
                                                    onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                                                >
                                                    <option value="">Select court</option>
                                                    {   courts.filter((court) => {
                                                            return court.bail_filing && court.display
                                                        })
                                                        .map((item, index) => (
                                                            <option key={index} value={item.court_code}>{ item.court_name}</option>
                                                        ))
                                                    }
                                                </select>
                                                <div className="invalid-feedback">
                                                    { errors.court }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            )}
                            <div className="row">
                                <div className="col-md-6 offset-md-3">
                                    <div className="form-group row mb-4">
                                        <label htmlFor="caseType" className="col-sm-3">Case Type</label>
                                        <div className="col-sm-9">
                                            <select 
                                                name="case_type" 
                                                id="case_type" 
                                                className={`form-control ${errors.case_type ? 'is-invalid' : null}`} 
                                                value={petition.case_type} 
                                                onChange={(e) => setPetition({...petition, [e.target.name]:e.target.value})}
                                            >
                                                <option value="">Select type</option>
                                                { casetypes.map( (item, index) => (
                                                <option key={index} value={item.id}>{item.type_full_form}</option>)
                                                )}
                                            </select>
                                            <div className="invalid-feedback">
                                                { errors.case_type }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row mb-4">
                                        <label htmlFor="bail_type" className="col-sm-3">Bail Type</label>
                                        <div className="col-sm-9">
                                            <select 
                                                name="bail_type" 
                                                id="bail_type" 
                                                className={`form-control ${errors.bail_type ? 'is-invalid' : null}`}
                                                value={petition.bail_type}
                                                onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                                            >
                                                <option value="">Select type</option>
                                                { bailtypes.map((item, index) => (
                                                <option key={index} value={item.id}>{ item.type_name }</option>
                                                ))}
                                            </select>
                                            <div className="invalid-feedback">
                                                { errors.bail_type}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row mb-4">
                                        <label htmlFor="complaint_type" className="col-sm-3">Complaint Type</label>
                                        <div className="col-sm-9">
                                            <select 
                                                name="complaint_type" 
                                                id="complaint_type"
                                                className={`form-control ${errors.complaint_type ? 'is-invalid' : null}`}   
                                                value={petition.complaint_type}
                                                onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}           
                                            >
                                                <option value="">Select type</option>
                                                { complainttypes.map((item, index) => (
                                                    <option key={index} value={item.id}>{ item.type_name }</option>
                                                ))}
                                            </select>
                                            <div className="invalid-feedback">
                                                { errors.complaint_type }
                                            </div>    
                                        </div>
                                    </div>
                                    <div className="form-group row clearfix mb-4">
                                        <label htmlFor="" className="col-sm-3">Crime Registered?</label>
                                        <div className="col-sm-9">
                                            <div className="icheck-success d-inline mx-2">
                                                <input type="radio" id="radioPrimary1" name="crime_registered" onClick={(e) => setPetition({...petition, [e.target.name]:1})} />
                                                <label htmlFor="radioPrimary1">Yes</label>
                                            </div>
                                            <div className="icheck-danger d-inline mx-2">
                                                <input type="radio" id="radioPrimary2" name="crime_registered" onClick={(e) => setPetition({...petition, [e.target.name]:2})}/>
                                                <label htmlFor="radioPrimary2">No</label>
                                            </div>
                                            <div className="icheck-primary d-inline mx-2">
                                                <input type="radio" id="radioPrimary3" name="crime_registered" onClick={(e) => setPetition({...petition, [e.target.name]:3})}/>
                                                <label htmlFor="radioPrimary3">Not Known</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 d-flex justify-content-center mt-2">
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={handleSubmit}
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BasicContainer
