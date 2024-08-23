import React from 'react';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Loader from '../Loader';
import { useSelector, useDispatch } from 'react-redux';
import { getDistrictByStateCode } from '../../redux/features/DistrictSlice';
import { getStatesStatus, getStates } from '../../redux/features/StateSlice';
import { getCourtsByEstablishmentCode } from '../../redux/features/CourtSlice';
import { getEstablishmentByDistrict } from '../../redux/features/EstablishmentSlice';
import * as Yup from 'yup';
import api from '../../api';

const CaseSearch = () => {

    const stateStatus = useSelector(getStatesStatus)

    const states = useSelector((state) => state.states.states)
    const districts = useSelector((state) => state.districts.districts)
    const establishments = useSelector(state => state.establishments.establishments)
    const courts = useSelector((state) => state.courts.courts)
    const dispatch = useDispatch()

    const[search, setSearch] = useState(1)
    const[form, setForm] = useState({
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
        if(form.case_state !== null){
            dispatch(getDistrictByStateCode(form.case_state))
        }
    }, [form.case_state, dispatch])
    
    useEffect(() => {
        if( form.case_district !== null){
            dispatch(getEstablishmentByDistrict(form.case_district))
        }
    },[form.case_district, dispatch])

    useEffect(() => {
        if(form.case_establishment !== null){
          dispatch(getCourtsByEstablishmentCode(form.case_establishment))
        }
    },[form.case_establishment, dispatch])

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
            await validationSchema.validate(form, {abortEarly:false})
            const efile_no = localStorage.getItem("efile_no")
            const response = await  api.put(`api/bail/filing/${efile_no}/update/`, form)
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
        <>
            <div className="row mt-4">
                <div className="col-md-12 d-flex justify-content-center">
                    <div className="form-group clearfix">
                        <label htmlFor="" className="mr-2">Search Case By:</label>
                        <div className="icheck-info d-inline mx-2">
                            <input 
                                type="radio" 
                                name="search" 
                                id="case_search_basic" 
                                onClick={(e) => setSearch(1)} 
                                checked={ search === 1 }
                            />
                            <label htmlFor="case_search_basic">Basic Search</label>
                        </div>
                        <div className="icheck-warning d-inline mx-2">
                            <input 
                                type="radio" 
                                name="search" 
                                id="case_search_advanced" 
                                onClick={(e) => setSearch(2)}
                                checked={ search === 2 }
                            />
                            <label htmlFor="case_search_advanced">Advance Search</label>
                        </div>
                    </div>
                </div>
            </div>  
            <div className="row mb-3">
                { search === 1 && (
                    <div className="col-md-6 offset-md-3">
                        <Form.Group className="row mt-2">
                            <Form.Label className="col-sm-4 text-right">CNR&nbsp;Number</Form.Label>
                            <div className="col-sm-8">
                                <Form.Control
                                    name="cnr_number"
                                    value={form.cnr_number}
                                    className={`${errors.cnr_number ? 'is-invalid' : ''}`}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    placeholder='CNR Number'
                                ></Form.Control>
                                <div className="invalid-feedback">{ errors.cnr_number }</div>
                            </div>
                        </Form.Group>
                    </div>
                )}
                { search === 2 && (
                <>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="case_state">State</label>
                            <select 
                                name="case_state" 
                                id="case_state" 
                                className={`form-control ${errors.case_state ? 'is-invalid' : ''}`}
                                value={ form.case_state} 
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value })}
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
                                value={ form.case_district }
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
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
                                value={form.case_establishment}
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value })}
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
                                value={ form.case_court}
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value })}
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
                                value={form.case_case_type}
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}    
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
                                value={form.case_number}
                                className={`${errors.case_number ? 'is-invalid' : ''}`}
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value })}
                            ></Form.Control>
                            <div className="invalid-feedback">{ errors.case_number }</div>
                        </Form.Group>
                    </div>
                    <div className="col-md-2">
                        <Form.Group>
                            <Form.Label>Case Year</Form.Label>
                            <Form.Control
                                name="case_year"
                                value={form.case_year}
                                className={`${errors.case_state ? 'is-invalid' : ''}`}
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
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
        </>
  )
}

export default CaseSearch