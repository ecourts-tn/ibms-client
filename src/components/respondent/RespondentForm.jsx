import React, { useState, useEffect, useContext } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import * as Yup from 'yup'
import { toast, ToastContainer } from 'react-toastify'
import { BaseContext } from '../../contexts/BaseContext'
import { PoliceDistrictContext } from 'contexts/PoliceDistrictContext'
import { PoliceStationContext } from 'contexts/PoliceStationContext'
import { StateContext } from 'contexts/StateContext'
import { DistrictContext } from 'contexts/DistrictContext'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'


const RespondentForm = ({addRespondent}) => {
    const {states} = useContext(StateContext)
    const {districts} = useContext(DistrictContext)
    const {policeStations}  = useContext(PoliceStationContext)
    const {language} = useContext(LanguageContext)
    const {t} = useTranslation()

    const initialState = {
        litigant_name: '',
        litigant_type: 2, 
        designation:'',
        state:'',
        district:'',
        police_station: '',
        address:'',
    }
    const[litigant, setLitigant] = useState(initialState)
    const[respondentPolice, setRespondentPolice] = useState(false)  

    const validationSchema = Yup.object({
        litigant_name: Yup.string().required(t('errors.respondent_name_required')),
        designation: Yup.string().required(t('errors.designation_required')),
        address: Yup.string().required(t('errors.address_required')),
        district: Yup.string().required(t('errors.district_required'))
    })
    const[errors, setErrors] = useState({})

    const handleSubmit = async () => {
        try{
            await validationSchema.validate(litigant, {abortEarly:false})
            addRespondent(litigant)
        }catch(error){
            console.error(error)
            if(error.inner){
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                });
                setErrors(newErrors)
                }
        }
    }

    const handleRespondentChange = () => {
        setRespondentPolice(!respondentPolice)
        if(!respondentPolice){
            setLitigant({...litigant, litigant_name:'State of Tamil Nadu rep by'})
        }else{
            setLitigant({...litigant, litigant_name:''})
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="row">
                <div className="col-md-12">
                    <div className="form-group">
                        <input type="checkbox" name={respondentPolice} onChange={handleRespondentChange} className="mr-2"/><span className="text-primary"><strong>{t('respondent_police')}</strong></span>
                    </div>
                </div>
            </div>
            { respondentPolice && (
            <div className="row">
                <div className="col-md-3">
                    <div className="form-group">
                    <label htmlFor="state">{t('state')}</label><br />
                    <select 
                        name="state" 
                        id="state" 
                        className="form-control"
                        value={litigant.state}
                        onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                    >
                        <option value="">Select state</option>
                        { states.map((item, index) => (
                        <option value={item.state_code} key={index}>{language === 'ta' ? item.state_lname : item.state_name}</option>
                        ))}
                    </select>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                    <label htmlFor="district">{t('district')}</label><br />
                    <select 
                        name="district" 
                        id="district" 
                        className="form-control"
                        value={litigant.district}
                        onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                    >
                        <option value="">Select District</option>
                        { districts.map((item, index) => (
                        <option value={item.district_code} key={index}>{language === 'ta' ? item.district_lname : item.district_name}</option>
                        ))}
                    </select>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="police_station">{t('police_station')}</label><br />
                        <select 
                            name="police_station" 
                            id="police_station" 
                            className={`form-control ${errors.police_station ? 'is-invalid' : ''}`}
                            value={litigant.police_station}
                            onChange={(e)=> setLitigant({...litigant, [e.target.name]: e.target.value })}
                        >
                            <option value="">Select station</option>
                            { policeStations.filter(d=>parseInt(d.revenue_district)=== parseInt(litigant.district)).map((item, index) => (
                                <option key={index} value={item.cctns_code}>{ language==='ta' ? item.station_lname : item.station_name}</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">
                            { errors.police_station }
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <Form.Group>
                        <Form.Label>{t('respondent_name')}</Form.Label>
                        <Form.Control
                            name="litigant_name"
                            value={litigant.litigant_name}
                            className={`${errors.litigant_name ? 'is-invalid' : ''}`}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                            readOnly={respondentPolice}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.litigant_name }</div>
                    </Form.Group>
                </div>
                <div className="col-md-3">
                    <Form.Group>
                        <Form.Label>{t('designation')}</Form.Label>
                        <select 
                            name="designation" 
                            className={`form-control ${errors.designation ? 'is-invalid' : ''}` }
                            value={litigant.designation}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        >
                            <option value="">Select designation</option>
                            <option value="Superintendent of Police">Superintendent of Police</option>
                            <option value="Deputy Superintendent of Police">Deputy Superintendent of Police</option>
                            <option value="Inspector of Police">Inspector of Police</option>
                            <option value="Sub-Inspector of Police">Sub-Inspector of Police</option>
                        </select>
                        <div className="invalid-feedback">{ errors.designation }</div>
                    </Form.Group>
                </div>
                <div className="col-md-6">
                    <Form.Group>
                        <Form.Label>{t('address')}</Form.Label>
                        <Form.Control
                            name="address"
                            value={litigant.address}
                            className={`${errors.address ? 'is-invalid' : ''}`}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.address }</div>
                    </Form.Group>
                </div>
                <div className="col-md-3 mt-4 pt-2">
                    <Button 
                        variant="secondary"
                        onClick={handleSubmit}>
                        <i className="fa fa-plus mr-2"></i>{t('add_respondent')}</Button>
                </div>
            </div>
            )}
            {!respondentPolice && (
            <div className="row">
                <div className="col-md-3">
                    <Form.Group>
                        <Form.Label>{t('respondent_name')}</Form.Label>
                        <Form.Control
                            name="litigant_name"
                            value={litigant.litigant_name}
                            className={`${errors.litigant_name ? 'is-invalid' : ''}`}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.litigant_name }</div>
                    </Form.Group>
                </div>
                <div className="col-md-2">
                    <Form.Group>
                        <Form.Label>{t('mobile_number')}</Form.Label>
                        <input 
                            type="text"
                            name="mobile_number" 
                            className={`form-control ${errors.mobile_number ? 'is-invalid' : ''}` }
                            value={litigant.mobile_number}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        />
                        <div className="invalid-feedback">{ errors.mobile_number }</div>
                    </Form.Group>
                </div>
                <div className="col-md-2">
                    <Form.Group>
                        <Form.Label>{t('email_address')}</Form.Label>
                        <input 
                            type="text"
                            name="email_address" 
                            className={`form-control ${errors.email_address ? 'is-invalid' : ''}` }
                            value={litigant.email_address}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        />
                        <div className="invalid-feedback">{ errors.email_address }</div>
                    </Form.Group>
                </div>
                <div className="col-md-5">
                    <Form.Group>
                        <Form.Label>{t('address')}</Form.Label>
                        <Form.Control
                            name="address"
                            value={litigant.address}
                            className={`${errors.address ? 'is-invalid' : ''}`}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.address }</div>
                    </Form.Group>
                </div>
                <div className="col-md-3 mt-4 pt-2">
                    <Button 
                        variant="secondary"
                        onClick={handleSubmit}>
                        <i className="fa fa-plus mr-2"></i>{t('add_respondent')}</Button>
                </div>
            </div>
            )}
        </>
    )
}

export default RespondentForm