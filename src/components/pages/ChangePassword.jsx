import React, {useState} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import * as Yup from 'yup'
import api from 'api'
import { useTranslation } from 'react-i18next'

const ChangePassword = () => {

    const initialState = {
        old_password    : '',
        new_password    : '',
        confirm_password: ''
    }
    const[form, setForm] = useState(initialState)
    const[errors, setErrors] = useState({})
    const {t} = useTranslation()

    const validationSchema = Yup.object({
        old_password: Yup.string().required(t('errors.old_password_required')),
        new_password: Yup.string().required(t('errors.password_required')),
        confirm_password: Yup.string().required(t('errors.cpassword_required')).oneOf([Yup.ref('new_password'), null], 'Passwords must match')
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            await validationSchema.validate(form, {abortEarly:false})
            const response = await api.post("api/auth/change-password/", form)
            switch(response.response.status){
                case 400:
                    toast.error(response.response.data.message, {theme: "colored"})
                    break;
                case 200:
                    toast.success(response.response.data.message, {theme:"colored"})
                    setForm(initialState)
                    break;
                case 404:
                    toast.error(response.response.data.message, {theme:"colored"})
                    break;
            }    
        }catch(error){
            if(error.inner){
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                });
                setErrors(newErrors)
            }
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="container-fluid px-5 my-4" style={{minHeight:'500px'}}>
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb" className="mt-2 mb-1">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item text-primary">{t('home')}</li>
                                <li className="breadcrumb-item text-primary">{t('authentication')}</li>
                                <li className="breadcrumb-item active" aria-current="page">{t('change_password')}</li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-md-4">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="old-password">{t('current_password')}</label>
                                <input 
                                    type="password" 
                                    className={`form-control ${errors.old_password ? 'is-invalid' : null}`}
                                    name="old_password"
                                    value={form.old_password}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                />
                                <div className="invalid-feedback">
                                    { errors.old_password }
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="new-password">{t('new_password')}</label>
                                <input 
                                    type="password" 
                                    className={`form-control ${errors.new_password ? 'is-invalid' : null}`}
                                    name="new_password"
                                    value={form.new_password}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                />
                                <div className="invalid-feedback">
                                    { errors.new_password }
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirm-password">{t('confirm_password')}</label>
                                <input 
                                    type="password" 
                                    className={`form-control ${errors.confirm_password ? 'is-invalid' : null}`}
                                    name="confirm_password"
                                    value={form.confirm_password}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                />
                                <div className="invalid-feedback">
                                    { errors.confirm_password }
                                </div>
                            </div>
                            <button type="submit" className="btn btn-success">{t('change_password')}</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChangePassword