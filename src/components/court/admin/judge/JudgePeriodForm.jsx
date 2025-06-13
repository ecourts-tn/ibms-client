import React, {useState, useEffect, useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import api from 'api'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import { EstablishmentContext } from 'contexts/EstablishmentContext'
import { CourtContext } from 'contexts/CourtContext'
import {toast, ToastContainer} from 'react-toastify'
import Loading from 'components/utils/Loading'
import { MasterContext } from 'contexts/MasterContext'
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";
import { Button } from 'react-bootstrap'
import { AuthContext } from 'contexts/AuthContext'
import DatePicker from 'components/utils/DatePicker';
import { RequiredField } from 'utils'


const JudgePeriodForm = () => {

    const {t} = useTranslation()
    const navigate = useNavigate()
    const {language} = useContext(LanguageContext)
    const {masters:{
        states,
        districts
    }} = useContext(MasterContext)
    const {establishments} = useContext(EstablishmentContext)
    const {courts} = useContext(CourtContext)
    const { user } = useContext(AuthContext)
    const initialState = {
        state: '',
        district: '',
        establishment: '',
        court: '',
        judge_name: '',
        judge_lname: '',
        jocode: '',
        joining_date: '',
        releiving_date: '',
        is_incharge: false
    }
    const [form, setForm] = useState(initialState)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const validationSchema = Yup.object({
        state: Yup.string().required(t('errors.state_required')),
        district: Yup.string().required(t('errors.district_required')),
        establishment: Yup.string().required(t('errors.establishment_required')),
        court: Yup.string().required(t('errors.court_required')),
        jocode: Yup.string().required('JO code is required'),
        judge_name: Yup.string().required('Judge name is required'),
        judge_lname: Yup.string().required('Judge name (Tamil) is required '),
        joining_date: Yup.date()
            .typeError('Joining date must be a valid date')    
            .required(),
        releiving_date: Yup.date()
            .nullable() // allows null or empty
            .typeError('Releiving date must be a valid date') // if invalid date (like text), show this error
            .notRequired(), 
        is_incharge: Yup.boolean().required()
    })

    useEffect(() => {
        if(user){
            setForm({...form,
                state: user.district?.state || '',
                district: user.district?.district_code || '',
                establishment: user.establishment?.establishment_code || '',
                court: user.court?.court_code || '',
            })
        }
    },[])

    const searchJudicialOfficer = async() => {
        if(form.jocode === '' || form.jocode === null){
            toast.error("Please enter the correct J.O Code", {theme:"colored"})
            return
        }
        try{
            setLoading(true)
            const response = await api.post(`base/judge/search/`, {jocode: form.jocode})
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

    const handleDateChange = (field, value) => {
        setForm((prev) => ({
          ...prev,
          [field]: value,
        }));
    };

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
        <div className="card card-outline card-primary">
            <ToastContainer />
            { loading && <Loading />}
            <div className="card-header">
                <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>{t('judge_period')}</strong></h3>
                <Button 
                    className="btn-sm float-right"
                    variant="primary"
                    onClick={() => navigate('/court/admin/judge/period/list/')}
                > <i className="fa fa-list mr-1"></i>
                    View List</Button>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-4">{t('jocode')} <RequiredField/></label>
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
                            <div className="col-sm-3">
                                <button 
                                    className="btn btn-info"
                                    onClick={searchJudicialOfficer}
                                > <i className="fa fa-search mr-1"></i>
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-4">{t('judge_name')}<RequiredField/></label>
                            <div className="col-sm-8">
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.judge_name ? 'is-invalid' : ''}`}
                                    name="judge_name"
                                    value={form.judge_name}
                                    readOnly={true}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                />
                                <div className="invalid-feedback">
                                    { errors.judge_name }
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-4">{t('judge_lname')}<RequiredField/></label>
                            <div className="col-sm-8">
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.judge_lname ? 'is-invalid' : ''}`}
                                    name="judge_lname"
                                    readOnly={true}
                                    value={form.judge_lname}
                                    onChange={(e) => setForm({...form, [e.target.name] : e.target.value})}
                                />
                                <div className="invalid-feedback">
                                    { errors.judge_lname }
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-4">{t('state')}<RequiredField/></label>
                            <div className="col-sm-8">
                                <select 
                                    name="state" 
                                    className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                                    value={form.state}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    disabled={true}
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
                            <label htmlFor="" className="col-sm-4">{t('district')}<RequiredField/></label>
                            <div className="col-sm-8">
                                <select 
                                    name="district" 
                                    className={`form-control ${errors.district ? 'is-invalid' : ''}`}
                                    value={form.district}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    disabled={true}
                                >
                                    <option value="">{t('alerts.select_district')}</option>
                                    {districts.filter(d => parseInt(d.state) === parseInt(form.state)).map((d, index) => (
                                    <option key={index} value={d.district_code}>{ language === 'ta' ? d.district_lname : d.district_name }</option>    
                                    ))}
                                </select>
                                <div className="invalid-feedback">{ errors.district }</div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-4">{t('est_name')}<RequiredField/></label>
                            <div className="col-sm-8">
                                <select 
                                    name="establishment" 
                                    className={`form-control ${errors.establishment ? 'is-invalid' : ''}`}
                                    value={form.establishment}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    disabled={true}
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
                            <label htmlFor="" className="col-sm-4">{t('court')}<RequiredField/></label>
                            <div className="col-sm-8">
                                <select 
                                    name="court" 
                                    className={`form-control ${errors.court ? 'is-invalid' :''}`}
                                    value={form.court}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    disabled={true}
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
                            <label htmlFor="" className="col-sm-4">Joining Date<RequiredField/></label>
                            <div className="col-sm-8">
                                <DatePicker 
                                    name="joining_date"
                                    value={form.joining_date}
                                    onChange={handleDateChange}
                                    error={errors.joining_date ? true : false}
                                />
                                <div className="invalid-feedback">{errors.joining_date}</div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-4">Releiving Date</label>
                            <div className="col-sm-8">
                                <DatePicker 
                                    name="releiving_date"
                                    value={form.releiving_date}
                                    onChange={handleDateChange}
                                    error={errors.releiving_date ? true : false}
                                />
                                <div className="invalid-feedback">{errors.releiving_date}</div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-4"></div>
                            <div className="col-md-6">
                                <div className="icheck-primary d-inline">
                                    <input 
                                        type="checkbox" 
                                        id="isInchargeCheckbox" 
                                        name="is_incharge"
                                        value={form.is_incharge} 
                                        checked={form.is_incharge}
                                        onChange={(e) => setForm({...form, [e.target.name]: !form.is_incharge})}
                                    />
                                    <label htmlFor="isInchargeCheckbox">Incharge?
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-4"></div>
                            <div className="col-sm-4">
                                <Button
                                    variant='success'
                                    onClick={handleSubmit}
                                >{t('submit')}</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JudgePeriodForm