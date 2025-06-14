import React, { useState, useEffect, useContext } from 'react'
import Button from 'react-bootstrap/Button'
import * as Yup from 'yup'
import api from 'api'
import { PoliceStationContext } from 'contexts/PoliceStationContext'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import { MasterContext } from 'contexts/MasterContext'
import { BaseContext } from 'contexts/BaseContext'
import { RequiredField } from 'utils'


const RespondentForm = ({addRespondent, selectedRespondent}) => {
    const {policeStations}  = useContext(PoliceStationContext)
    const { masters:{states, districts, designations}} = useContext(MasterContext)
    const {language} = useContext(LanguageContext)
    const {t} = useTranslation()
    const {efileNumber} = useContext(BaseContext)
    const initialState = {
        litigant_name: '',
        litigant_type: 2, 
        designation:'',
        state:'',
        district:'',
        police_station: '',
        address:'',
        mobile_number:'',
        email_address:'',
    }
    const[litigant, setLitigant] = useState(initialState)
    const[petition, setPetition] = useState({})
    const [errors, setErrors] = useState({})
    const[respondentPolice, setRespondentPolice] = useState(false)  


    useEffect(() => {
        if(selectedRespondent){
            setLitigant(selectedRespondent)
        }
    }, [selectedRespondent])

    useEffect(() => {
        const fetchPetitionDetail = async() => {
            try{
                const response = await api.get(`case/filing/detail/`, {params:{efile_no:efileNumber}})
                if(response.status === 200){
                    const petition = response.data.petition
                    setPetition(petition)
                    setLitigant({...litigant, 
                        state: petition.state?.state_code || '',
                        district: petition.district?.district_code || '',
                        // pdistrict: petition.pdistrict?.district_code,
                        police_station: petition.police_station?.cctns_code || '',
                    })
                }else{
                    setLitigant(initialState)
                }
            }catch(error){
                setLitigant(initialState)
            }
        }
        if(efileNumber){
            fetchPetitionDetail()
        }else{
            setLitigant(initialState)
        }
    },[efileNumber])



    const validationSchema = Yup.object({
        state: Yup.string()
            .nullable()
            .when('$respondentPolice', {
            is: true,
            then: schema => schema.required(t('errors.state_required')),
            otherwise: schema => schema.notRequired(),
        }),
        district: Yup.string()
            .nullable()
            .when('$respondentPolice', {
            is: true,
            then: schema => schema.required(t('errors.district_required')),
            otherwise: schema => schema.notRequired(),
        }),
        police_station: Yup.string()
            .nullable()
            .when('$respondentPolice', {
            is: true,
            then: schema => schema.required(t('errors.police_station_required')),
            otherwise: schema => schema.notRequired(),
        }),
        designation: Yup.string()
            .nullable()
            .when('$respondentPolice', {
            is: true,
            then: schema => schema.required(t('errors.designation_required')),
            otherwise: schema => schema.notRequired(),
        }),
        mobile_number: Yup.string()
            .nullable()
            .notRequired()
            .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
            .transform(value => (value === '' ? null : value)),
        email_address: Yup.string()
            .nullable()
            .notRequired()
            .email('Enter a valid email address')
            .transform(value => (value === '' ? null : value)),
                    litigant_name: Yup.string().required(t('errors.respondent_name_required')),
                    address: Yup.string().required(t('errors.address_required')),
        })


    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await validationSchema.validate(litigant, { context: {respondentPolice}, abortEarly:false})
            addRespondent(litigant)
        }catch(error){
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
            setLitigant({...litigant, litigant_name: language === 'ta' ? 'தமிழ்நாடு மாநில பிரதிநிதி' : 'State of Tamil Nadu rep by'})
        }else{
            setLitigant({...litigant, litigant_name:''})
        }
    }

    return (
        <React.Fragment>
            <div className="row mt-3">
                <div className="col-md-12">
                    <div className="form-group">
                        <input type="checkbox" name={respondentPolice} onChange={handleRespondentChange} className="mr-2"/><span className="text-primary"><strong>{t('respondent_police')}</strong></span>
                    </div>
                </div>
            </div>
            {!respondentPolice && (
            <div className="form-group row">
                <label className='col-sm-3 col-form-label'>{t('respondent_name')} <RequiredField /></label>
                <div className="col-md-6">
                    <input
                        type="text"
                        name="litigant_name"
                        value={litigant.litigant_name}
                        className={`form-control ${errors.litigant_name ? 'is-invalid' : ''}`}
                        onChange={(e) => setLitigant({...litigant, [e.target.name] : e.target.value})}
                    />
                    <div className="invalid-feedback">
                        { errors.litigant_name }
                    </div>
                </div>
            </div>    
            )}
            { respondentPolice && (
             <React.Fragment>
                <div className="form-group row">
                    <label htmlFor="state" className='col-sm-3 col-form-label'>{t('state')} <RequiredField /></label>
                    <div className="col-md-6">
                        <select 
                            name="state" 
                            className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                            value={litigant.state}
                            disabled={ parseInt(petition.crime_registered) === 1 && '' && litigant.state !== '' }
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        >
                            <option value="">{t('alerts.select_state')}</option>
                            { states.map((item, index) => (
                            <option value={item.state_code} key={index}>{language === 'ta' ? item.state_lname : item.state_name}</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">{ errors.state }</div>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="district" className='col-sm-3 col-form-label'>{t('district')} <RequiredField /></label>
                    <div className="col-md-6">
                        <select 
                            name="district" 
                            className={`form-control ${errors.district ? 'is-invalid' : ''}`}
                            disabled={ parseInt(petition.crime_registered) === 1 && litigant.district !== ''}
                            value={litigant.district}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        >
                            <option value="">{t('alerts.select_district')}</option>
                            { districts.filter(d=>parseInt(litigant.state) === parseInt(d.state)).map((dist, index) => (
                                <option value={dist.district_code} key={index}>
                                    {language === 'ta' ? dist.district_lname : dist.district_name}
                                </option>
                            ))}
                        </select>
                        <div className="invalid-feedback">
                            { errors.district }
                        </div>
                    </div>                       
                </div>
                <div className="form-group row">
                    <label htmlFor="police_station" className='col-sm-3 col-form-label'>{t('police_station')}<RequiredField /></label><br />
                    <div className="col-md-6">
                        <select 
                            name="police_station" 
                            disabled={ parseInt(petition.crime_registered) === 1 && litigant.police_station !== ''}
                            className={`form-control ${errors.police_station ? 'is-invalid' : ''}`}
                            value={litigant.police_station}
                            onChange={(e)=> setLitigant({...litigant, [e.target.name]: e.target.value })}
                        >
                            <option value="">{t('alerts.select_station')}</option>
                            { policeStations.filter(d=>parseInt(d.revenue_district)=== parseInt(litigant.district)).map((item, index) => (
                                <option key={index} value={item.cctns_code}>{ language==='ta' ? item.station_lname : item.station_name}</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">
                            { errors.police_station }
                        </div>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="litigant_name" className="col-sm-3 col-form-label">{t('respondent_name')}<RequiredField /></label>
                    <div className="col-md-6">
                        <input
                            name="litigant_name"
                            value={litigant.litigant_name}
                            className={`form-control ${errors.litigant_name ? 'is-invalid' : ''}`}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                            readOnly={respondentPolice}
                        />
                        <div className="invalid-feedback">{ errors.litigant_name }</div>
                    </div>
                </div>
                <div className="form-group row">
                    <label className='col-sm-3 col-form-group'>{t('designation')} <RequiredField /></label>
                    <div className="col-md-6">
                        <select 
                            name="designation" 
                            className={`form-control ${errors.designation ? 'is-invalid' : ''}` }
                            value={litigant.designation}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        >
                            <option value="">{t('alerts.select_designation')}</option>
                            { designations.map((d, index) => (
                                <option key={index} value={d.id}>{language === 'ta' ? d.designation_lname : d.designation_name }</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">{ errors.designation }</div>
                    </div>
                </div>
             </React.Fragment>   
            )}
            <React.Fragment>
                <div className='form-group row'>
                    <label className='col-sm-3 col-form-label'>{t('mobile_number')}</label>
                    <div className="col-md-6">
                        <input 
                            type="text"
                            name="mobile_number" 
                            className={`form-control ${errors.mobile_number ? 'is-invalid' : ''}` }
                            value={litigant.mobile_number}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '')
                                if(value.length <=10){
                                    setLitigant({...litigant, [e.target.name]: value})
                                }
                            }}
                        />
                        <div className="invalid-feedback">{ errors.mobile_number }</div>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-3 col-form-label">{t('email_address')}</label>
                    <div className="col-md-6">
                        <input 
                            type="text"
                            name="email_address" 
                            className={`form-control ${errors.email_address ? 'is-invalid' : ''}` }
                            value={litigant.email_address}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        />
                        <div className="invalid-feedback">{ errors.email_address }</div>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-3 col-form-label">{t('address')} <RequiredField /></label>
                    <div className="col-md-6">
                        <textarea
                            rows={2}
                            name="address"
                            value={litigant.address}
                            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        ></textarea>
                        <div className="invalid-feedback">{ errors.address }</div>
                    </div>
                </div>
            </React.Fragment>
            <div className="row">
                <div className="col-md-12 d-flex justify-content-center">
                    <Button 
                        variant="secondary"
                        onClick={handleSubmit}>
                        <i className="fa fa-plus mr-2"></i>{t('add_respondent')}</Button>
                </div>
            </div>
        </React.Fragment>
    )
}

export default RespondentForm