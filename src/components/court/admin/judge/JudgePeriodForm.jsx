import React, {useState, useEffect, useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import api from 'api'
import * as Yup from 'yup'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import { EstablishmentContext } from 'contexts/EstablishmentContext'
import { CourtContext } from 'contexts/CourtContext'
import {toast, ToastContainer} from 'react-toastify'
import Loading from 'components/utils/Loading'
import { MasterContext } from 'contexts/MasterContext'
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";

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
        state: Yup.string().required(),
        district: Yup.string().required(),
        establishment: Yup.string().required(),
        court: Yup.string().required(),
        jocode: Yup.string().required(),
        judge_name: Yup.string().required(),
        judge_name: Yup.string().required(),
        joining_date: Yup.date().required(),
        releiving_date: Yup.date().required(),
        is_incharge: Yup.boolean().required()
    })

    const joining_date_Display = (date) => {
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    
    const joining_date_Backend = (date) => {
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    };
    
    useEffect(() => {
        const joining_date = flatpickr(".joining_date-date-picker", {
            dateFormat: "d-m-Y",
            maxDate: "today",
            defaultDate: form.joining_date ? joining_date_Display(new Date(form.joining_date)) : '',
            onChange: (selectedDates) => {
                const formattedDate = selectedDates[0] ? joining_date_Backend(selectedDates[0]) : "";
                setForm({ ...form, joining_date: formattedDate });
            },
        });

        return () => {
            if (joining_date && typeof joining_date.destroy === "function") {
                joining_date.destroy();
            }
        };
    }, [form]);

    const releiving_date_Display = (date) => {
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    
    const releiving_date_Backend = (date) => {
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    };
    
    useEffect(() => {
        const releiving_date = flatpickr(".releiving_date-date-picker", {
            dateFormat: "d-m-Y",
            // maxDate: "today",
            defaultDate: form.releiving_date ? releiving_date_Display(new Date(form.releiving_date)) : '',
            onChange: (selectedDates) => {
                const formattedDate = selectedDates[0] ? releiving_date_Backend(selectedDates[0]) : "";
                setForm({ ...form, releiving_date: formattedDate });
            },
        });

        return () => {
            if (releiving_date && typeof releiving_date.destroy === "function") {
                releiving_date.destroy();
            }
        };
    }, [form]);

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
                <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>{t('judge_details')}</strong></h3>
                <button 
                    className="btn btn-primary btn-sm float-right"
                    onClick={() => navigate('/court/admin/judge/period/list/')}
                >Judges Period List</button>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-6">
                        <form>
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
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">{t('judge_name')}</label>
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
                                        <label htmlFor="" className="col-sm-4">{t('judge_lname')}</label>
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
                                        <label htmlFor="" className="col-sm-4">Joining Date</label>
                                        <div className="col-sm-8">
                                            <input 
                                                type="date" 
                                                className={`form-control joining_date-date-picker ${errors.joining_date ? 'is-invalid' : ''}`} 
                                                name="joining_date"
                                                value={form.joining_date ? form.joining_date : ''}
                                                placeholder="DD-MM-YYYY"
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    border: '1px solid #ccc', 
                                                    padding: '8px',            
                                                }}
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
                                                className={`form-control releiving_date-date-picker ${errors.releiving_date ? 'is-invalid' : ''}`}
                                                name="releiving_date"
                                                value={form.releiving_date ? form.joining_date : ''}
                                                placeholder="DD-MM-YYYY"
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    border: '1px solid #ccc', 
                                                    padding: '8px',            
                                                }}
                                            />
                                            <div className="invalid-feedback">
                                                { errors.releiving_date }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-4"></div>
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
                                        <div className="col-sm-4"></div>
                                        <div className="col-sm-4">
                                            <Button
                                                variant='contained'
                                                color='success'
                                                onClick={handleSubmit}
                                            >{t('submit')}</Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="" className="col-sm-4">{t('judge_name')}</label>
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
                                <label htmlFor="" className="col-sm-4">{t('judge_lname')}</label>
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
                                <label htmlFor="" className="col-sm-4">Joining Date</label>
                                <div className="col-sm-8">
                                    <input 
                                        type="date" 
                                        className={`form-control ${errors.joining_date ? 'is-invalid' : ''}`} 
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
                                        className={`form-control ${errors.releiving_date ? 'is-invalid' : ''}`}
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
                                <div className="col-sm-4"></div>
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
                                <div className="col-sm-4"></div>
                                <div className="col-sm-4">
                                    <Button
                                        variant='contained'
                                        color='success'
                                        onClick={handleSubmit}
                                    >{t('submit')}</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JudgePeriodForm