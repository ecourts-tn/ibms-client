import api from 'api'
import * as Yup from 'yup'
import { RequiredField } from 'utils'
import React, { useContext, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import { toast, ToastContainer } from 'react-toastify'
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import BootstrapButton from 'react-bootstrap/Button'
import Alert from '@mui/material/Alert'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useTranslation } from 'react-i18next'
import Loading from 'components/utils/Loading'
import { handleMobileChange, validateEmail, handleNameChange} from 'components/validation/validations';
import "flatpickr/dist/flatpickr.min.css";
import { IconButton } from '@mui/material'; // For the toggle button
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Eye icons for toggle
import { MasterContext } from 'contexts/MasterContext'
import { LanguageContext } from 'contexts/LanguageContex'
import { ModelClose } from 'utils'


const RegistrationNew = () => {

    const navigate = useNavigate();
    const[user, setUser] =  useState([])
    const [show, setShow] = useState(false);
    const {t} = useTranslation()
    const handleClose = () => {
        setShow(false);
        navigate("/")
    }
    const initialState = {
        department: '',
        username: '',
        password:'',
        confirm_password:'',
        mobile:'',
        email:'',
    }

    const { masters: {departments }} = useContext(MasterContext)
     const [form, setForm] = useState(initialState)
    const [errors, setErrors] = useState(initialState)
    const [isMobileOtpSent, setIsMobileOtpSent] = useState(false)
    const [mobileOtp, setMobileOtp] = useState(null)
    const [isEmailOtpSent, setIsEmailOtpSent] = useState(false)
    const [emailOtp, setEmailOtp] = useState(null)
    const [loading, setLoading] = useState(false)
    const [mobileVerified, setMobileVerified] = useState(false)
    const [emailVerified, setEmailVerified]   = useState(false)
    const [showPassword, setShowPassword] = useState(false); 
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); 

    const validationSchema = Yup.object({
        username: Yup.string().required(t('errors.username_required')),
        password: Yup.string().required(t('errors.password_required')),
        confirm_password: Yup.string().required(t('errors.cpassword_required')).oneOf([Yup.ref('password'), null], 'Passwords must match'),
        mobile: Yup.number().required(t('errors.mobile_required')).typeError(t('errors.numeric')),
        email: Yup.string().email().required(t('errors.email_required'))
    })

    
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update form state
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,  // Dynamically update the field
        }));

        // Validate the field and update errors
        const errorMessage = validateEmail(name, value);  // Validate the email field
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMessage,  // Set the error message for the specific field
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;

        if (value === '') {
            setForm({
                ...form,
                password: '',
                confirm_password: '', // Clear confirm password when password is cleared
            });
            setErrors({
                ...errors,
                password: '',
                confirm_password: '', // Clear errors as well
            });
            return; // Do nothing further if password is cleared
        }

        // Check if the password length exceeds 20 characters
        if (value.length > 20) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                password: 'Password cannot exceed 20 characters.',
            }));
            return;
        }

        // Regex for password validation: At least 8-20 characters, at least one uppercase, one lowercase, one number, and one special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;"'<>,.?/\\|`~\-_]).{8,20}$/;

        // Check if password is valid according to regex
        if (!passwordRegex.test(value)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                password: 'Password must be between 8-20 characters, include at least one uppercase letter, one lowercase letter, one number, and one special character.',
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                password: '', // Clear error if valid
            }));
        }


        // Update the form state with the new password value
        setForm({
            ...form,
            [name]: value,
        });

        // Check if password and confirm password match
        if (form.confirm_password && form.confirm_password !== value) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                confirm_password: 'Passwords do not match.',
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                confirm_password: '', // Clear error if passwords match
            }));
        }
    };

    // Password strength check - validate password criteria
    const validatePasswordCriteria = (password) => {
        return {
            length: password.length >= 8 && password.length <= 20,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };
    };

    const passwordCriteria = validatePasswordCriteria(form.password);

    // Handle confirm password change
    const handleConfirmPasswordChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
        });

        // Check if password and confirm password match
        if (form.password && form.password !== value) {
            setErrors({
                ...errors,
                confirm_password: 'Passwords do not match.',
            });
        } else {
            setErrors({
                ...errors,
                confirm_password: '',
            });
        }
    };

   
    const verifyMobile = (otp) => {
        if(parseInt(otp) === 123456){
            toast.success(t('alerts.mobile_otp_verified'),{
                theme:"colored"
            })
            setMobileVerified(true)
        }else{
            toast.error(t('alerts.invalid_otp'),{
                theme:"colored"
            })
            setMobileVerified(false)
            setIsMobileOtpSent(true)
        }
    }

    const verifyEmail = async (otp) => {
        try{
            setLoading(true)
            const response = await api.post("auth/email/otp/verify/", {
                email: form.email,
                otp: parseInt(otp)
            })
            if(response.status === 200){
                toast.success(t('alerts.email_otp_verified'),{
                    theme:"colored"
                })
                setEmailVerified(true)
            }
        }catch(error){
            if(error.response){
                toast.error(error.response.data.message, {
                    theme:"colored"
                })
            }

            setEmailVerified(false)
            setIsEmailOtpSent(true)
        }finally{
            setLoading(false)
        }
    }

    const sendMobileOTP = async() => {
        try{
            setLoading(true)
            const response = await api.post(`auth/mobile/verify/`, {mobile:form.mobile})
            if(response.status === 200){
                toast.success(t('alerts.mobile_otp_sent'),{
                    theme:"colored"
                })
                setIsMobileOtpSent(true)
            }
        }catch(error){
            if(error.response?.status === 400 || error.response?.status === 409){
                toast.error(error.response.data.message, {theme:"colored"})
            }
        }finally{
            setLoading(false)
        }
    }

    const sendEmailOTP = async() => {
        setLoading(true)
        try{
            const response = await api.post(`auth/email/verify/`, {email:form.email})
            if(response.status === 200){
                try{
                    const response2 = await api.post("auth/email/otp/", {email: form.email})
                    if(response2.status === 200){
                        toast.success(t('alerts.email_otp_sent'),{theme:"colored"})
                        setIsEmailOtpSent(true)
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

    
    const handleSubmit = async (e) => {
        e.preventDefault();       
        try{
            setLoading(true)
            await validationSchema.validate(form, {abortEarly:false})
            // if(!mobileVerified){
            //     toast.error("Please verify your mobile number", {theme:"colored"})
            //     return
            // }if(!emailVerified){
            //     toast.error("Please verify your email address", {theme:"colored"})
            //     return
            // }
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
        }finally{
            setLoading(false)
        }
    } 

    return (
        <form onSubmit={handleSubmit} method="POST">
            <ToastContainer />
            { loading && <Loading />}
            <Modal 
                show={show} 
                onHide={handleClose} 
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header className="bg-success">
                    <Modal.Title style={{ fontSize:'18px'}}><strong>Registration</strong></Modal.Title>
                    <ModelClose handleClose={handleClose}/>
                </Modal.Header>
                <Modal.Body>
                    <p>Dear <strong>{user?.username}</strong>,</p>
                    <p>
                        Thank you for registering with us! You can now log in to the portal using any of the following credentials:
                        <br /><br />
                        • Mobile Number: <strong>{user?.mobile}</strong>
                        <br />
                        • Email Address: <strong>{user?.email}</strong>
                        <br />
                        • User ID: <strong>{user?.userlogin}</strong>
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <BootstrapButton 
                        variant="secondary" 
                        onClick={handleClose}
                        className="btn-sm"
                    >
                        Close
                    </BootstrapButton>
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
                                            {t('user_registration')}
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
                                                name="department"
                                                value={form.department}
                                                onChange={(e) => setForm({...form, [e.target.name]:e.target.value})}
                                            >
                                                <FormControlLabel value={4} control={<Radio />} label={t('advocate')} />
                                                <FormControlLabel value={5} control={<Radio />} label={t('litigant')} />
                                            </RadioGroup>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-9 offset-md-2">
                                        <div className="form-group row md-3">
                                            <label htmlFor="" className="col-sm-3">{ parseInt(form.department) === 4 ? t('adv_name') : t('name_of_litigant') }<RequiredField/></label>
                                            <div className="col-sm-6">
                                                <input 
                                                    type="text" 
                                                    name="username" 
                                                    value={form.username}
                                                    className={`form-control ${errors.username ? 'is-invalid' : null}`}
                                                    onChange={(e) => handleNameChange(e, setForm, form, 'username')}
                                                    // onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                />
                                                <div className="invalid-feedback">
                                                    { errors.username }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label className="col-form-label col-sm-3">{t('mobile_number')}<RequiredField/></label>
                                            <div className="col-sm-4">
                                                <FormControl className="mb-3" fullWidth>
                                                    <input 
                                                        type="text" 
                                                        name="mobile" 
                                                        className={`form-control ${errors.mobile ? 'is-invalid' : null }`}
                                                        value={form.mobile}
                                                        onChange={(e) => handleMobileChange(e, setForm, form, 'mobile')}
                                                        // onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
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
                                                        {t('send_otp')}</Button>
                                                </div>

                                            )}
                                            {/* { mobileLoading && (<Spinner variant="primary"/>)} */}
                                            { isMobileOtpSent && !mobileVerified && (
                                                <div className="col-sm-3">
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <input 
                                                                type="password" 
                                                                name="mobileOtp" 
                                                                className="form-control" 
                                                                value={mobileOtp}
                                                                onChange={(e) => setMobileOtp(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <Button 
                                                                variant="contained"
                                                                color="success"
                                                                onClick={() => verifyMobile(mobileOtp)}
                                                            >
                                                            {t('verify')}</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            { mobileVerified && (
                                                <p className="mt-2">
                                                    <CheckCircleRoundedIcon color="success"/>
                                                    <span className="text-success ml-1"><strong>{t('otp_verified')}</strong></span>
                                                </p>
                                            )}
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label className="col-form-label col-sm-3">{t('email_address')}<RequiredField/></label>
                                            <div className="col-sm-4">
                                                <input 
                                                    type="email" 
                                                    name="email" 
                                                    className={`form-control ${errors.email ? 'is-invalid' : null}`}
                                                    value={form.email}
                                                    onChange={handleChange}
                                                    // onBlur={() => handleBlur(form, setErrors)}
                                                    // onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
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
                                                        {t('send_otp')}</Button>
                                                </div>
                                            )}
                                            {/* { emailLoading && (<Spinner variant="primary"/>)} */}
                                            { isEmailOtpSent  && !emailVerified && (
                                                <div className="col-sm-3">
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <input  
                                                                type="password" 
                                                                name="emailOtp" 
                                                                className="form-control" 
                                                                value={emailOtp}
                                                                onChange={(e) => setEmailOtp(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <Button 
                                                                variant="contained" 
                                                                color="success"
                                                                onClick={() => verifyEmail(emailOtp)}
                                                            >{t('verify')}</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            { emailVerified && (
                                            <p className="mt-2">
                                                <CheckCircleRoundedIcon color="success"/>
                                                <span className="text-success ml-1"><strong>{t('otp_verified')}</strong></span>
                                            </p>
                                            )}
                                        </div>                                       
                                        <div className="form-group row">
                                            <label className="col-form-label col-sm-3 pt-0">{t('password')}<RequiredField/></label>
                                            <div className="col-sm-6">
                                                <FormControl fullWidth className="mb-3">
                                                <div className="input-group" style={{ position: 'relative' }}>
                                                    <input
                                                       type={showPassword ? 'text' : 'password'} 
                                                        name="password"
                                                        value={form.password}
                                                        className={`form-control ${errors.password ? 'is-invalid' : null }`}
                                                        onChange={handlePasswordChange}
                                                        style={{
                                                            paddingRight: '35px', // Make room for the icon inside the input
                                                        }}
                                                    />
                                                   <IconButton
                                                        onClick={() => setShowPassword(!showPassword)} // Toggle the visibility
                                                        edge="end"
                                                        style={{
                                                            position: 'absolute',
                                                            right: '10px', // Positioned on the right side inside the input field
                                                            top: '50%',
                                                            transform: 'translateY(-50%)', // Centered vertically
                                                            color: '#6c757d', // Icon color (you can adjust this)
                                                        }}
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />} {/* Eye icons */}
                                                    </IconButton>
                                                    </div>
                                                    <div className="invalid-feedback">
                                                        { errors.password }
                                                    </div>
                                                </FormControl>
                                            </div> 
                                        </div>
                                        {/* Password Requirements List */}
                                        {form.password.length > 0 && (
                                        <div className="form-group row" style={{ marginTop: '-20px' }}>
                                            <div className="col-sm-3"></div>
                                            <div className="col-sm-9">
                                                <small className="text-teal">
                                                    <ul style={{ marginLeft: '-25px', fontWeight: 700 }}>
                                                        <li
                                                            style={{
                                                                color: passwordCriteria.length ? 'green' : 'red',
                                                                textDecoration: passwordCriteria.length ? 'none' : 'line-through',
                                                            }}
                                                        >
                                                            Password must be between 8-20 characters.
                                                        </li>
                                                        <li
                                                            style={{
                                                                color: passwordCriteria.lowercase ? 'green' : 'red',
                                                                textDecoration: passwordCriteria.lowercase ? 'none' : 'line-through',
                                                            }}
                                                        >
                                                            Your password must include at least one lowercase letter.
                                                        </li>
                                                        <li
                                                            style={{
                                                                color: passwordCriteria.uppercase ? 'green' : 'red',
                                                                textDecoration: passwordCriteria.uppercase ? 'none' : 'line-through',
                                                            }}
                                                        >
                                                            Your password must include at least one uppercase letter.
                                                        </li>
                                                        <li
                                                            style={{
                                                                color: passwordCriteria.number ? 'green' : 'red',
                                                                textDecoration: passwordCriteria.number ? 'none' : 'line-through',
                                                            }}
                                                        >
                                                            Your password must include at least one number.
                                                        </li>
                                                        <li
                                                            style={{
                                                                color: passwordCriteria.special ? 'green' : 'red',
                                                                textDecoration: passwordCriteria.special ? 'none' : 'line-through',
                                                            }}
                                                        >
                                                            Your password must include at least one special character.
                                                        </li>
                                                    </ul>
                                                </small>
                                            </div>
                                        </div>
                                        )}
                                        <div className="form-group row mb-3">
                                            <label className="col-form-label col-sm-3 pt-0">{t('confirm_password')}<RequiredField/></label>
                                            <div className="col-sm-6">
                                                <FormControl fullWidth className="mb-3">
                                                <div className="input-group" style={{ position: 'relative' }}>
                                                    <input
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        name="confirm_password" 
                                                        className={`form-control ${errors.confirm_password ? 'is-invalid' : null }`}
                                                        value={form.confirm_password}
                                                        onChange={handleConfirmPasswordChange}
                                                        style={{
                                                            paddingRight: '35px', // Make room for the icon inside the input
                                                        }}
                                                    />
                                                    <IconButton
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword )} // Toggle the visibility
                                                        edge="end"
                                                        style={{
                                                            position: 'absolute',
                                                            right: '10px', // Positioned on the right side inside the input field
                                                            top: '50%',
                                                            transform: 'translateY(-50%)', // Centered vertically
                                                            color: '#6c757d', // Icon color (you can adjust this)
                                                        }}
                                                    >
                                                        {showConfirmPassword  ? <VisibilityOff /> : <Visibility />} {/* Eye icons */}
                                                    </IconButton>
                                                    </div>
                                                    <div className="invalid-feedback">
                                                        { errors.confirm_password }
                                                    </div>
                                                </FormControl>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-center">
                                            <Button
                                                variant="contained"
                                                color="success"
                                                startIcon={<PersonAddIcon />}
                                                onClick={handleSubmit}
                                            >
                                                {t('register')}
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

export default RegistrationNew
