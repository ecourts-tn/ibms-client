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

const BenchForm = () => {

    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
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
    const [judges, setJudges] = useState([])
    const [errors, setErrors] = useState({})
    const[loading, setLoading] = useState(false)
    const validationSchema = Yup.object({
        // state: Yup.string().required(),
        judge_name: Yup.string().required(),
        judge_lname: Yup.string().required(),
        jocode:Yup.string().required()
    })
    const [selectedJudges, setSelectedJudges] = useState([]);

    const handleJudgeSelection = (e) => {
        if (e.target.type === "checkbox") {
            const judgeId = parseInt(e.target.id.split("-")[1]); // Extract index
            if (e.target.checked) {
                setSelectedJudges((prev) => [...prev, judges[judgeId].id]); 
            } else {
                setSelectedJudges((prev) => prev.filter(id => id !== judges[judgeId].id));
            }
        }
    };

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

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get("base/judge/")
                if(response.status === 200){
                    setJudges(response.data)
                }
            }catch(err){
                console.log(err)
            }
        }
        fetchData();
    },[])



    const handleSubmit =  async(e) => {
        e.preventDefault();
        try{
            setLoading(true)
            await validationSchema.validate(form, {abortEarly:false})
            // form.jocode = `${form.state_code}${form.jocode}`
            const updatedForm = { 
                ...form, 
                selected_judges: selectedJudges 
            };
            console.log("Submitting Data: ", updatedForm);
            const response = await api.post("base/judge/", updatedForm);
            if(response.status === 201){
                toast.success("Judge details added successfully", {
                    theme:"colored"
                })
                setForm(initialState);
                setSelectedJudges([]);
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
                <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>New Bench</strong></h3>
                <button 
                    className="btn btn-primary btn-sm float-right"
                    onClick={() => navigate('/court/admin/bench/list/')}
                >Bench List</button>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-4">Bench Code<RequiredField/></label>
                            <div className="col-sm-8">
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.bench_code ? 'is-invalid' : ''}`}
                                    name="bench_code"
                                    value={form.bench_code}
                                    onChange={(e) => setForm({...form, [e.target.name] : e.target.value})}
                                />
                                <div className="invalid-feedback">
                                    { errors.bench_code }
                                </div>
                            </div>
                        </div>    
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-4">Bench Name <RequiredField /></label>
                            <div className="col-sm-8">
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.bench_name ? 'is-invalid' : ''}`}
                                    name="bench_name"
                                    value={form.bench_name}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                />
                                <div className="invalid-feedback">
                                    { errors.bench_name }
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-4">Joining Date<RequiredField/></label>
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
                            <label htmlFor="" className="col-sm-4">Select Judge(s)</label>
                            <div className="col-md-8" onChange={handleJudgeSelection}>
                                { judges.filter((j) => j.judiciary === 1).map((j, index) => (
                                    <div key={index} className="d-flex align-items-center">
                                        <input type="checkbox" id={`judge-${index}`} />
                                        <span htmlFor={`judge-${index}`} className="ml-2">{j.judge_name} - {j.designation}</span>
                                    </div>
                                ))}
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

export default BenchForm 