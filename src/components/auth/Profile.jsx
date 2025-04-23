import React, {useContext, useState, useEffect} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { AuthContext } from 'contexts/AuthContext'
import api from 'api'
import Loading from 'components/utils/Loading'
import * as Yup from 'yup'
import { RequiredField } from 'utils'
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { handleMobileChange, validateMobile, validateEmail, handleAgeChange, handleBlur, handleNameChange, handlePincodeChange } from 'components/validation/validations';
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";
import { MasterContext } from 'contexts/MasterContext'
import { LanguageContext } from 'contexts/LanguageContex'
import config from 'config'

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

const Profile = () => {

    const {user} = useContext(AuthContext)
    const initialState = {
        roles: [10],
        username: '',
        is_notary: false,
        appointment_date:'',
        adv_reg: '',
        gender: 1,
        date_of_birth: '',
        litigation_place: 1,
        state: '',
        district: '',
        mobile:'',
        email:'',
        address: '',
        profile_photo:'',
        identity_proof: '',
        reg_certificate: '',
        notary_order: ''
    }
    const {t} = useTranslation()
    const { language } = useContext(LanguageContext)
    const { masters: {states, districts, genders }} = useContext(MasterContext)
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

    const appointment_date_Display = (date) => {
            const day = ("0" + date.getDate()).slice(-2);
            const month = ("0" + (date.getMonth() + 1)).slice(-2);
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        };
    
        const appointment_date_Backend = (date) => {
            const year = date.getFullYear();
            const month = ("0" + (date.getMonth() + 1)).slice(-2);
            const day = ("0" + date.getDate()).slice(-2);
            return `${year}-${month}-${day}`;
        };
        
        useEffect(() => {
            const appointment_date = flatpickr(".appointment_date-date-picker", {
                dateFormat: "d/m/Y",
                maxDate: "today",
                defaultDate: form.appointment_date ? appointment_date_Display(new Date(form.appointment_date)) : '',
                onChange: (selectedDates) => {
                    const formattedDate = selectedDates[0] ? appointment_date_Backend(selectedDates[0]) : "";
                    setForm({ ...form, appointment_date: formattedDate });
                },
            });
    
            return () => {
                if (appointment_date && typeof appointment_date.destroy === "function") {
                    appointment_date.destroy();
                }
            };
        }, [form]);
    
        const date_of_birth_Display = (date) => {
            const day = ("0" + date.getDate()).slice(-2);
            const month = ("0" + (date.getMonth() + 1)).slice(-2);
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        };
    
        const date_of_birth_Backend = (date) => {
            const year = date.getFullYear();
            const month = ("0" + (date.getMonth() + 1)).slice(-2);
            const day = ("0" + date.getDate()).slice(-2);
            return `${year}-${month}-${day}`;
        };
        
        useEffect(() => {
            const date_of_birth = flatpickr(".date_of_birth-date-picker", {
                dateFormat: "d/m/Y",
                maxDate: "today",
                defaultDate: form.date_of_birth ? date_of_birth_Display(new Date(form.date_of_birth)) : '',
                onChange: (selectedDates) => {
                    const formattedDate = selectedDates[0] ? date_of_birth_Backend(selectedDates[0]) : "";
                    setForm({ ...form, date_of_birth: formattedDate });
                },
            });
    
            return () => {
                if (date_of_birth && typeof date_of_birth.destroy === "function") {
                    date_of_birth.destroy();
                }
            };
        }, [form]);
    

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

    useEffect(() => {
        const fetchProfile = async() => {
            try{
                setLoading(true)
                const response = await api.get(`auth/user/profile/`)
                if(response.status === 200){
                    const data = response.data
                    setForm({
                        ...form,
                        username: data.user?.username,
                        is_notary: data.profile?.is_notary,
                        adv_reg: data.profile?.adv_reg,
                        gender: data.profile?.gender,
                        date_of_birth: data.profile?.date_of_birth,
                        litigation_place: data.profile?.litigation_place,
                        state: data.user?.state,
                        district: data.user?.district,
                        mobile:data.user?.mobile,
                        email:data.user?.email,
                        address: data.profile.address,
                        profile_photo: data.profile?.profile_photo || '',
                        identity_proof: data.profile?.identity_proof || '',
                        reg_certificate: data.profile?.reg_certificate || '',
                        notary_order: data.profile?.notary_order || ''
                    })
                }
            }catch(error){
                console.log(error)
            }finally{
                setLoading(false)
            }
        }
        fetchProfile();
    },[])


    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try{
            const response = await api.put(`auth/user/profile/`, form,{
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            if(response.status === 200){
                toast.success("Profile updated successfully", {theme:"colored"})
                const user = JSON.parse(sessionStorage.getItem("user"));
                const updatedUser = { ...user, is_complete: true };
                sessionStorage.setItem("user", JSON.stringify(updatedUser));
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
                                { form.profile_photo ? (
                                    <img src={`${config.docUrl}${form.profile_photo}`}/>
                                ) : (
                                    <img src={`${process.env.PUBLIC_URL}/images/profile.jpg`} alt="" />
                                )}
                                <p className='text-center mt-3'><strong>{user?.username.toUpperCase()}<br/>{user?.mobile}<br/>{user?.email}</strong></p>
                                <button className="btn btn-primary">Change Profile Picture</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        {/* <form method='post'> */}
                            <div className="form-group row mb-3">
                                <label htmlFor="username" className="col-sm-3">{t('username')}</label>
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
                                <div className="col-sm-3">
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
                                <div className="col-sm-4">
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
                                        <div className="col-sm-4">
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
                                        <div className="col-sm-4">
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
                            { true && (
                            <React.Fragment>
                                <div className="form-group row mb-3">
                                    <label htmlFor="#" className="col-sm-3 col-form-label">{t('enrollment_number')}<RequiredField/></label>
                                    <div className="col-sm-4">
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
                            </React.Fragment>    
                            )}
                            <React.Fragment>
                                <div className="form-group row mb-3">
                                    <label htmlFor="mobile_number" className="col-sm-3">{t('mobile_number')}</label>
                                    <div className="col-md-3">
                                        <input 
                                            type="text" 
                                            className={`form-control ${errors.mobile ? 'is-invalid' : null}`}
                                            name="mobile"
                                            placeholder={changeMobile ? "New mobile number" : ""}
                                            value={form.mobile}
                                            readOnly={changeMobile ? false : true}
                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                        />
                                        <div className="invalid-feedback">
                                            { errors.mobile }
                                        </div>
                                    </div>
                                    { changeMobile === false ? (
                                        // <div className="col-md-1">
                                        //     <button 
                                        //         className="btn btn-primary"
                                        //         onClick={updateMobile}
                                        //     >{t('change')}</button>
                                        // </div>
                                        <></>
                                    ):(
                                        <div className="col-md-2">
                                            <button 
                                                className="btn btn-primary"
                                                onClick={sendMobileOtp}
                                            >{t('send_otp')}</button>
                                        </div>
                                    )}
                                    { mobileOtp && (
                                        <React.Fragment>
                                            <div className="col-md-2">
                                                <div className="form-group">
                                                    {/* <label htmlFor="mobile_otp">{t('send_otp')}</label> */}
                                                    <input 
                                                        type="text" 
                                                        className="form-control"
                                                        name="mobile_otp"
                                                        value={form.mobile_otp}
                                                        placeholder='Mobile OTP'
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-1">
                                                <button className="btn btn-success" onClick={verfiyMobileOtp}>{t('verify')}</button>
                                            </div>
                                        </React.Fragment>
                                    )}
                                </div>
                                <div className="form-group row mb-3">
                                    <label htmlFor="email" className='col-sm-3'>{t('email_address')}</label>
                                    <div className="col-md-3">
                                        <input 
                                            type="text" 
                                            className={`form-control ${errors.email ? 'is-invalid' : null}`}
                                            name="email"
                                            placeholder={changeMobile ? "New email address" : ""}
                                            value={form.email}
                                            readOnly={changeEmail ? false : true}
                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                        />
                                        <div className="invalid-feedback">
                                            { errors.email}
                                        </div>
                                    </div>        
                                    { changeEmail === false ? (
                                        // <div className="col-md-1">
                                        //     <button 
                                        //         className="btn btn-primary"
                                        //         onClick={updateEmail}
                                        //     >{t('change')}</button>
                                        // </div>
                                        <></>
                                    ):(
                                        <div className="col-md-2">
                                            <button 
                                                className="btn btn-primary"
                                                onClick={sendEmailOtp}
                                            >{t('send_otp')}</button>
                                        </div>
                                    )}
                                    { emailOtp && (
                                        <React.Fragment>
                                            <div className="col-md-2">
                                                <div className="form-group">
                                                    {/* <label htmlFor="email_otp">OTP</label> */}
                                                    <input 
                                                        type="text" 
                                                        className="form-control"
                                                        name="email_otp"
                                                        value={form.email_otp}
                                                        placeholder='eMail OTP'
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-1 mt-4 pt-2">
                                                <button className="btn btn-success" onClick={verifyEmailOtp}>{t('verify')}</button>
                                            </div>
                                        </React.Fragment>
                                    )}
                                </div>
                            </React.Fragment>
                            <div className="form-group row mb-3">
                                <label htmlFor="address" className="col-form-label col-sm-3">{t('address')}</label>
                                <div className="col-sm-6">
                                    <textarea 
                                        name="address"
                                        className="form-control"
                                        value={form.address}
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    ></textarea>
                                </div>
                            </div>
                            { form.is_notary && (
                                <div className="form-group row mb-3">
                                    <label htmlFor="" className='col-form-label col-sm-3'>{t('notary_order')}<RequiredField/></label>
                                    <div className="col-sm-4">
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
                                                onChange={(e) => handleFileChange(e, 'notary_order')}
                                                accept=".pdf"
                                            />
                                        </Button>
                                        {/* Display selected file name */}
                                        {form.notary_order && form.notary_order.name && (
                                            <span className="mx-2">{form.notary_order.name}</span>
                                        )}
                                        {/* Display error message if any */}
                                        {errors.notary_order && (
                                            <div className="invalid-feedback" style={{ display: 'block' }}>
                                                {errors.notary_order}
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-3">
                                    { form.notary_order && (
                                        <a href={`${config.docUrl}${form.notary_order}`} target="_blank">Notary Order</a>
                                    )}
                                </div>
                                </div>
                            )}
                            <div className="form-group row mb-3">
                                <label htmlFor="bar_certificate" className='col-form-label col-sm-3'>{t('bar_certificate')}<RequiredField/></label>
                                <div className="col-sm-4">
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
                                            accept=".pdf" // Only PDF accepted
                                            onChange={(e) => handleFileChange(e, 'reg_certificate')}
                                        />
                                    </Button>
                                    {/* Display selected file name */}
                                    {form.reg_certificate && form.reg_certificate.name && (
                                        <span className="mx-2">{form.reg_certificate.name}</span>
                                    )}
                                    {/* Display error message if any */}
                                    {errors.reg_certificate && (
                                        <div className="invalid-feedback" style={{ display: 'block' }}>
                                            {errors.reg_certificate}
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-3">
                                    { form.reg_certificate && (
                                        <a href={`${config.docUrl}${form.reg_certificate}`} target="_blank">Bar Certificate</a>
                                    )}
                                </div>
                            </div>
                            <div className="form-group row mb-3">
                                <label htmlFor="photo" className='col-form-label col-sm-3'>{t('upload_photo')}<RequiredField/></label>
                                <div className="col-sm-4">
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
                                            accept="image/*" // Allow image files
                                            onChange={(e) => handleFileChange(e, 'profile_photo')}
                                        />
                                    </Button>
                                    {/* Display selected file name */}
                                    {form.profile_photo && form.profile_photo.name && (
                                        <span className="mx-2">{form.profile_photo.name}</span>
                                    )}
                                    {/* Display error message if any */}
                                    {errors.profile_photo && (
                                        <div className="invalid-feedback" style={{ display: 'block' }}>
                                            {errors.profile_photo}
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-3">
                                    { form.profile_photo && (
                                        <a href={`${config.docUrl}${form.profile_photo}`} target="_blank">Profile Photo</a>
                                    )}
                                </div>
                            </div>
                            <div className="form-group row mb-3">
                                <label htmlFor="address_proof" className='col-form-label col-sm-3'>{t('identity_proof')}<RequiredField/></label>
                                <div className="col-sm-4">
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
                                            onChange={(e) => handleFileChange(e, 'identity_proof')}  
                                            accept=".pdf, image/*" 
                                        />
                                    </Button>
                                    <span className="mx-2">{form.identity_proof && form.identity_proof.name}</span>
                                    {errors.identity_proof && (
                                        <div className="invalid-feedback" style={{ display: 'block' }}>
                                            {errors.identity_proof}
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-3">
                                    { form.identity_proof && (
                                        <a href={`${config.docUrl}${form.identity_proof}`} target="_blank">Identity Proof</a>
                                    )}
                                </div>
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