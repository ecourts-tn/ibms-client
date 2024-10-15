import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Loader from '../Loader';
import * as Yup from 'yup';
import api from '../../api';
import { StateContext } from 'contexts/StateContext';
import { DistrictContext } from 'contexts/DistrictContext';
import { EstablishmentContext } from 'contexts/EstablishmentContext';
import { CourtContext } from 'contexts/CourtContext';
import Select from 'react-select'
import { useTranslation } from 'react-i18next';

const CaseSearch = () => {

    const {states} = useContext(StateContext)
    const {districts} = useContext(DistrictContext)
    const {establishments} = useContext(EstablishmentContext)
    const {courts} = useContext(CourtContext)
    const {t} = useTranslation()
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
            <div className="row p-0" style={{border:"1px solid #ffc107"}}>
                    <div className="col-md-12 p-0">
                        <p className="bg-warning py-2 px-3"><strong>{t('case_search')}</strong></p>
                    </div>
                    <div className="col-md-12 d-flex justify-content-center">
                        <div className="form-group clearfix">
                            <label htmlFor="" className="mr-2">{t('search_case_by')}</label>
                            <div className="icheck-success d-inline mx-2">
                                <input 
                                    type="radio" 
                                    name="search" 
                                    id="case_search_basic" 
                                    onClick={(e) => setSearch(1)} 
                                    checked={ search === 1 }
                                />
                                <label htmlFor="case_search_basic">{t('basic_search')}</label>
                            </div>
                            <div className="icheck-success d-inline mx-2">
                                <input 
                                    type="radio" 
                                    name="search" 
                                    id="case_search_advanced" 
                                    onClick={(e) => setSearch(2)}
                                    checked={ search === 2 }
                                />
                                <label htmlFor="case_search_advanced">{t('advance_search')}</label>
                            </div>
                        </div>
                    </div>
                    { search === 1 && (
                    <div className="col-md-6 offset-md-3">
                        <Form.Group className="row">
                            <Form.Label className="col-sm-4 text-right">{t('cnr_number')}</Form.Label>
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
                    <div className="row mb-3 px-2">
                        <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="case_state">{t('state')}</label>
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
                                <label htmlFor="case_district">{t('district')}</label>
                                <Select 
                                    name="case_district"
                                    options={districts.filter(district=>parseInt(district.state)===parseInt(form.case_state)).map((district) => { return { value:district.district_code, label:district.district_name}})} 
                                    className={`${errors.district ? 'is-invalid' : null}`}
                                    onChange={(e) => setForm({...form, case_district:e.value})}
                                />
                                <div className="invalid-feedback">{ errors.case_district }</div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="case_establishment">{t('est_name')}</label>
                                <Select 
                                    name="case_establishment"
                                    options={establishments.filter(e=>parseInt(e.district)=== parseInt(form.case_district)).map((est) => { return { value:est.establishment_code, label:est.establishment_name}})} 
                                    className={`${errors.establishment ? 'is-invalid' : null}`}
                                    onChange={(e) => setForm({...form, case_establishment:e.value})}
                                />
                                <div className="invalid-feedback">{ errors.case_establishment }</div>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="court">{t('court')}</label>
                                <Select 
                                    name="court"
                                    options={courts.filter(c=>c.establishment===form.case_establishment).map((est) => { return { value:est.court_code, label:est.court_name}})} 
                                    className={`${errors.court ? 'is-invalid' : null}`}
                                    onChange={(e) => setForm({...form, court:e.value})}
                                />
                                <div className="invalid-feedback">{ errors.court }</div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <Form.Group>
                                <Form.Label>{t('case_type')}</Form.Label>
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
                                <Form.Label>{t('case_number')}</Form.Label>
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
                                <Form.Label>{t('case_year')}</Form.Label>
                                <Form.Control
                                    name="case_year"
                                    value={form.case_year}
                                    className={`${errors.case_state ? 'is-invalid' : ''}`}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                ></Form.Control>
                                <div className="invalid-feedback">{ errors.case_year }</div>
                            </Form.Group>
                        </div>
                    </div>
                    )}
                    <div className="col-md-12 text-center my-3">
                        <Form.Group>
                            <Button 
                                variant="info"
                                onClick={handleSearch}
                            ><i className="fa fa-search mr-2"></i>{t('search')}</Button>
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