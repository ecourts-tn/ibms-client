import api from 'api'
import Loading from 'components/Loading'
import { CaseTypeContext } from 'contexts/CaseTypeContext'
import { LanguageContext } from 'contexts/LanguageContex'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {toast, ToastContainer} from 'react-toastify'
import Button from '@mui/material/Button'
import * as Yup from 'yup'
import GenerateStyledDocx from './HtmlToDocx'

const GenerateOrder = () => {

    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    const {casetypes} = useContext(CaseTypeContext)
    const initialState = {
        district: '',
        establishment: '',
        court: '',
        case_type: '',
        case_number:'',
        case_year:''
    }
    const[form, setForm] = useState(initialState)
    const[order, setOrder] = useState({})
    const[errors, setErrors] = useState({})
    const[loading, setLoading] = useState(false)
    const validationSchema = Yup.object({
        case_type: Yup.string().required(),
        case_number: Yup.string().required(),
        case_year:Yup.string().required()
    })

    const handleSearch = async(e) => {
        e.preventDefault()
        try{
            setLoading(true)
            const response = await api.post(`court/petition/detail/`, form)

            if(response.status === 200){
                setOrder(response.data)
            }
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        try{
            setLoading(true)
            await validationSchema.validate(form, {abortEarly:false})
            const response = api.post(``, form)
            if(response.status === 201){
                toast.success("Order uploaded successfully", {theme:"colored"})
            }
        }catch(error){
            if(error.inner){
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
            }
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    const handleGenerate = async() => {
        try{
            setLoading(true)
            const response = await api.delete(``, {
                data: {

                }
            })
            if(response.status === 204){
                toast.error("Order deleted successfully", {theme:"colored"})
            }
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className="content-wrapper">
            <ToastContainer />
            { loading && <Loading />}
            <div className="container-fluid mt-3">
                <div className="card card-outline card-primary">
                    <div className="card-header">
                        <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>{t('genrate_order')}</strong></h3>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <form>
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">Select Casetype</label>
                                        <div className="col-sm-8">
                                            <select 
                                                name="case_type" 
                                                className={`form-control ${errors.case_type ? 'is-invalid' : ''}`}
                                                value={form.case_type}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            >
                                                <option value="">{t('alerts.select_case_type')}</option>
                                                {casetypes.map((t, index) => (
                                                <option key={index} value={t.id}>{ language === 'ta' ? t.type_lfull_form : t.type_full_form }</option>    
                                                ))}
                                            </select>
                                            <div className="invalid-feedback">
                                                { errors.case_type }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">Case Number</label>
                                        <div className="col-sm-8">
                                            <input 
                                                type="text" 
                                                className={`form-control ${errors.case_number ? 'is-invalid' : ''}`}
                                                name="case_number"
                                                value={form.case_number}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            />
                                            <div className="invalid-feedback">
                                                { errors.case_number }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-4">Year</label>
                                        <div className="col-sm-8">
                                            <input 
                                                type="text" 
                                                className={`form-control ${errors.case_year ? 'is-invalid' : ''}`}
                                                name="case_year"
                                                value={form.case_year}
                                                onChange={(e) => setForm({...form, [e.target.name] : e.target.value})}
                                            />
                                            <div className="invalid-feedback">
                                                { errors.case_year }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-md-4 offset-md-4">
                                            <Button
                                                variant='contained'
                                                color='primary'
                                                type="submit"
                                                onClick={handleSearch}
                                            >{t('submit')}</Button>
                                        </div>
                                    </div>
                                    <div className="form-group row mt-5">
                                        <div className="col-md-4 offset-md-4">
                                            { Object.keys(order).length > 0 && (
                                                <GenerateStyledDocx order={order}/>
                                            )}
                                        </div>
                                    </div>
                                    {/* <div className="form-group row">
                                        <label htmlFor="" className='col-sm-4'>Select document</label>
                                        <div className="col-md-8">
                                            <input 
                                                type="file" 
                                                className="form-control" 
                                            />
                                            <div className="invalid-feedback">
                                                
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <Button
                                            variant='contained'
                                            color='success'
                                            type="submit"
                                            onClick={handleGenerate}
                                        >{t('generate_order')}</Button>
                                    </div> */}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default GenerateOrder

