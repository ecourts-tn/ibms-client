import api from 'api'
import * as Yup from 'yup'
import React, { useState, useContext, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Select from 'react-select'
import { RequiredField } from 'utils'
import { BaseContext } from 'contexts/BaseContext'
import { StateContext } from 'contexts/StateContext'
import { DistrictContext } from 'contexts/DistrictContext'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import FIRDetails from 'components/search/FIRDetails'
import Loading from 'components/common/Loading'
import { toast, ToastContainer } from 'react-toastify'

const InvestigationSearch = ({petition}) => {

    const {fir, setFir, setAccused, setFirId} = useContext(BaseContext)
    const {states} = useContext(StateContext)
    const {districts} = useContext(DistrictContext)
    const {language} = useContext(LanguageContext)
    const {t} = useTranslation()
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [notFound, setNotFound] = useState('')
    const initialState = {
        state: '',
        district: '',
        agency: '',
        crime_number:'',
        year:''
    }
    const [form, setForm] = useState(initialState)
    const validationSchema = Yup.object({
        state: Yup.string().required(t('errors.state_required')),
        district: Yup.string().required(t('errors.district_required')),
        agency: Yup.string().required(t('errors.district_required')),
        crime_number: Yup.number().required("Please enter FIR number").typeError(t('errors.numeric')),
        year: Yup.number().required("Please enter year").typeError(t('errors.numeric'))
    })

    useEffect(() => {
        setForm({...form, 
            state: petition?.state,
            district: petition?.district
        })
    },[])

    const isDisabled = parseInt(petition.judiciary) === 2;

    return (
        <>
            <ToastContainer />
            <div className="row">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="state">{t('state')}<RequiredField/></label>
                        <select 
                            name="state" 
                            id="state" 
                            className={ `form-control ${errors.state ? 'is-invalid': ''}`}
                            value={form.state}
                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value })}    
                            disabled={isDisabled || (form.state && form.state !== "")}
                        >
                        <option value="">{t('alerts.select_state')}</option>
                        { states.map((item, index) => (
                            <option key={index} value={item.state_code }>{ language === 'ta' ? item.state_lname : item.state_name }</option>
                        ))}
                        </select>
                        <div className="invalid-feedback">
                            { errors.state }
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="district">{t('revenue_district')}<RequiredField/></label>
                        <select 
                            name="district" 
                            className="form-control"
                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                            value={form.district}
                            disabled={isDisabled || (form.district && form.district !== "")}
                        >
                            <option value="">Select district</option>
                            { districts.map((district, index) => (
                                <option key={index} value={district.district_code}>{language === 'ta' ? district.district_lname : district.district_name}</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">
                            { errors.district }
                        </div>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="form-group">
                        <label htmlFor="agency">{t('investigation_agency')}<RequiredField/></label><br />
                        <Select 
                            name="agency"
                            placeholder={t('alerts.select_agency')}
                            // options={policeStations.filter(p=>parseInt(p.district_code)===parseInt(form.pdistrict)).map((station) => { return { 
                            //     value:station.cctns_code, label:language === 'ta' ? station.station_lname : station.station_name
                            // }})} 
                            className={`${errors.agency ? 'is-invalid' : null}`}
                            onChange={(e) => setForm({...form, agency:e.value})}
                        />
                        <div className="invalid-feedback">{ errors.agency }</div>
                    </div>
                </div>
                <div className="col-md-2">
                    <Form.Group className="mb-3">
                        <Form.Label>{t('crime_number')}<RequiredField/></Form.Label>
                        <Form.Control 
                            type="text"
                            name="crime_number"
                            className={`${errors.crime_number ? 'is-invalid': ''}`}
                            value={form.crime_number}
                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.crime_number }</div>
                    </Form.Group>
                </div>
                <div className="col-md-2">
                    <Form.Group>
                        <Form.Label>{t('crime_year')}<RequiredField/></Form.Label>
                        <Form.Control 
                            type="text"
                            name="year"
                            className={`${errors.year ? 'is-invalid' : ''}`}
                            value={form.year}
                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.year }</div>
                    </Form.Group>   
                </div>  
            </div>
        </>    
    )
}

export default InvestigationSearch