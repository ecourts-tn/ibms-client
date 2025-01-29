import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "api";
import { useTranslation } from "react-i18next";
import { toast, ToastContainer} from 'react-toastify'
import Loading from "components/common/Loading";

const ResetPasswordConfirm = () => {
    const { uid, token } = useParams();
    const [password, setPassword] = useState("");
    const {t} = useTranslation()
    const[loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const response = await api.post("auth/reset-password/confirmation/", {
                uid,
                token,
                new_password: password,
            });
            if(response.status === 200){
                setPassword('')
                toast.success("Password reset successful!", {theme:"colored"});
                setTimeout(()=>{
                    navigate('/')
                }, 2000)
            }
        } catch (error) {
            toast.error("Reset failed, try again!", {theme:"colored"});
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
                            <label htmlFor="password">{t('password')}</label>
                            <input 
                                type="password" 
                                className="form-control"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="invalid-feedback">

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
