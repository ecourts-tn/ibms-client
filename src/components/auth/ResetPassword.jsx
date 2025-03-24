import React, {useState} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import * as Yup from 'yup'
import api from 'api'
import { useTranslation } from 'react-i18next'
import Loading from 'components/common/Loading'

const ResetPassword = () => {

    const[email, setEmail] = useState('')
    const[loading, setLoading] = useState(false)
    const {t} = useTranslation()


    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            setLoading(true)
            const response = await api.post("auth/reset-password/send-link/", {email:email})
            if(response.status === 200){
                toast.success("Password reset link has been sent your email address", {
                    theme:"colored"
                })
                setEmail('')
            }
        }catch(error){
            if(error.response){
                toast.error(error.response.data.error, {
                    theme:"colored"
                })
            }
        }finally{
            setLoading(false)
        }
    }

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
                            <label htmlFor="email">{t('email')}</label>
                            <input 
                                type="email" 
                                className="form-control"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                        >Send Reset Link</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResetPassword