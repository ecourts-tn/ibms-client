import React, {useState, useEffect, useContext} from 'react'
import api from 'api'
import * as Yup from 'yup'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import { StateContext } from 'contexts/StateContext'
import { DistrictContext } from 'contexts/DistrictContext'
import { EstablishmentContext } from 'contexts/EstablishmentContext'
import { CourtContext } from 'contexts/CourtContext'
import {toast, ToastContainer} from 'react-toastify'
<<<<<<< HEAD
import Loading from 'components/Loading'
=======
import Loading from 'components/common/Loading'
>>>>>>> deena

const JudgePeriodForm = () => {

    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    const {states} = useContext(StateContext)
    const {districts} = useContext(DistrictContext)
    const {establishments} = useContext(EstablishmentContext)
    const {courts} = useContext(CourtContext)
    const initialState = {
        state: '',
        district: '',
        establishment: '',
        court: '',
        judge_name: '',
        judge_lname: '',
        jocode: '',
        joining_date: '',
        releiving_date: '0000-00-00',
        is_incharge: false
    }
    const [form, setForm] = useState(initialState)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const validationSchema = Yup.object({
        state: Yup.string().required(),
        district: Yup.string().required(),
        establishment: Yup.string().required(),
        court: Yup.string().required(),
        jocode: Yup.string().required(),
        judge_name: Yup.string().required(),
        judge_name: Yup.string().required(),
        joining_date: Yup.date().required(),
        // releiving_date: Yup.date().required(),
        is_incharge: Yup.boolean().required()
    })

    const searchJudicialOfficer = async() => {
        if(form.jocode === '' || form.jocode === null){
            toast.error("Please enter the correct J.O Code", {theme:"colored"})
            return
        }
        try{
            setLoading(true)
            const response = await api.post(`base/judge/search/`, {jocode: form.jocode})
            console.log(response.data)
            if(response.status === 200){
                setForm({
                    ...form,
                    judge_name: response.data.judge_name,
                    judge_lname: response.data.judge_lname
                })
            }
        }catch(error){
            console.error(error)
        }finally{
            setLoading(false)
        }
    }

    const handleSubmit = async() => {
        try{
            await validationSchema.validate(form, {abortEarly: false})
            const response = await api.post(`base/judge-period/`, form)
            if(response.status === 201){
                toast.success("Judge period added successfully", {theme:"colored"})
            }
        }catch(error){
            if(error.inner){
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
            }
            console.error(error)
        }
    }

    return (
        <div className="content-wrapper">
            <ToastContainer />
            { loading && <Loading />}
            <div className="container-fluid mt-3">
                <div className="card card-outline card-primary">
                    <div className="card-header">
                        <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>{t('judge_details')}</strong></h3>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <form>
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
                                                {courts.filter(c => c.establishment === form.establishment).map((c, index) => (
                                                <option key={index} value={c.court_code}>{ language === 'ta' ? c.court_lname : c.court_name }</option>    
                                                ))}
                                            </select>
                                            <div className="invalid-feedback">
                                                { errors.court }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">{t('jocode')}</label>
                                        <div className="col-sm-4">
                                            <input 
                                                type="text" 
                                                className={`form-control ${errors.jocode ? 'is-invalid' : ''}`} 
                                                name="jocode"
                                                value={form.jocode}
                                                onChange={(e) => setForm({...form, [e.target.name] : e.target.value})}
                                            />
                                            <div className="invalid-feedback">
                                                { errors.jocode }
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <Button
                                                variant='contained'
                                                color='primary'
                                                onClick={searchJudicialOfficer}
                                            >
                                                Search
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">{t('judge_name')}</label>
                                        <div className="col-sm-8">
                                            <input 
                                                type="text" 
                                                className={`form-control ${errors.judge_name ? 'is-invalid' : ''}`}
                                                name="judge_name"
                                                value={form.judge_name}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            />
                                            <div className="invalid-feedback">
                                                { errors.judge_name }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">{t('judge_lname')}</label>
                                        <div className="col-sm-8">
                                            <input 
                                                type="text" 
                                                className={`form-control ${errors.judge_lname ? 'is-invalid' : ''}`}
                                                name="judge_lname"
                                                value={form.judge_lname}
                                                onChange={(e) => setForm({...form, [e.target.name] : e.target.value})}
                                            />
                                            <div className="invalid-feedback">
                                                { errors.judge_lname }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">Joining Date</label>
                                        <div className="col-sm-8">
                                            <input 
                                                type="date" 
                                                className={`form-control ${form.joining_date ? 'is-invalid' : ''}`} 
                                                name="joining_date"
                                                value={form.joining_date}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            />
                                            <div className="invalid-feedback">
                                                { errors.joining_date }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">Releiving Date</label>
                                        <div className="col-sm-8">
                                            <input 
                                                type="date" 
                                                className={`form-control ${form.releiving_date ? 'is-invalid' : ''}`}
                                                name="releiving_date"
                                                value={form.releiving_date}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            />
                                            <div className="invalid-feedback">
                                                { errors.releiving_date }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-md-6">
                                            <div class="icheck-primary d-inline">
                                                <input 
                                                    type="checkbox" 
                                                    id="isInchargeCheckbox" 
                                                    name="is_incharge"
                                                    value={form.is_incharge} 
                                                    checked={form.is_incharge}
                                                    onChange={(e) => setForm({...form, [e.target.name]: !form.is_incharge})}
                                                />
                                                <label for="isInchargeCheckbox">Incharge?
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <Button
                                            variant='contained'
                                            color='success'
                                            onClick={handleSubmit}
                                        >{t('submit')}</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JudgePeriodForm