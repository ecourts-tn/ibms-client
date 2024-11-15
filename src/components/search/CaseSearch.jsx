import api from 'api';
import * as Yup from 'yup';
import React, { useState, useEffect, useContext } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Select from 'react-select'
import Loader from 'components/filing/Loader';
import { StateContext } from 'contexts/StateContext';
import { DistrictContext } from 'contexts/DistrictContext';
import { EstablishmentContext } from 'contexts/EstablishmentContext';
import { CourtContext } from 'contexts/CourtContext';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';

const CaseSearch = () => {

    const {states} = useContext(StateContext)
    const {districts} = useContext(DistrictContext)
    const {establishments} = useContext(EstablishmentContext)
    const {courts} = useContext(CourtContext)
    const {language} = useContext(LanguageContext)
    const {t} = useTranslation()
    const[search, setSearch] = useState(1)
    const[form, setForm] = useState({
        state: null,
        district: null,
        establishment: null,
        court: null,
        case_type:  null,
        case_number: null,
        case_year: null,
        cnr_number: null,
    })

    const[loading, setLoading] = useState(false)
    const[errors, setErrors] = useState({})

    const validationSchema = Yup.object({
        search: Yup.string().required(),
        cnr_number: Yup.string().when('search', (search, schema) => {
            if(parseInt(search) === 1){
                return schema.required(t('errors.cnr_required'))
            }
        }),
        state: Yup.string().when("search", (search, schema) => {
            if(parseInt(search) === 2){
                return schema.required(t('errors.state_required'))
            }
        }),
        district: Yup.string().when("search", (search, schema) => {
            if(parseInt(search) === 2){
                return schema.required(t('errors.district_required'))
            }
        }),
        establishment: Yup.string().when("search", (search, schema) => {
            if(parseInt(search) === 2){
                return schema.required(t('errors.est_required'))
            }
        }),
        court: Yup.string().when("search", (search, schema) => {
            if(parseInt(search) === 2){
                return schema.required(t('errors.court_required'))
            }
        }),
        case_type: Yup.string().when("search", (search, schema) => {
            if(parseInt(search) === 2){
                return schema.required(t('alerts.case_type_required'))
            }
        }),
        case_number: Yup.string().when("search", (search, schema) => {
            if(parseInt(search) === 2){
                return schema.required()
            }
        }),
        case_year: Yup.string().when("search", (search, schema) => {
            if(parseInt(search) === 2){
                return schema.required()
            }
        })
    })

    console.log(errors)

    const handleSearch = async() => {
        try{
            await validationSchema.validate(form, {abortEarly:false})
            const efile_no = localStorage.getItem("efile_no")
            const response = await  api.put(`api/bail/filing/${efile_no}/update/`, form)
            setLoading(true)
        }catch(error){
            const newErrors = {}
            if(error.inner){
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
            }
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
                    <div className="col-md-8 offset-md-2">
                        <Form.Group className="row mb-5">
                            <Form.Label className="col-sm-3 text-right">{t('cnr_number')}</Form.Label>
                            <div className="col-sm-6">
                                <Form.Control
                                    name="cnr_number"
                                    value={form.cnr_number}
                                    className={`${errors.cnr_number ? 'is-invalid' : ''}`}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    placeholder='CNR Number'
                                ></Form.Control>
                                <div className="invalid-feedback">{ errors.cnr_number }</div>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Button 
                                        variant="info"
                                        onClick={handleSearch}
                                    ><i className="fa fa-search mr-2"></i>{t('search')}</Button>
                                </Form.Group>
                            </div>
                        </Form.Group>
                    </div>
                    )}
                    { search === 2 && (
                    <div className="row mb-3 px-2">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="state">{t('state')}</label>
                                <select 
                                    name="state" 
                                    id="state" 
                                    className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                                    value={ form.state} 
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value })}
                                >
                                    <option value="">{t('alerts.select_state')}</option>
                                    { states.map( (item, index) => (
                                        <option key={index} value={item.state_code}>{language === 'ta' ? item.state_lname : item.state_name}</option>)
                                    )}
                                </select>
                                <div className="invalid-feedback">{t('errors.state_required')}</div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="district">{t('district')}</label>
                                <Select 
                                    name="district"
                                    placeholder={t('alerts.select_district')}
                                    options={districts.filter(district=>parseInt(district.state)===parseInt(form.state)).map((district) => { return { 
                                        value:district.district_code, label: language === 'ta' ? district.district_lname : district.district_name
                                    }})} 
                                    className={`${errors.district ? 'is-invalid' : null}`}
                                    onChange={(e) => setForm({...form, district:e.value})}
                                />
                                <div className="invalid-feedback">{t('errors.district_required')}</div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="establishment">{t('est_name')}</label>
                                <Select 
                                    name="establishment"
                                    placeholder={t('alerts.select_establishment')}
                                    options={establishments.filter(e=>parseInt(e.district)=== parseInt(form.district)).map((est) => { return { 
                                        value:est.establishment_code, label: language === 'ta' ? est.establishment_lname : est.establishment_name
                                    }})} 
                                    className={`${errors.establishment ? 'is-invalid' : null}`}
                                    onChange={(e) => setForm({...form, establishment:e.value})}
                                />
                                <div className="invalid-feedback">{t('errors.est_required')}</div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="court">{t('court')}</label>
                                <Select 
                                    name="court"
                                    placeholder={t('alerts.select_court')}
                                    options={courts.filter(c=>c.establishment===form.establishment).map((est) => { return { 
                                        value:est.court_code, label: language === 'ta' ? est.court_lname : est.court_name
                                    }})} 
                                    className={`${errors.court ? 'is-invalid' : null}`}
                                    onChange={(e) => setForm({...form, court:e.value})}
                                />
                                <div className="invalid-feedback">{t('errors.court_required')}</div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <Form.Group>
                                <Form.Label>{t('case_type')}</Form.Label>
                                <select 
                                    name="case_type" 
                                    className={`form-control ${errors.case_type ? 'is-invalid' : ''}`}
                                    value={form.case_type}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}    
                                >
                                    <option value="">{t('alerts.select_case_type')}</option>
                                    <option value="1">CRLMP</option>
                                </select>
                                <div className="invalid-feedback">{t('errors.case_type_required')}</div>
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
                                    className={`${errors.case_year ? 'is-invalid' : ''}`}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                ></Form.Control>
                                <div className="invalid-feedback">{ errors.case_year }</div>
                            </Form.Group>
                        </div>
                        <div className="col-md-2 pt-4 mt-1">
                            <Form.Group>
                                <Button 
                                    variant="info"
                                    onClick={handleSearch}
                                ><i className="fa fa-search mr-2"></i>{t('search')}</Button>
                            </Form.Group>
                        </div>
                    </div>
                    )}
                    { loading && (
                        <Loader />
                    )}
                </div>           
            </>
  )
}

export default CaseSearch