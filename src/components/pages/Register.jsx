import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'
import { toast, ToastContainer } from 'react-toastify'
import api from '../../api'

import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { RequiredField } from '../../utils'
import * as Yup from 'yup'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Register = () => {

    const navigate = useNavigate();

    const[user, setUser] =  useState([])
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        navigate("/")
    }
    const initialState = {
        user_type: 1,
        username: '',
        is_notary: false,
        bar_code:'',
        reg_number:'',
        reg_year:'',
        gender: 1,
        date_of_birth: '',
        litigation_place: 1,
        district: '',
        police_station:'',
        prison:'',
        password:'',
        confirm_password:'',
        mobile:'',
        mobile_otp:'',
        email:'',
        email_otp:'',
        idproof:'',
        photo:'',
        state_code:'',
        profile_photo:'',
        identity_proof: '',
        reg_certificate: '',
        address: '',
        notary_order: ''
    }
    const[districts, setDistricts] = useState([])
    const [form, setForm] = useState(initialState)
    const[errors, setErrors] = useState({})
    const[mobileOtp, setMobileOtp] = useState(false)
    const[emailOtp, setEmailOtp] = useState(false)

    const[mobileLoading, setMobileLoading] = useState(false)
    const[emailLoading, setEmailLoading] = useState(false)

    const[mobileVerified, setMobileVerified] = useState(false)
    const[emailVerified, setEmailVerified]   = useState(false)

    const validationSchema = Yup.object({
        username: Yup.string().required(),
        date_of_birth: Yup.string().required(),
        litigation_place: Yup.string().required(),
        gender: Yup.string().required(),
        password: Yup.string().required(),
        confirm_password: Yup.string().required('Confirm password is required').oneOf([Yup.ref('password'), null], 'Passwords must match'),
        mobile: Yup.number().required().typeError("The mobile number should be numeric"),
        email: Yup.string().email().required()
    })

    useEffect(() => {
        const fecthDistricts = async() => {
            try{
                const response = await api.get("base/district/")
                if(response.status === 200){
                    setDistricts(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fecthDistricts()
    },[])


    const sendMobileOTP = () => {
        if(form.mobile === ''){
            toast.error("Please enter valid mobile number",{
                theme:"colored"
            })
        }else{
            setMobileLoading(true)
            toast.success("OTP has been sent your mobile number",{
                theme:"colored"
            })
            setMobileLoading(false)
            setMobileOtp(true)
        }
    }

    const verifyMobile = (otp) => {
        if(parseInt(otp) === 123456){
            toast.success("Mobile opt verified successfully",{
                theme:"colored"
            })
            setMobileVerified(true)
        }else{
            toast.error("Invalid OTP. Please enter valid OTP",{
                theme:"colored"
            })
            setMobileVerified(false)
            setMobileOtp(true)
        }
    }

    const sendEmailOTP = async () => {
        if(form.email === ''){
            toast.error("Please enter valid email address",{
                theme:"colored"
            })
        }else{
            try{
                setEmailLoading(true)
                const response = await api.post("base/send-email-otp/", {email_address: form.email})
                toast.success("OTP has been sent your email address",{
                    theme:"colored"
                })
                setEmailOtp(true)
                setEmailLoading(false)

            }catch(err){
                console.log(err)
            }
        }
    }

    const verifyEmail = async (otp) => {
        try{
            const response = await api.post("base/verify-email-otp/", {
                email_address: form.email,
                otp: parseInt(otp)
            })
            if(response.status === 200){
                toast.success("Email opt verified successfully",{
                    theme:"colored"
                })
                setEmailVerified(true)
            }
        }catch(err)
        {
            toast.error("Invalid OTP. Please enter valid OTP",{
                theme:"colored"
            })
            setEmailVerified(false)
            setEmailOtp(true)
        }
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();       
        try{
            await validationSchema.validate(form, {abortEarly:false})
            if(!mobileVerified){
                toast.error("Please verify your mobile number", {theme:"colored"})
                return
            }if(!emailVerified){
                toast.error("Please verify your email address", {theme:"colored"})
                return
            }
            const response = await api.post("auth/user/register/", form)
            if(response.status === 201){
                setUser(response.data)
                setShow(true)
                toast.success("User registered successfully", {
                    theme:"colored"
                })
            }
            if(response.status === 400){
                console.log(response)
            }

        }
        catch(error){
            if(error.inner){
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
            }
            if(error){
                console.log(error)
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} method="POST">
            <ToastContainer />
            <Modal 
                show={show} 
                onHide={handleClose} 
                backdrop="static"
                keyboard={false}
                size="md"
            >
                <Modal.Header closeButton className="bg-success">
                    <Modal.Title style={{ fontSize:'18px'}}><strong>Registration</strong></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Thank you for registering with us! Your can now use your registered mobile number or email address to login the portal</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                    Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="container">
                <div className='row'>
                    <div className="col-md-12">
                            <div className="card registration-card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-md-8 offset-md-2">
                                        <Alert icon={<PersonAddIcon fontSize="inherit" />} className="registration-alert" severity="success">
                                            New user registration
                                        </Alert>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body py-1">
                                <div className="row">
                                    <div className="col-md-12 d-flex justify-content-center mb-3">
                                        <FormControl>
                                            <RadioGroup
                                                row
                                                aria-labelledby="usertype-radios"
                                                name="user_type"
                                                value={form.user_type}
                                                onChange={(e) => setForm({...form, user_type:e.target.value})}
                                            >
                                                <FormControlLabel value={1} control={<Radio />} label="Advocate" />
                                                <FormControlLabel value={2} control={<Radio />} label="Litigant" />
                                            </RadioGroup>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-8 offset-md-2">
                                        <div className="form-group row mb-3">
                                            <label htmlFor="" className="col-sm-3">{ parseInt(form.user_type) === 1 ? 'Advocate Name' : 'Litigant Name' }<RequiredField/></label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="text" 
                                                    name="username" 
                                                    value={form.username}
                                                    className={`form-control ${errors.username ? 'is-invalid' : null}`}
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                />
                                                <div className="invalid-feedback">
                                                    { errors.username }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label htmlFor="" className="col-sm-3 col-form-label">Gender<RequiredField/></label>
                                            <div className="col-sm-4">
                                                <FormControl>
                                                    <RadioGroup
                                                        row
                                                        aria-labelledby="gender-radios"
                                                        name="gender"
                                                        value={form.gender}
                                                        onChange={(e) => setForm({...form, [e.target.name]:e.target.value})}
                                                    >
                                                        <FormControlLabel value={1} control={<Radio />} label="Male" />
                                                        <FormControlLabel value={2} control={<Radio />} label="Female" />
                                                        <FormControlLabel value={3} control={<Radio />} label="Other" />
                                                    </RadioGroup>
                                                    <div className="invalid-feedback">
                                                        { errors.gender }
                                                    </div>
                                                </FormControl>
                                            </div>
                                            <div className="col-sm-2">
                                                <label htmlFor="">Date of Birth<RequiredField/></label>
                                            </div>
                                            <div className="col-sm-3">
                                                <input 
                                                    type="date" 
                                                    className={`form-control ${errors.date_of_birth ? 'is-invalid' : null }`}
                                                    name="date_of_birth"
                                                    value={form.date_of_birth}
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                />
                                                <div className="invalid-feedback">
                                                    { errors.date_of_birth}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label htmlFor="" className="col-sm-3 col-form-label">Place of Practice/Litigation<RequiredField/></label>
                                            <div className="col-sm-9">
                                                <FormControl>
                                                    <RadioGroup
                                                        row
                                                        aria-labelledby="litigation-place-radios"
                                                        name="litigation_place"
                                                        value={form.litigation_place}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    >
                                                        <FormControlLabel value={1} control={<Radio />} label="High Court" />
                                                        <FormControlLabel value={2} control={<Radio />} label="District Court" />
                                                    </RadioGroup>
                                                </FormControl>
                                            </div>
                                        </div>
                                        { parseInt(form.user_type) === 1 && (
                                        <>
                                            <div className="form-group row mb-3">
                                                <label htmlFor="#" className="col-sm-3 col-form-label">Bar Registration Number<RequiredField/></label>
                                                <div className="col-sm-9">
                                                    <div className="row">
                                                        <div className="col-sm-3">
                                                            <TextField 
                                                                id="bar_code" 
                                                                label="State Code" 
                                                                name="bar_code"
                                                                value={form.bar_code}
                                                                size="small"
                                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                            />
                                                        </div>
                                                        <div className="col-sm-3">
                                                            <TextField 
                                                                id="reg_number" 
                                                                label="Reg. No." 
                                                                name="reg_number"
                                                                size="small"
                                                                value={form.reg_number}
                                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                            />
                                                        </div>
                                                        <div className="col-sm-3">
                                                            <TextField 
                                                                id="reg_year" 
                                                                label="Reg. Year" 
                                                                name="reg_year"
                                                                size="small"
                                                                value={form.reg_year}
                                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group row mb-3">
                                                <label htmlFor="bar_certificate" className='col-form-label col-sm-3'>Bar Registration Certificate<RequiredField/></label>
                                                <div className="col-sm-9">
                                                    <Button
                                                        component="label"
                                                        role={undefined}
                                                        variant="contained"
                                                        tabIndex={-1}
                                                        color="warning"
                                                        startIcon={<CloudUploadIcon />}
                                                        >
                                                        Upload Bar. Registration
                                                        <VisuallyHiddenInput 
                                                            type="file"
                                                            name="reg_certificate"
                                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.files[0]})} 
                                                        />
                                                    </Button>
                                                    <span className="mx-2">{ form.reg_certificate.name }</span>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="" className="col-sm-3">Notary<RequiredField/></label>
                                                <div className="col-md-9">
                                                <FormControl>
                                                    <RadioGroup
                                                        row
                                                        aria-labelledby="notary-radios"
                                                        name="is_notary"
                                                        value={form.is_notary}
                                                        onChange={(e) => setForm({...form, [e.target.name]:e.target.value})}
                                                    >
                                                        <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                                        <FormControlLabel value={false} control={<Radio />} label="No" />
                                                    </RadioGroup>
                                                </FormControl>
                                                </div>
                                            </div>
                                            { form.is_notary === "true" && (
                                            <div className="form-group row">
                                                <label htmlFor="" className="col-sm-3">Appointment Date<RequiredField/></label>
                                                <div className="col-sm-3">
                                                    <input 
                                                        type="date"     
                                                        name="appointment_date" 
                                                        className="form-control" 
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label htmlFor="">Notary Order<RequiredField/></label>
                                                </div>
                                                <div className="col-md-4">
                                                    <Button
                                                        component="label"
                                                        role={undefined}
                                                        variant="contained"
                                                        tabIndex={-1}
                                                        color="warning"
                                                        startIcon={<CloudUploadIcon />}
                                                        >
                                                        Upload Notary Order
                                                        <VisuallyHiddenInput 
                                                            type="file"
                                                            name="notary_order"
                                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.files[0]})} 
                                                        />
                                                    </Button>
                                                    <span className="mx-2">{ form.notary_order.name }</span>
                                                </div>
                                            </div>
                                            )}
                                        </>    
                                        )}
                                        { parseInt(form.litigation_place) === 2 && (
                                            <div className="form-group row mb-3">
                                                <label htmlFor="district" className='col-form-label col-sm-3'>District<RequiredField/></label>
                                                <div className="col-sm-6">
                                                    <select 
                                                        name="district" 
                                                        id="district" 
                                                        className="form-control"
                                                        value={form.district}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    >
                                                        <option value="">Select District</option>
                                                        { districts.map((item, index) => (
                                                            <option value={item.district_code} key={index}>{item.district_name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                        <div className="form-group row">
                                            <label className="col-form-label col-sm-3 pt-0">Password<RequiredField/></label>
                                            <div className="col-sm-6">
                                                <FormControl fullWidth className="mb-3">
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        value={form.password}
                                                        className={`form-control ${errors.password ? 'is-invalid' : null }`}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    />
                                                    <div className="invalid-feedback">
                                                        { errors.password }
                                                    </div>
                                                </FormControl>
                                            </div> 
                                        </div>
                                        <div className="form-group row" style={{ marginTop:"-20px"}}>
                                            <div className="col-sm-3"></div>   
                                            <div className="col-sm-9">
                                                <small className="text-teal">
                                                    <ul style={{ marginLeft:"-25px", fontWeight:700}}>
                                                        <li>Your password can't be too similar to your other personal information.</li>
                                                        <li>Your password must contain at least 8 characters.</li>
                                                        <li>Your password can't be a commonly used password.</li>
                                                        <li>Your password can't be entirely numeric.</li>
                                                    </ul>
                                                </small> 
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label className="col-form-label col-sm-3 pt-0">Confirm Password<RequiredField/></label>
                                            <div className="col-sm-6">
                                                <FormControl fullWidth className="mb-3">
                                                    <input
                                                        type="password" 
                                                        name="confirm_password" 
                                                        className={`form-control ${errors.confirm_password ? 'is-invalid' : null }`}
                                                        value={form.confirm_password}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value })}
                                                    />
                                                    <div className="invalid-feedback">
                                                        { errors.confirm_password }
                                                    </div>
                                                </FormControl>
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label className="col-form-label col-sm-3">Mobile Number<RequiredField/></label>
                                            <div className="col-sm-4">
                                                <FormControl className="mb-3" fullWidth>
                                                    <input 
                                                        type="text" 
                                                        name="mobile" 
                                                        className={`form-control ${errors.mobile ? 'is-invalid' : null }`}
                                                        value={form.mobile}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    />
                                                    <div className="invalid-feedback">
                                                        { errors.mobile }
                                                    </div>
                                                </FormControl>
                                            </div>
                                            { !mobileVerified && (
                                                <div className="col-sm-2">
                                                    <Button 
                                                        variant="contained"
                                                        color="primary" 
                                                        onClick={sendMobileOTP}
                                                    >
                                                        Send OTP</Button>
                                                </div>

                                            )}
                                            { mobileLoading && (<Spinner variant="primary"/>)}
                                            { mobileOtp && !mobileVerified && (
                                                <div className="col-sm-3">
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <input 
                                                                type="password" 
                                                                name="mobile_otp" 
                                                                className="form-control" 
                                                                value={form.mobile_otp}
                                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <Button 
                                                                variant="contained"
                                                                color="success"
                                                                onClick={() => verifyMobile(form.mobile_otp)}
                                                            >
                                                            Verify</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            { mobileVerified && (
                                                <p className="mt-2">
                                                    <CheckCircleRoundedIcon color="success"/>
                                                    <span className="text-success ml-1"><strong>Verified</strong></span>
                                                </p>
                                            )}
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label className="col-form-label col-sm-3">Email Address<RequiredField/></label>
                                            <div className="col-sm-4">
                                                <input 
                                                    type="email" 
                                                    name="email" 
                                                    className={`form-control ${errors.email ? 'is-invalid' : null}`}
                                                    value={form.email}
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                />
                                                <div className="invalid-feedback">
                                                    { errors.email }
                                                </div>
                                            </div>
                                            { !emailVerified && (
                                                <div className="col-sm-2">
                                                    <Button 
                                                        variant="contained" 
                                                        color="primary" 
                                                        onClick={sendEmailOTP}
                                                    >
                                                        Send OTP</Button>
                                                </div>
                                            )}
                                            { emailLoading && (<Spinner variant="primary"/>)}
                                            { emailOtp  && !emailVerified && (
                                                <div className="col-sm-3">
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <input  
                                                                type="password" 
                                                                name="email_otp" 
                                                                className="form-control" 
                                                                value={form.email_otp}
                                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <Button 
                                                                variant="contained" 
                                                                color="success"
                                                                onClick={() => verifyEmail(form.email_otp)}
                                                            >Verify</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            { emailVerified && (
                                            <p className="mt-2">
                                                <CheckCircleRoundedIcon color="success"/>
                                                <span className="text-success ml-1"><strong>Verified</strong></span>
                                            </p>
                                            )}
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="address" className="col form-label col-sm 3">Address</label>
                                            <div className="col-sm-9">
                                                <textarea 
                                                    name="address"
                                                    className="form-control"
                                                    value={form.address}
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label htmlFor="photo" className='col-form-label col-sm-3'>Upload Photo</label>
                                            <div className="col-sm-9">
                                                <Button
                                                    component="label"
                                                    role={undefined}
                                                    variant="contained"
                                                    color="warning"
                                                    tabIndex={-1}
                                                    startIcon={<CloudUploadIcon />}
                                                    >
                                                    Upload Photo
                                                    <VisuallyHiddenInput 
                                                        type="file" 
                                                        name="profile_photo"
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.files[0]})}
                                                    />
                                                </Button>
                                                <span className="mx-2">{ form.profile_photo.name}</span>
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label htmlFor="address_proof" className='col-form-label col-sm-3'>Identity Proof</label>
                                            <div className="col-sm-9">
                                                <Button
                                                    component="label"
                                                    role={undefined}
                                                    variant="contained"
                                                    color="warning"
                                                    tabIndex={-1}
                                                    startIcon={<CloudUploadIcon />}
                                                    >
                                                    Upload Identity Proof
                                                    <VisuallyHiddenInput 
                                                        type="file"
                                                        name="identity_proof"
                                                        onChange={(e) => setForm({...form, [e.target.name] : e.target.files[0]})} 
                                                    />
                                                </Button>
                                                <span className="mx-2">{ form.identity_proof.name }</span>
                                            </div>
                                        </div>
                                        
                                        <div className="d-flex justify-content-center">
                                            <Button
                                                variant="contained"
                                                color="success"
                                                startIcon={<PersonAddIcon />}
                                                onClick={handleSubmit}
                                            >
                                                Register
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Register
