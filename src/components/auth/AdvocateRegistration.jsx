import api from 'api'
import * as Yup from 'yup'
import { RequiredField } from 'utils'
import React, { useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import { toast, ToastContainer } from 'react-toastify'
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
import { useTranslation } from 'react-i18next'
<<<<<<< HEAD
import Loading from 'components/Loading'
=======
import { handleMobileChange, validateMobile, validateEmail, handleAgeChange, handleBlur, handleNameChange, handlePincodeChange } from 'components/commonvalidation/validations';
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";
import { IconButton } from '@mui/material'; // For the toggle button
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Eye icons for toggle


>>>>>>> santhosh

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

const AdvocateRegistration = () => {

    const navigate = useNavigate();

    const[user, setUser] =  useState([])
    const [show, setShow] = useState(false);
    const {t} = useTranslation()
    const handleClose = () => {
        setShow(false);
        navigate("/")
    }
    const initialState = {
        group: 1,
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
<<<<<<< HEAD
    const[form, setForm] = useState(initialState)
    const[errors, setErrors] = useState({})
=======
    const [form, setForm] = useState(initialState)
    const[errors, setErrors] = useState(initialState)
>>>>>>> santhosh
    const[mobileOtp, setMobileOtp] = useState(false)
    const[emailOtp, setEmailOtp] = useState(false)
    const[loading, setLoading] = useState(false)
    const[mobileVerified, setMobileVerified] = useState(false)
    const[emailVerified, setEmailVerified]   = useState(false)

    const validationSchema = Yup.object({
        username: Yup.string().required(t('errors.username_required')),
        date_of_birth: Yup.string().required(t('errors.dob_required')),
        litigation_place: Yup.string().required(),
        gender: Yup.string().required(),
        password: Yup.string().required(t('errors.password_required')),
        confirm_password: Yup.string().required(t('errors.cpassword_required')).oneOf([Yup.ref('password'), null], 'Passwords must match'),
        mobile: Yup.number().required(t('errors.mobile_required')).typeError(t('errors.numeric')),
        email: Yup.string().email().required(t('errors.email_required'))
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

    

<<<<<<< HEAD
=======
    useEffect(() => {
        const appointmentDatePicker = flatpickr(".appointment-date-picker", {
            dateFormat: "d/m/Y",
            maxDate: "today", // Disable past dates for appointment date
            defaultDate: form.appointment_date,
            onChange: (selectedDates1) => {
                const formattedDate1 = selectedDates1[0] ? formatDate1(selectedDates1[0]) : "";
                setForm({ ...form, appointment_date: formattedDate1 });
            },
        });

        return () => {
            if (appointmentDatePicker && typeof appointmentDatePicker.destroy === "function") {
                appointmentDatePicker.destroy();
            }
        };
    }, [form]);

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

    const handleFileChange = (e, fileType) => {
        const file = e.target.files[0]; // Get the first file
        if (!file) return; // If no file is selected, return early
    
        let errorMessage = '';
    
        // PDF Validation (for notary_order and reg_certificate)
        if (fileType === 'notary_order' || fileType === 'reg_certificate') {
            // Validate file type (only PDF)
            if (file.type !== 'application/pdf') {
                errorMessage = 'Only PDF files are allowed for Notary Order and Bar Certificate.';
            }
    
            // Validate file size (max 5MB for PDF)
            if (file.size > 5 * 1024 * 1024) { // 5MB in bytes
                errorMessage = errorMessage || 'File size must be less than 5MB.';
            }
        }
    
        // Image Validation (for profile_photo)
        else if (fileType === 'profile_photo') {
            // Validate file type (only images allowed)
            const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
            if (!allowedImageTypes.includes(file.type)) {
                errorMessage = 'Only image files (JPG, JPEG, PNG, GIF) are allowed for Profile Photo.';
            }
    
            // Validate file size (max 3MB for image)
            if (file.size > 3 * 1024 * 1024) { // 3MB in bytes
                errorMessage = errorMessage || 'Image size must be less than 3MB.';
            }
        }

        else if (fileType === 'identity_proof') {
            // Check for allowed file types (PDF or Image)
            const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
            if (file.type === 'application/pdf') {
                // If it's a PDF, no need to check further for image types
                if (file.size > 5 * 1024 * 1024) { // 5MB for PDF size limit
                    errorMessage = errorMessage || 'File size must be less than 5MB.';
                }
            } else if (!allowedImageTypes.includes(file.type)) {
                // If it's not a valid image type
                errorMessage = 'Only image files (JPG, JPEG, PNG, GIF) or PDF are allowed for Identity Proof.';
            } else if (file.size > 3 * 1024 * 1024) { // Max 3MB for images
                // Validate file size (max 3MB for image)
                errorMessage = errorMessage || 'Image size must be less than 3MB.';
            }
        }
    
        // If there's an error, show it
        if (errorMessage) {
            setErrors({
                ...errors,
                [fileType]: errorMessage,
            });
            return; // Stop further execution if file type or size is invalid
        }
    
        // If validation passes, update the form with the file data
        setForm({
            ...form,
            [fileType]: {
                name: file.name, // Display the file name
                file: file, // Store the actual file
            },
        });
    
        // Clear any previous errors for this file type
        setErrors({
            ...errors,
            [fileType]: '',
        });
    };
   
    const sendMobileOTP = () => {
        if(form.mobile === ''){
            toast.error(t('alerts.mobile_required'),{
                theme:"colored"
            })
        }else{
            setMobileLoading(true)
            toast.success(t('alerts.mobile_otp_sent'),{
                theme:"colored"
            })
            setMobileLoading(false)
            setMobileOtp(true)
        }
    }
>>>>>>> santhosh

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
            setMobileOtp(true)
        }
    }

    const verifyEmail = async (otp) => {
        try{
            const response = await api.post("external/email/verify-otp/", {
                email_address: form.email,
                otp: parseInt(otp)
            })
            if(response.status === 200){
                toast.success(t('alerts.email_otp_verified'),{
                    theme:"colored"
                })
                setEmailVerified(true)
            }
        }catch(err)
        {
            toast.error(t('alerts.invalid_otp'),{
                theme:"colored"
            })
            setEmailVerified(false)
            setEmailOtp(true)
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
                setMobileOtp(true)
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
                    const response2 = await api.post("external/email/sent-otp/", {email_address: form.email})
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
            { loading && <Loading />}
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
                                                name="user_type"
                                                value={form.user_type}
                                                onChange={(e) => setForm({...form, user_type:e.target.value})}
                                            >
                                                <FormControlLabel value={1} control={<Radio />} label={t('advocate')} />
                                                <FormControlLabel value={2} control={<Radio />} label={t('litigant')} />
                                            </RadioGroup>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-8 offset-md-2">
                                        <div className="form-group row mb-3">
                                            <label htmlFor="" className="col-sm-3">{ parseInt(form.user_type) === 1 ? t('adv_name') : t('name_of_litigant') }<RequiredField/></label>
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
                                            <label htmlFor="" className="col-sm-3 col-form-label">{t('gender')}<RequiredField/></label>
                                            <div className="col-sm-4">
                                                <FormControl>
                                                    <RadioGroup
                                                        row
                                                        aria-labelledby="gender-radios"
                                                        name="gender"
                                                        value={form.gender}
                                                        onChange={(e) => setForm({...form, [e.target.name]:e.target.value})}
                                                    >
                                                        <FormControlLabel value={1} control={<Radio />} label={t('male')} />
                                                        <FormControlLabel value={2} control={<Radio />} label={t('female')} />
                                                        <FormControlLabel value={3} control={<Radio />} label={t('other')} />
                                                    </RadioGroup>
                                                    <div className="invalid-feedback">
                                                        { errors.gender }
                                                    </div>
                                                </FormControl>
                                            </div>
                                            <div className="col-sm-2">
                                                <label htmlFor="">{t('date_of_birth')}<RequiredField/></label>
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
                                        { parseInt(form.user_type) === 1 && (
                                        <>
                                            <div className="form-group row mb-3">
                                                <label htmlFor="#" className="col-sm-3 col-form-label">{t('enrollment_number')}<RequiredField/></label>
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
                                                <label htmlFor="bar_certificate" className='col-form-label col-sm-3'>{t('bar_certificate')}<RequiredField/></label>
                                                <div className="col-sm-9">
                                                    <Button
                                                        component="label"
                                                        role={undefined}
                                                        variant="contained"
                                                        tabIndex={-1}
                                                        color="warning"
                                                        startIcon={<CloudUploadIcon />}
                                                        >
                                                        {t('upload_bar_certificate')}
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
                                                <label htmlFor="" className="col-sm-3">{t('appointment_date')}<RequiredField/></label>
                                                <div className="col-sm-3">
                                                    <input 
                                                        type="date"     
                                                        name="appointment_date" 
                                                        className="form-control" 
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label htmlFor="">{t('notary_order')}<RequiredField/></label>
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
                                                        {t('upload_notary_order')}
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
                                                        { districts.map((item, index) => (
                                                            <option value={item.district_code} key={index}>{item.district_name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                        <div className="form-group row">
                                            <label className="col-form-label col-sm-3 pt-0">{t('password')}<RequiredField/></label>
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
                                            <label className="col-form-label col-sm-3 pt-0">{t('confirm_password')}<RequiredField/></label>
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
                                            <label className="col-form-label col-sm-3">{t('mobile_number')}<RequiredField/></label>
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
                                                        {t('send_otp')}</Button>
                                                </div>

                                            )}
                                            {/* { mobileLoading && (<Spinner variant="primary"/>)} */}
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
                                                        {t('send_otp')}</Button>
                                                </div>
                                            )}
                                            {/* { emailLoading && (<Spinner variant="primary"/>)} */}
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
                                            <label htmlFor="address" className="col form-label col-sm 3">{t('address')}</label>
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
                                            <label htmlFor="photo" className='col-form-label col-sm-3'>{t('upload_photo')}</label>
                                            <div className="col-sm-9">
                                                <Button
                                                    component="label"
                                                    role={undefined}
                                                    variant="contained"
                                                    color="warning"
                                                    tabIndex={-1}
                                                    startIcon={<CloudUploadIcon />}
                                                    >
                                                    {t('upload_photo')}
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
                                            <label htmlFor="address_proof" className='col-form-label col-sm-3'>{t('identity_proof')}</label>
                                            <div className="col-sm-9">
                                                <Button
                                                    component="label"
                                                    role={undefined}
                                                    variant="contained"
                                                    color="warning"
                                                    tabIndex={-1}
                                                    startIcon={<CloudUploadIcon />}
                                                    >
                                                    {t('upload_proof')}
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

export default AdvocateRegistration
