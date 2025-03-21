import React, {useContext, useState} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { AuthContext } from 'contexts/AuthContext'
import api from 'api'
import Loading from 'components/common/Loading'


const Profile = () => {

    const {user} = useContext(AuthContext)
    const initialState = {
        userlogin        : user?.userlogin,
        mobile_number    : user?.mobile,
        email_address    : user?.email,
        username         : user?.username,
        mobile_otp       : '',
        email_otp        : ''
    }
    const {t} = useTranslation()
    const[form, setForm] = useState(initialState)
    const[errors, setErrors] = useState({})
    const[changeMobile, setChangeMobile] = useState(false)
    const[mobileOtp, setMobileOtp] = useState(false)
    const[changeEmail, setChangeEmail] = useState(false)
    const[emailOtp, setEmailOtp] = useState(false)
    const[loading, setLoading] = useState(false)

    const updateMobile = (e) => {
        e.preventDefault()
        setChangeMobile(true)
        setForm({...form, mobile_number: ''})
    }
    
    const sendMobileOtp = (e) => {
        e.preventDefault()
        if(form.mobile_number === ''){
            setErrors({...errors, mobile_number:"Please enter the mobile number"})
            return
        }
        toast.success("OTP has sent to your mobile number", {theme:"colored"})
        setMobileOtp(true)
    }

    const verfiyMobileOtp = (e) => {
        e.preventDefault()
        if(parseInt(form.mobile_otp) === 123456){
            toast.success("Mobile OTP has been verified successfully", {theme:"colored"})
            setChangeMobile(false)
            setMobileOtp(false)
            setForm({...form, mobile_otp: ''})
        }
    }

    const updateEmail = (e) => {
        e.preventDefault()
        setChangeEmail(true)
        setForm({...form, email_address: ''})
    }
    

    const sendEmailOtp = async() => {
        setLoading(true)
        try{
            const response = await api.post(`auth/email/verify/`, {email:form.email_address})
            if(response.status === 200){
                try{
                    const response2 = await api.post("auth/email/otp/", {email: form.email_address})
                    if(response2.status === 200){
                        toast.success(t('alerts.email_otp_sent'),{theme:"colored"})
                        setEmailOtp(true)
                    }
                }catch(err){
                    console.log(err)
                }
            }
        }catch(error){
            console.log(error)
            if(error.response?.status === 400 || error.response?.status === 409){
                toast.error(error.response?.data.message, {theme:"colored"})
            }
        }finally{
            setLoading(false)
        }
    }

    const verifyEmailOtp = async (e) => {
        e.preventDefault()
        try{
            setLoading(true)
            const response = await api.post("auth/email/otp/verify/", {
                email: form.email_address,
                otp: parseInt(form.email_otp)
            })
            if(response.status === 200){
                toast.success(t('alerts.email_otp_verified'),{
                    theme:"colored"
                })
                setChangeEmail(false)
                setEmailOtp(false)
            }
        }catch(error){
            if(error.response){
                toast.error(error.response.data.message, {
                    theme:"colored"
                })
            }
            setEmailOtp(true)
        }finally{
            setLoading(false)
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try{
            const response = await api.post(`auth/user/profile/update/`, form)
            if(response.status === 200){
                toast.success("Profile updated successfully", {theme:"colored"})
            }
        }catch(error){
            if(error.response){
                toast.error(error.response.data.message, {theme:"colored"})
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
                                <li className="breadcrumb-item active" aria-current="page">{t('profile')}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 d-flex justify-content-center profile">
                        <div className="card">
                            <div className="card-body">
                                <img src={`${process.env.PUBLIC_URL}/images/profile.jpg`} alt="" />
                                <p className='text-center mt-3'><strong>{user?.username.toUpperCase()}<br/>{user?.mobile}<br/>{user?.email}</strong></p>
                                <button className="btn btn-primary">Change Profile Picture</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        {/* <form method='post'> */}
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="username">{t('username')}</label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${errors.old_password ? 'is-invalid' : null}`}
                                            name="username"
                                            value={form.username}
                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                        />
                                        <div className="invalid-feedback">
                                            { errors.old_password }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="mobile_number">{t('mobile_number')}</label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${errors.mobile_number ? 'is-invalid' : null}`}
                                            name="mobile_number"
                                            placeholder={changeMobile ? "New mobile number" : ""}
                                            value={form.mobile_number}
                                            readOnly={changeMobile ? false : true}
                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                        />
                                        <div className="invalid-feedback">
                                            { errors.mobile_number }
                                        </div>
                                    </div>
                                </div>
                                { changeMobile === false ? (
                                    <div className="col-md-1 mt-4 pt-2">
                                        <button 
                                            className="btn btn-primary"
                                            onClick={updateMobile}
                                        >{t('change')}</button>
                                    </div>
                                ):(
                                    <div className="col-md-2 mt-4 pt-2">
                                        <button 
                                            className="btn btn-primary"
                                            onClick={sendMobileOtp}
                                        >{t('send_otp')}</button>
                                    </div>
                                )}
                                { mobileOtp && (
                                    <>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label htmlFor="mobile_otp">{t('send_otp')}</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control"
                                                    name="mobile_otp"
                                                    value={form.mobile_otp}
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-1 mt-4 pt-2">
                                            <button className="btn btn-success" onClick={verfiyMobileOtp}>{t('verify')}</button>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="email_address">{t('email_address')}</label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${errors.email_address ? 'is-invalid' : null}`}
                                            name="email_address"
                                            placeholder={changeMobile ? "New email address" : ""}
                                            value={form.email_address}
                                            readOnly={changeEmail ? false : true}
                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                        />
                                        <div className="invalid-feedback">
                                            { errors.email_address}
                                        </div>
                                    </div>
                                </div>
                                { changeEmail === false ? (
                                    <div className="col-md-1 mt-4 pt-2">
                                        <button 
                                            className="btn btn-primary"
                                            onClick={updateEmail}
                                        >{t('change')}</button>
                                    </div>
                                ):(
                                    <div className="col-md-2 mt-4 pt-2">
                                        <button 
                                            className="btn btn-primary"
                                            onClick={sendEmailOtp}
                                        >{t('send_otp')}</button>
                                    </div>
                                )}
                                { emailOtp && (
                                    <>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label htmlFor="email_otp">OTP</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control"
                                                    name="email_otp"
                                                    value={form.email_otp}
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-1 mt-4 pt-2">
                                            <button className="btn btn-success" onClick={verifyEmailOtp}>{t('verify')}</button>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="row">
                                <div className="col-md-12 mt-3">
                                    <div className="form-group">
                                        <button className="btn btn-success" onClick={handleSubmit}>{t('submit')}</button>
                                    </div>
                                </div>
                            </div>
                        {/* </form> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile