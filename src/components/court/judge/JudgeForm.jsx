import React, {useState, useEffect, useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import api from 'api'
import {toast, ToastContainer} from 'react-toastify'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import { StateContext } from 'contexts/StateContext'

const JudgeForm = () => {

    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    const {states} = useContext(StateContext)
    const navigate = useNavigate()
    const initialState = {
        state: '',
        judge_name: '',
        judge_lname: '',
        jocode: ''
    }
    const [form, setForm] = useState(initialState)

    const handleSubmit =  async(e) => {
        e.preventDefault();
        try{
            const response = await api.post("base/judge/", form)
            if(response.status === 201){
                toast.success("Judge details added successfully", {
                    theme:"colored"
                })
                setForm(initialState)
            }
        }catch(error){
            setForm(initialState)
        }
    }

    return (
        <div className="content-wrapper">
            <ToastContainer />
            <div className="container-fluid mt-3">
                <div className="card card-outline card-primary">
                    <div className="card-header">
                        <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>{t('judge_details')}</strong></h3>
                        <button 
                            className="btn btn-primary btn-sm float-right"
                            onClick={() => navigate('/ibms/court/admin/judge/list/')}
                        >Judges List</button>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">{t('state')}</label>
                                        <div className="col-sm-8">
                                            <select 
                                                name="state" 
                                                className="form-control"
                                                value={form.state}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            >
                                                <option value="">{t('alerts.select_state')}</option>
                                                {states.map((s, index) => (
                                                <option key={index} value={s.state_code}>{ language === 'ta' ? s.state_lname : s.state_name }</option>    
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">{t('judge_name')}</label>
                                        <div className="col-sm-8">
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="judge_name"
                                                value={form.judge_name}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">{t('judge_lname')}</label>
                                        <div className="col-sm-8">
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="judge_lname"
                                                value={form.judge_lname}
                                                onChange={(e) => setForm({...form, [e.target.name] : e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">{t('jocode')}</label>
                                        <div className="col-sm-8">
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="jocode"
                                                value={form.jocode}
                                                onChange={(e) => setForm({...form, [e.target.name] : e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <Button
                                            variant='contained'
                                            color='success'
                                            type="submit"
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

export default JudgeForm