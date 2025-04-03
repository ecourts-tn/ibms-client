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
        <div className="content-wrapper">
            { loading && <Loading />}
            <ToastContainer />
            <div className="container-fluid mt-3">
                <div className="card card-outline card-primary">
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
                                <form>
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
                                        <label htmlFor="" className="col-sm-4">Bench Name (Tamil)<RequiredField /></label>
                                        <div className="col-sm-8">
                                            <input 
                                                type="text" 
                                                className={`form-control ${errors.bench_lname ? 'is-invalid' : ''}`}
                                                name="bench_lname"
                                                value={form.bench_lname}
                                                onChange={(e) => setForm({...form, [e.target.name] : e.target.value})}
                                            />
                                            <div className="invalid-feedback">
                                                { errors.bench_lname }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">Joining Date<RequiredField/></label>
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
                                        <label htmlFor="" className="col-sm-4">Select Judge(s)</label>
                                        <div className="col-md-8">
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
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BenchForm