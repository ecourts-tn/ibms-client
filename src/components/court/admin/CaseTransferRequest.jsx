import api from 'api'
import * as Yup from 'yup'
import { LanguageContext } from 'contexts/LanguageContex'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {toast, ToastContainer} from 'react-toastify'
import Button from '@mui/material/Button'
import { StateContext } from 'contexts/StateContext'
import { DistrictContext } from 'contexts/DistrictContext'
import { EstablishmentContext } from 'contexts/EstablishmentContext'
import { CourtContext } from 'contexts/CourtContext'

const CaseTransferRequest = () => {

    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    const {states} = useContext(StateContext)
    const {districts} = useContext(DistrictContext)
    const {establishments} = useContext(EstablishmentContext)
    const {courts} = useContext(CourtContext)
    const initialState = {
        efile_no: '',
        state: '',
        district: '',
        establishment: '',
        court: ''
    }
    const [form, setForm] = useState(initialState)
    const [errors, setErrors] = useState({})    
    const [loading, setLoading] = useState(false)
    const [petition, setPetition] = useState({})

    const validationSchema = Yup.object({

    })

    const handleSearch = async() => {
        try{
            setLoading(true)
            const response = await api.post(``, form)
            if(response.status === 200){
                setPetition(response.data)
            }
        }catch(error){
            if(error.inner){
                const newErrors = {}
                error.inner.forEach((err) => (
                    newErrors[err.path] = err.message
                ))
                setErrors(newErrors)
            }
            console.error(error)
        }finally{
            setLoading(false)
        }
    }

    const handleSubmit = async() => {
        try{
            setLoading(true)
            await validationSchema.validate(form, {abortEarly: false})
            const response = await api.post(``, form)
            if(response.status === 201){
                toast.success("Transfer request submitted successfully", { theme: "colored"})
            }
        }catch(error){

        }finally{
            setLoading(false)
        }
    }

    return (
        <div className="content-wrapper">
            <ToastContainer />
            <div className="container-fluid mt-3">
                <div className="card card-outline card-primary">
                    <div className="card-header">
                        <h3 className="card-title">
                            <i className="fas fa-edit mr-2"></i><strong>Case Transfer Request</strong>
                        </h3>
                    </div>
                    <div className="card-body">
                        <form action="">
                            <div className="row">
                                <div className="col-md-8 offset-md-2">
                                    <div className="form-group row">
                                        <div className="col-sm-10">
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="efile_no"
                                                value={form.efile_no}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            />
                                        </div>
                                        <div className="col-sm-2">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleSearch}
                                            >
                                                Search
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">{t('state')}</label>
                                        <div className="col-sm-8">
                                            <select 
                                                name="state" 
                                                className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                                                value={form.state}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            >
                                                <option value="">{t('alerts.select_state')}</option>
                                                {states.map((s, index) => (
                                                <option key={index} value={s.state_code}>{ language === 'ta' ? s.state_lname : s.state_name }</option>    
                                                ))}
                                            </select>
                                            <div className="invalid-feedback">
                                                { errors.state }
                                            </div>
                                        </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="" className="col-sm-4">{t('district')}</label>
                                <div className="col-sm-8">
                                    <select 
                                        name="district" 
                                        className={`form-control ${errors.district ? 'is-invalid' : ''}`}
                                        value={form.district}
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">{t('alerts.select_district')}</option>
                                        {districts.filter(d => parseInt(d.state) === parseInt(form.state)).map((d, index) => (
                                        <option key={index} value={d.district_code}>{ language === 'ta' ? d.district_lname : d.district_name }</option>    
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">
                                        { errors.district }
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="" className="col-sm-4">{t('est_name')}</label>
                                <div className="col-sm-8">
                                    <select 
                                        name="establishment" 
                                        className={`form-control ${errors.establishment ? 'is-invalid' : ''}`}
                                        value={form.establishment}
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">{t('alerts.select_establishment')}</option>
                                        {establishments.filter(e => parseInt(e.district) === parseInt(form.district)).map((e, index) => (
                                        <option key={index} value={e.establishment_code}>{ language === 'ta' ? e.establishment_lname : e.establishment_name }</option>    
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">
                                        { errors.establishment }
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="" className="col-sm-4">{t('court')}</label>
                                <div className="col-sm-8">
                                    <select 
                                        name="court" 
                                        className={`form-control ${errors.court ? 'is-invalid' :''}`}
                                        value={form.court}
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">{t('alerts.select_court')}</option>
                                        {courts.filter(c => parseInt(c.establishment) === parseInt(form.establishment)).map((c, index) => (
                                        <option key={index} value={c.court_code}>{ language === 'ta' ? c.court_lname : c.court_name }</option>    
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">
                                        { errors.court }
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CaseTransferRequest
