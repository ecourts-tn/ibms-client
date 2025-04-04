import api from 'api'
import * as Yup from 'yup'
import React, {useState, useEffect, useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import {toast, ToastContainer} from 'react-toastify'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import { MasterContext } from 'contexts/MasterContext'
import { RequiredField } from 'utils'
import Loading from 'components/utils/Loading'
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";

const JudgeForm = () => {

    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    const {masters: {
        states,
        jdesignations
    }} = useContext(MasterContext)
    const navigate = useNavigate()
    const initialState = {
        judiciary: 1,
        state: '',
        judge_name: '',
        judge_lname: '',
        judge_sname:'',
        state_code: '',
        jocode: '',
        designation:'',
        joining_date:null,
        releiving_date:null
    }
    const [form, setForm] = useState(initialState)
    const [errors, setErrors] = useState({})
    const[loading, setLoading] = useState(false)
    const validationSchema = Yup.object({
        // state: Yup.string().required(),
        judge_name: Yup.string().required(),
        judge_lname: Yup.string().required(),
        jocode:Yup.string().required()
    })

    useEffect(() => {
        setForm((prevForm) => {
            if (parseInt(prevForm.judiciary) === 1) {
                return { ...prevForm, state_code: 'HC' };
            } else if (parseInt(prevForm.judiciary) === 2) {
                let stateCode = prevForm.state_code; // Preserve previous state_code
                if (parseInt(prevForm.state) === 33) stateCode = 'TN';
                else if (parseInt(prevForm.state) === 34) stateCode = 'PY';
    
                return { ...prevForm, state_code: stateCode };
            }
            return prevForm; // Return unchanged form if no condition matches
        });
    }, [form.judiciary, form.state]);

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
    
    const handleSubmit =  async(e) => {
        e.preventDefault();
        try{
            setLoading(true)
            await validationSchema.validate(form, {abortEarly:false})
            form.jocode = `${form.state_code}${form.jocode}`
            const response = await api.post("base/judge/", form)
            if(response.status === 201){
                toast.success("Judge details added successfully", {
                    theme:"colored"
                })
                setForm(initialState)
            }
        }catch(error){
            if(error.inner){
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
            }
        }finally{
            setLoading(false)
        }
    }


    return (
        <div className="card card-outline card-primary">
            { loading && <Loading />}
            <ToastContainer />
            <div className="card-header">
                <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>{t('judge_details')}</strong></h3>
                <button 
                    className="btn btn-primary btn-sm float-right"
                    onClick={() => navigate('/court/admin/judge/list/')}
                >Judges List</button>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group row mt-2 mb-3">
                            <div className="col-sm-4"></div>
                            <div className="col-md-8">
                                <div className="icheck-success d-inline mx-2">
                                    <input 
                                        type="radio" 
                                        name="judiciary" 
                                        id="judiciaryHC" 
                                        checked={parseInt(form.judiciary) === 1 }
                                        onChange={(e) => setForm({...form, [e.target.name] : 1})} 
                                    />
                                    <label htmlFor="judiciaryHC">High Court</label>
                                </div>
                                <div className="icheck-success d-inline mx-2">
                                    <input 
                                        type="radio" 
                                        id="judiciaryDC" 
                                        name="judiciary" 
                                        value={form.judiciary}
                                        checked={ parseInt(form.judiciary) === 2 } 
                                        onChange={(e) => setForm({...form, [e.target.name] : 2})}
                                    />
                                    <label htmlFor="judiciaryDC">District Judiciary</label>
                                </div>
                            </div>
                        </div>    
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-4">{t('judge_name')} <RequiredField /></label>
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
                            <label htmlFor="" className="col-sm-4">{t('judge_lname')}<RequiredField /></label>
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
                        { parseInt(form.judiciary) === 1 && (
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-4">Judge Short Name<RequiredField/></label>
                            <div className="col-sm-8">
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.judge_sname ? 'is-invalid' : ''}`}
                                    name="judge_sname"
                                    value={form.judge_sname}
                                    onChange={(e) => setForm({...form, [e.target.name] : e.target.value})}
                                />
                                <div className="invalid-feedback">
                                    { errors.judge_sname }
                                </div>
                            </div>
                        </div>    
                        )}
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-4">{ parseInt(form.judiciary) === 1 ? 'Honble ' : ''}Judge Code <RequiredField /></label>
                            <div className="col-md-3">
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.state_code ? 'is-invalid' : ''}`}
                                    name="state_code"
                                    value={form.state_code}
                                    readOnly={true}
                                    onChange={(e) => setForm({...form, [e.target.name] : e.target.value})}
                                />
                                <div className="invalid-feedback">
                                    { errors.state_code }
                                </div>
                            </div>
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
                        </div>
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-4">{t('designation')}<RequiredField /></label>
                            <div className="col-sm-8">
                                <select 
                                    name="designation" 
                                    className={`form-control ${errors.designation ? 'is-invalid' : ''}`}
                                    value={form.designation}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                >
                                    <option value="">Select Designation</option>
                                    {jdesignations.map((d, index) => (
                                    <option key={index} value={d.id}>{ language === 'ta' ? d.designation_lname : d.designation_name }</option>    
                                    ))}
                                </select>
                                <div className="invalid-feedback">
                                    { errors.designation }
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-4">Joining Date<RequiredField/></label>
                            <div className="col-sm-3">
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
                            <div className="col-sm-3">
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
                            <div className="col-sm-4">
                                <Button
                                    variant='contained'
                                    color='success'
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

export default JudgeForm