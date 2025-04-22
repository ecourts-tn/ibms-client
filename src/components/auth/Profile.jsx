import React, {useContext, useState} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { AuthContext } from 'contexts/AuthContext'
import api from 'api'
import Loading from 'components/utils/Loading'
import * as Yup from 'yup'
import { RequiredField } from 'utils'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import BootstrapButton from 'react-bootstrap/Button'
import Alert from '@mui/material/Alert'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { handleMobileChange, validateMobile, validateEmail, handleAgeChange, handleBlur, handleNameChange, handlePincodeChange } from 'components/validation/validations';
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";
import { IconButton } from '@mui/material'; // For the toggle button
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Eye icons for toggle
import { MasterContext } from 'contexts/MasterContext'
import { LanguageContext } from 'contexts/LanguageContex'
import { ModelClose } from 'utils'



const Profile = () => {

    const {user} = useContext(AuthContext)
    const initialState = {
        userlogin        : user?.userlogin,
        mobile_number    : user?.mobile,
        email_address    : user?.email,
        username         : user?.username,
        mobile_otp       : '',
        email_otp        : '',
        roles:''
    }
    const {t} = useTranslation()
    const { language } = useContext(LanguageContext)
    const { masters: {states, districts, genders, departments }} = useContext(MasterContext)
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

    const handleEnrolmentno = (e) => {
        const { name, value } = e.target;
    
        // Convert the input value to uppercase
        const upperCaseValue = value.toUpperCase();
    
        // Regex to allow first 3 characters as uppercase letters, then slashes and numbers
        const regexFirstPart = /^[A-Z]{3}/; // Only allows uppercase letters for the first 3 characters
        const regexSecondPart = /^[0-9/]*$/; // Allows only uppercase letters, numbers, and slashes
    
        // Validate the first part (first 3 characters)
        if (upperCaseValue.length <= 2 && upperCaseValue.length <= 3) {
            // If length is 3 or less, ensure all characters are uppercase letters
            if (/^[A-Z]*$/.test(upperCaseValue)) {
                setForm({
                    ...form,
                    [name]: upperCaseValue, // Update the specific field with uppercase value
                });
            } else {
                // If invalid character is entered for the first 3 chars, show error
                setErrors({
                    ...errors,
                    [name]: 'The first 3 characters must be uppercase letters.',
                });
            }
        } else {
            // Validate the remaining part (after 3 characters)
            const remainingPart = upperCaseValue.slice(3); // Get the part after the first 3 characters
    
            if (regexSecondPart.test(remainingPart)) {
                // If valid, update the state with the full value
                setForm({
                    ...form,
                    [name]: upperCaseValue,
                });
                setErrors({ ...errors, [name]: '' }); // Clear error message if valid
            } else {
                // Show error if the remaining part contains invalid characters
                setErrors({
                    ...errors,
                    [name]: 'Allowed Only 3 characters and after slashes and numbers are allowed.',
                });
            }
        }
    };
    

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
                            <div className="form-group row">
                                <label htmlFor="username" className="col-sm-2">{t('username')}</label>
                                <div className="col-md-4">
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
                                <label htmlFor="" className="col-sm-2 col-form-label">{t('gender')}<RequiredField/></label>
                                <div className="col-sm-4">
                                    <FormControl>
                                        <RadioGroup
                                            row
                                            aria-labelledby="gender-radios"
                                            name="gender"
                                            value={form.gender}
                                            onChange={(e) => setForm({...form, [e.target.name]:e.target.value})}
                                        >
                                            { genders.map((g, index) => (
                                                <FormControlLabel value={g.id} control={<Radio />} label={ language === 'ta' ? g.gender_lname : g.gender_name} />
                                            ))}
                                        </RadioGroup>
                                        <div className="invalid-feedback">
                                            { errors.gender }
                                        </div>
                                    </FormControl>
                                </div> 
                            </div>
                            <div className="form-group row mb-3">
                                <div className="col-sm-2">
                                    <label htmlFor="">{t('date_of_birth')}<RequiredField/></label>
                                </div>
                                <div className="col-sm-3">
                                    <input 
                                        type="text" 
                                        className={`form-control date_of_birth-date-picker ${errors.date_of_birth ? 'is-invalid' : ''}`}
                                        name="date_of_birth"
                                        value={form.date_of_birth ? form.date_of_birth : ''}
                                        placeholder="DD/MM/YYYY"
                                        onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: '1px solid #ccc', // Optional: Adjust border
                                            padding: '8px',            // Optional: Adjust padding
                                        }}
                                    />
                                    <div className="invalid-feedback">
                                        { errors.date_of_birth}
                                    </div>
                                </div>
                            </div>
                                                                    <div className="form-group row mb-3">
                                                                        <label htmlFor="" className="col-sm-3 col-form-label">{t('place_of_practice')}<RequiredField/></label>
                                                                        <div className="col-sm-9">
                                                                            <FormControl>
                                                                                <RadioGroup
                                                                                    row
                                                                                    aria-labelledby="litigation-place-radios"
                                                                                    name="litigation_place"
                                                                                    value={form.litigation_place}
                                                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                                                >
                                                                                    <FormControlLabel value={1} control={<Radio />} label={t('high_court')} />
                                                                                    <FormControlLabel value={2} control={<Radio />} label={t('district_court')} />
                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                        </div>
                                                                    </div>
                                                                    { parseInt(form.litigation_place) === 2 && (
                                                                        <React.Fragment>
                                                                            <div className="form-group row mb-3">
                                                                                <label htmlFor="state" className='col-form-label col-sm-3'>{t('state')}<RequiredField/></label>
                                                                                <div className="col-sm-6">
                                                                                    <select 
                                                                                        name="state" 
                                                                                        id="state" 
                                                                                        className="form-control"
                                                                                        value={form.state}
                                                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                                                    >
                                                                                        <option value="">Select State</option>
                                                                                        { states.map((s, index) => (
                                                                                            <option value={s.state_code} key={index}>{language === 'ta' ? s.state_lname : s.state_name}</option>
                                                                                        ))}
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                            <div className="form-group row mb-3">
                                                                                <label htmlFor="district" className='col-form-label col-sm-3'>{t('district')}<RequiredField/></label>
                                                                                <div className="col-sm-6">
                                                                                    <select 
                                                                                        name="district" 
                                                                                        id="district" 
                                                                                        className="form-control"
                                                                                        value={form.district}
                                                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                                                    >
                                                                                        <option value="">Select District</option>
                                                                                        { districts.filter((d) => parseInt(d.state) === parseInt(form.state)).map((item, index) => (
                                                                                            <option value={item.district_code} key={index}>{item.district_name}</option>
                                                                                        ))}
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                        </React.Fragment>
                                                                    )}
                                                                    { parseInt(form.roles[0]) === 10 && (
                                                                    <>
                                                                        <div className="form-group row mb-3">
                                                                            <label htmlFor="#" className="col-sm-3 col-form-label">{t('enrollment_number')}<RequiredField/></label>
                                                                            <div className="col-sm-3">
                                                                                <input
                                                                                    type='text'
                                                                                    name="adv_reg"
                                                                                    value={form.adv_reg}
                                                                                    onChange={handleEnrolmentno}
                                                                                    className={`form-control ${errors.adv_reg ? 'is-invalid' : 'adv_reg'}`}
                                                                                    placeholder='MS/----/----'
                                                                                />
                                                                                {errors.adv_reg && <div className="invalid-feedback">{errors.adv_reg}</div>} {/* Show error message */}
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <div className="form-group row">
                                                                            <label htmlFor="" className="col-sm-3">{t('notary')}<RequiredField/></label>
                                                                            <div className="col-md-9">
                                                                            <FormControl>
                                                                                <RadioGroup
                                                                                    row
                                                                                    aria-labelledby="notary-radios"
                                                                                    name="is_notary"
                                                                                    value={form.is_notary}
                                                                                    onChange={(e) => setForm({...form, [e.target.name]:e.target.value})}
                                                                                >
                                                                                    <FormControlLabel value={true} control={<Radio />} label={t('yes')} />
                                                                                    <FormControlLabel value={false} control={<Radio />} label={t('no')} />
                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                            </div>
                                                                        </div>
                                                                        { form.is_notary === "true" && (
                                                                        <div className="form-group row">
                                                                            <div className="col-sm-3">
                                                                                <label htmlFor="">{t('appointment_date')}<RequiredField/></label>
                                                                            </div>
                                                                            <div className="col-sm-3">
                                                                                <input 
                                                                                    type="date"     
                                                                                    name="appointment_date" 
                                                                                    className={`form-control appointment_date-date-picker ${errors.appointment_date ? 'is-invalid' : ''}`}
                                                                                    value={form.appointment_date ? form.appointment_date : ''}
                                                                                    placeholder="DD/MM/YYYY"
                                                                                    onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
                                                                                    style={{
                                                                                        backgroundColor: 'transparent',
                                                                                        border: '1px solid #ccc', // Optional: Adjust border
                                                                                        padding: '8px',            // Optional: Adjust padding
                                                                                    }}
                                                                                />
                                                                                <div className="invalid-feedback">
                                                                                { errors.appointment_date}
                                                                            </div>
                                                                            </div>
                                                                            
                                                                        </div>
                                                                        )}
                                                                    </>    
                                                                    )}
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