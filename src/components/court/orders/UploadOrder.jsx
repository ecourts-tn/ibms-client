import api from 'api'
<<<<<<< HEAD
import Loading from 'components/Loading'
=======
import Loading from 'components/common/Loading'
>>>>>>> deena
import { CaseTypeContext } from 'contexts/CaseTypeContext'
import { LanguageContext } from 'contexts/LanguageContex'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {toast, ToastContainer} from 'react-toastify'
import Button from '@mui/material/Button'
import * as Yup from 'yup'

const UploadOrder = () => {

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
    const[orders, setOrders] = useState([])
    const[errors, setErrors] = useState({})
    const[loading, setLoading] = useState(false)
    const validationSchema = Yup.object({
        case_type: Yup.string().required(),
        case_number: Yup.string().required(),
        case_year:Yup.string().required()
    })

    const handleSearch = async() => {
        try{
            setLoading(true)
            const response = await api.post(``, form)
            if(response.status === 200){
                setOrders(response.data)
            }
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    const handleSubmit = async() => {
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

    const handleDelete = async() => {
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
                        <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>{t('upload_order')}</strong></h3>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            { Object.keys(orders).length > 1 && (
                                <div className="col-md-12">
                                    <OrderList orders={orders} handleDelete={handleDelete}/>
                                </div>
                            )}
                            <div className="col-md-6">
                                <form onSubmit={handleSubmit}>
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
                                                <option key={index} value={t.type_code}>{ language === 'ta' ? t.type_lfull_form : t.type_full_form }</option>    
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
                                                className={`form-control ${form.case_year ? 'is-invalid' : ''}`}
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
                                        <Button
                                            variant='contained'
                                            color='primary'
                                            type="submit"
                                            onClick={handleSearch}
                                        >{t('search')}</Button>
                                    </div>
                                    <div className="form-group row">
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

export default UploadOrder


const OrderList = ({orders, handleDelete}) => {
    return(
        <table className="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Order Number</th>
                    <th>Order Date</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
            { orders.map((o, index) => (
                <tr>
                    <td>{ index+1 }</td>
                    <td>{ o.order_number }</td>
                    <td>{ o.order_date }</td>
                    <td>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}
