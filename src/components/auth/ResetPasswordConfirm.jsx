import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "api";
import { useTranslation } from "react-i18next";
import { toast, ToastContainer} from 'react-toastify'
import Loading from "components/utils/Loading";
import * as Yup from 'yup';

const ResetPasswordConfirm = () => {
    const { uid, token } = useParams();
    const {t} = useTranslation()
    const[loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const [form, setForm] = useState({
        password: '',
        cpassword: ''
    })
    const [errors, setErrors] = useState({})
    const validationSchema = Yup.object({
        password: Yup.string().required('Password is required'),
        cpassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match").required("Confirm Password is required"),
    })


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            await validationSchema.validate(form, { abortEarly:false})
            const response = await api.post("auth/reset-password/confirmation/", {
                uid,
                token,
                new_password: form.password,
            });
            if(response.status === 200){
                // setPassword('')
                toast.success("Password reset successful!", {theme:"colored"});
                setTimeout(()=>{
                    navigate('/')
                }, 2000)
            }
        } catch (error) {
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
    };

    return (
        <>
            { loading && <Loading />}
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
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="form-group">
                            <label htmlFor="password">{t('password')}<span className="text-danger ml-1">*</span></label>
                            <input 
                                type="password" 
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                name="password"
                                value={form.password}
                                onChange={(e) => setForm({...form, [e.target.name]:e.target.value})}
                            />
                            <div className="invalid-feedback">
                                { errors.password}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="form-group">
                            <label htmlFor="password">{t('confirm_password')}<span className="text-danger ml-1">*</span></label>
                            <input 
                                type="password" 
                                className={`form-control ${errors.cpassword ? 'is-invalid' : ''}`}
                                name="cpassword"
                                value={form.cpassword}
                                onChange={(e) => setForm({...form, [e.target.name]:e.target.value})}
                            />
                            <div className="invalid-feedback">
                                { errors.cpassword}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <button 
                            className="btn btn-primary"
                            onClick={handleSubmit}
                        >{t('reset')}</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResetPasswordConfirm;
