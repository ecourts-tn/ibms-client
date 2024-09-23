import React, { useEffect, useState, useContext } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import Form from 'react-bootstrap/Form'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import * as Yup from 'yup'
import api from '../../../api';
import Select from 'react-select'
import { useLocalStorage } from "hooks/useLocalStorage";
import { BaseContext } from 'contexts/BaseContext';
import { DistrictContext } from 'contexts/DistrictContext';
import { StateContext } from 'contexts/StateContext';
import { EstablishmentContext } from 'contexts/EstablishmentContext';
import { CourtContext } from 'contexts/CourtContext';
import { CourtTypeContext } from 'contexts/CourtTypeContext';
import { BenchTypeContext } from 'contexts/BenchTypeContext';
import { BailTypeContext } from 'contexts/BailTypeContext';
import { ComplaintTypeContext } from 'contexts/ComplaintTypeContext';

const InitialInput = () => {

    const navigate = useNavigate()

    const {efile_no, setEfileNo, fir} = useContext(BaseContext)
    const {states}          = useContext(StateContext)
    const {districts}       = useContext(DistrictContext)
    const {establishments}  = useContext(EstablishmentContext)
    const {courts}          = useContext(CourtContext)
    const {courttypes}      = useContext(CourtTypeContext)
    const {benchtypes}      = useContext(BenchTypeContext)
    const {bailtypes}       = useContext(BailTypeContext)
    const {complainttypes}  = useContext(ComplaintTypeContext)

    const initialState = {
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
    }

    const[petition, setPetition] = useState(initialState)

    const[errors, setErrors] = useState({})
    const [user, setUser] = useLocalStorage("user", null)

    console.log(user.user)

    let validationSchema = Yup.object({
        court_type: Yup.string().required("Please select court type"),
        // bench_type: Yup.string().when("court_type",(court_type, schema) => {
        //     if(parseInt(court_type) === 1){
        //         return schema.required("Please select the bench type")
        //     }
        // }),
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


    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            await validationSchema.validate(petition, { abortEarly:false})
            const response = await api.post("api/case/filing/create/", petition)
            if(response.status === 201){
                localStorage.setItem("efile_no", response.data.efile_number)
                toast.success(`${response.data.efile_number} details submitted successfully`, {
                    theme:"colored"
                })
                if(parseInt(user.user.user_type) === 1){
                    const advocate = {
                        advocate_name: user.user.username,
                        advocate_email: user.user.email,
                        advocate_mobile: user.user.mobile,
                        enrolment_number: user.user.bar_code.concat("/",user.user.reg_number, "/", user.user.reg_year),
                        is_primary: true
                    }
                    const efile_no = localStorage.getItem("efile_no")
                    const res = await api.post(`api/advocate/create/`, advocate, {params: {efile_no}})
                }
                setPetition(initialState)
                setTimeout(() => {
                    navigate("/petition/bail/litigant")
                }, [3000]);
            }
          }catch(error){
            if (error.inner){
                const newErrors = {};
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message;
                });
                setErrors(newErrors);
            }
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
            <div className="row my-3">
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
                                                {/* { courttypes.map((type, index) => (
                                                    <option key={index} value={type.id}>{type.court_type}</option>
                                                ))} */}
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

export default InitialInput
