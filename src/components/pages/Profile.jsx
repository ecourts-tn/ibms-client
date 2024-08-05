import React, {useState} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import * as Yup from 'yup'
import api from '../../api'
import './header.css'

const Profile = () => {

    const initialState = {
        mobile_number    : '8344381139',
        email_address    : 'deenadayalan17@gmail.com',
        username         : 'Deenadayalan M'
    }
    const[form, setForm] = useState(initialState)
    const[errors, setErrors] = useState({})
    const[changeMobile, setChangeMobile] = useState(false)
    const[mobileOtp, setMobileOtp] = useState(false)
    const[changeEmail, setChangeEmail] = useState(false)
    const[emailOtp, setEmailOtp] = useState(false)

    const updateMobile = () => {
        setChangeMobile(true)
        setForm({...form, mobile_number: ''})
    }
    
    const sendMobileOtp = () => {
        if(form.mobile_number === ''){
            setErrors({...errors, mobile_number:"Please enter the mobile number"})
            return
        }
        setMobileOtp(true)
    }

    const updateEmail = () => {
        setChangeEmail(true)
        setForm({...form, email_address: ''})
    }
    
    const sendEmailOtp = () => {
        if(form.email_address === ''){
            setErrors({...errors, email_address:"Please enter the email_address"})
            return
        }
        setEmailOtp(true)
    }

    const handleSubmit = async (e) => {
        
    }

    return (
        <>
            <ToastContainer />
            <div className="container-fluid px-5 my-4" style={{minHeight:'500px'}}>
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb" className="mt-2 mb-1">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item text-primary">Home</li>
                                <li className="breadcrumb-item text-primary">Authentication</li>
                                <li className="breadcrumb-item active" aria-current="page">User Profile</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 d-flex justify-content-center profile">
                        <div class="card" style={{width: '18rem'}}>
                            <img src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=" alt="" />
                            <div className="card-body text-center">
                                <p className="card-text"><strong>ADM20240000001<br/>Deenadayalan M<br/>deenadayalan17@gmail.com</strong></p>
                                <button className="btn btn-primary">Change Profile Picture</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        {/* <form method='post'> */}
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="username">Advocate/Litigant Name</label>
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
                                        <label htmlFor="mobile_number">Mobile Number</label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${errors.mobile_number ? 'is-invalid' : null}`}
                                            name="mobile_number"
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
                                        >Change</button>
                                    </div>
                                ):(
                                    <div className="col-md-2 mt-4 pt-2">
                                        <button 
                                            className="btn btn-primary"
                                            onClick={sendMobileOtp}
                                        >Send OTP</button>
                                    </div>
                                )}
                                { mobileOtp && (
                                    <>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <label htmlFor="mobile_otp">OTP</label>
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
                                            <button className="btn btn-success">Verify</button>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="email_address">E-Mail Address</label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${errors.email_address ? 'is-invalid' : null}`}
                                            name="email_address"
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
                                        >Change</button>
                                    </div>
                                ):(
                                    <div className="col-md-2 mt-4 pt-2">
                                        <button 
                                            className="btn btn-primary"
                                            onClick={sendEmailOtp}
                                        >Send OTP</button>
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
                                            <button className="btn btn-success">Verify</button>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="row">
                                <div className="col-md-12 mt-3">
                                    <div className="form-group">
                                        <button className="btn btn-success">Update</button>
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