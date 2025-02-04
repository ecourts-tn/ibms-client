import React, { useState, useEffect, useContext } from 'react'

import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { toast, ToastContainer } from 'react-toastify';
import api from 'api';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';
import { handleMobileChange, validateMobile, validateEmail, handleAgeChange, handleBlur, handleNameChange, handlePincodeChange } from 'components/commonvalidation/validations';


import { StateContext } from 'contexts/StateContext'
import { DistrictContext } from 'contexts/DistrictContext'
import { EstablishmentContext } from 'contexts/EstablishmentContext'
import { CourtContext } from 'contexts/CourtContext'
import { PoliceStationContext } from 'contexts/PoliceStationContext'
import { PrisonContext } from 'contexts/PrisonContext'
import { UserTypeContext } from 'contexts/UserTypeContext'
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";
import { IconButton } from '@mui/material'; 
import { Visibility, VisibilityOff } from '@mui/icons-material'; 

const DepartmentRegistration = () => {

    const initialState = {
        group: '',
        login_name: '',
        gender: 1,
        date_of_birth: '',
        litigation_place: 2,
        state: '',
        district: '',
        establishment: '',
        police_station: '',
        prison: '',
        court: '',
        password: '',
        confirm_password: '',
        mobile: '',
        email: '',
        address: '',
        is_notary: false,
    }
    const [form, setForm] = useState(initialState)
    const [errors, setErrors] = useState(initialState)
    const { language } = useContext(LanguageContext)
    const { t } = useTranslation()
    const [showPassword, setShowPassword] = useState(false); 
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); 

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


    const handleSubmit = async () => {
        try {
            const response = await api.post("auth/user/register/", form)
            if (response.status === 201) {
                toast.success("User registered successfully", {
                    theme: "colored"
                })
                setForm(initialState)
            }
        }
        catch (error) {
            const errors = error.response.data
            for (const err in errors) {
                toast.error(`${err.toUpperCase()} - ${errors[err]}`, {
                    theme: "colored"
                })
            }

        }
    }

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

    const department_date_Display = (date) => {
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const department_date_Backend = (date) => {
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
            const date_of_birth = flatpickr(".date_of_birth-date-picker", {
                dateFormat: "d/m/Y",
                maxDate: "today",
                defaultDate: form.date_of_birth ? department_date_Display(new Date(form.date_of_birth)) : '',
                onChange: (selectedDates) => {
                    const formattedDate = selectedDates[0] ? department_date_Backend(selectedDates[0]) : "";
                    setForm({ ...form, date_of_birth: formattedDate });
                },
            });
    
            return () => {
                if (date_of_birth && typeof date_of_birth.destroy === "function") {
                    date_of_birth.destroy();
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

   
    const { userTypes: usertypes } = useContext(UserTypeContext)
    const { states } = useContext(StateContext)
    const { districts } = useContext(DistrictContext)
    const { establishments } = useContext(EstablishmentContext)
    const { courts } = useContext(CourtContext)
    const { policeStations } = useContext(PoliceStationContext)
    const { prisons } = useContext(PrisonContext)

    return (
        <>
            <ToastContainer />
            <div className="content-wrapper">
                <div className="container-fluid mt-3">
                    <div className="card card-outline card-primary">
                        <div className="card-header">
                            <h3 className="card-title"><i className="fas fa-users mr-2"></i><strong>User Registration</strong></h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group row mb-3">
                                            <label htmlFor="" className="col-sm-3">Usertype</label>
                                            <div className="col-sm-6">
                                                <select
                                                    name="group"
                                                    className="form-control"
                                                    value={form.group}
                                                    onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                >
                                                    <option value="">Select Usertype</option>
                                                    {
                                                        usertypes.map((type, index) => (
                                                            <option value={type.id} key={index}>{type.name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label htmlFor="" className="col-sm-3">Username</label>
                                            <div className="col-sm-6">
                                                <TextField
                                                    type="text"
                                                    name="username"
                                                    value={form.username}
                                                    size="small"
                                                    label="Username"
                                                    className="form-control"
                                                    onChange={(e) => handleNameChange(e, setForm, form, 'username')}
                                                    InputLabelProps={{
                                                        style: {
                                                            fontWeight: 'normal', // Set font weight to normal
                                                            fontSize: '1rem',     // Set font size to normal (you can adjust this as needed)
                                                        },
                                                    }}    
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label htmlFor="" className="col-sm-3 col-form-label">Gender</label>
                                            <div className="col-md-9">
                                                <FormControl>
                                                    <RadioGroup
                                                        row
                                                        aria-labelledby="gender-radios"
                                                        name="gender"
                                                        value={form.gender}
                                                        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                    >
                                                        <FormControlLabel value={1} control={<Radio />} label="Male" />
                                                        <FormControlLabel value={2} control={<Radio />} label="Female" />
                                                        <FormControlLabel value={3} control={<Radio />} label="Other" />
                                                    </RadioGroup>
                                                </FormControl>
                                            </div>
                                        </div>
                                        {/* <div className="from-group row mb-3">
                                            <label htmlFor="date_of_birth" className="col-sm-3">Date of Birth</label>
                                            <div className="col-sm-3">
                                                <input
                                                    type="date"
                                                    className="form-control date-of-birth-picker"
                                                    name="date_of_birth"
                                                    value={formatDateForFlatpickr(form.date_of_birth)} // Convert to YYYY-MM-DD format
                                                    placeholder="DD/MM/YYYY"
                                                    onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        border: '1px solid #ccc', // Optional: Adjust border
                                                        padding: '8px',            // Optional: Adjust padding
                                                    }}
                                                />
                                                <div className="invalid-feedback">
                                                    {errors.date_of_birth}
                                                </div>
                                            </div>
                                        </div> */}
                                        <div className="from-group row mb-3">
                                            <label htmlFor="date_of_birth" className="col-sm-3">Date of Birth</label>
                                            <div className="col-sm-3">
                                                <input
                                                    type="date"
                                                    className={`form-control date_of_birth-date-picker ${errors.date_of_birth ? 'is-invalid' : ''}`}
                                                    name="date_of_birth"
                                                    value={form.date_of_birth ? form.date_of_birth : ''}
                                                    placeholder="DD/MM/YYYY"
                                                    onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        border: '1px solid #ccc', 
                                                        padding: '8px',            
                                                    }}
                                                />
                                                <div className="invalid-feedback">
                                                    {errors.date_of_birth}
                                                </div>
                                                
                                            </div>
                                        </div>

                                        {parseInt(form.user_type) === 1 && (
                                            <div className="form-group row mb-3">
                                                <label htmlFor="#" className="col-sm-3 col-form-label">Bar Registration Number</label>
                                                <div className="col-sm-9">
                                                    <div className="row">
                                                        <div className="col-sm-3">
                                                            <TextField
                                                                id="bar_code"
                                                                label="State Code"
                                                                name="bar_code"
                                                                value={form.bar_code}
                                                                size="small"
                                                                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="col-sm-3">
                                                            <TextField
                                                                id="reg_number"
                                                                label="Reg. No."
                                                                name="reg_number"
                                                                size="small"
                                                                value={form.reg_number}
                                                                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="col-sm-3">
                                                            <TextField
                                                                id="reg_year"
                                                                label="Reg. Year"
                                                                name="reg_year"
                                                                size="small"
                                                                value={form.reg_year}
                                                                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {parseInt(form.litigation_place) === 2 && (
                                            <>
                                                <div className="form-group row mb-3">
                                                    <label htmlFor="state" className='col-form-label col-sm-3'>State</label>
                                                    <div className="col-sm-6">
                                                        <select
                                                            name="state"
                                                            className="form-control"
                                                            value={form.state}
                                                            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                        >
                                                            <option value="">Select State</option>
                                                            {states.map((item, index) => (
                                                                <option value={item.state_code} key={index}>{item.state_name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="form-group row mb-3">
                                                    <label htmlFor="district" className='col-form-label col-sm-3'>District</label>
                                                    <div className="col-sm-6">
                                                        <select
                                                            name="district"
                                                            className="form-control"
                                                            value={form.district}
                                                            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                        >
                                                            <option value="">Select District</option>
                                                            {/* { districts.map((item, index) => (
                                                            <option value={item.district_code} key={index}>{item.district_name}</option>
                                                        ))} */}
                                                            {districts.filter(district => parseInt(district.state) === parseInt(form.state)).map((item, index) => (
                                                                <option value={item.district_code} key={index}>{language === 'ta' ? item.district_lname : item.district_name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="form-group row mb-3">
                                                    <label htmlFor="establishment" className='col-form-label col-sm-3'>Estatblishment</label>
                                                    <div className="col-sm-9">
                                                        <select
                                                            name="establishment"
                                                            className="form-control"
                                                            value={form.establishment}
                                                            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                        >
                                                            <option value="">Select Establishment</option>
                                                            {/* { establishments.map((item, index) => (
                                                            <option value={item.establishment_code} key={index}>{item.establishment_name}</option>
                                                        ))} */}
                                                            {establishments.filter(establishment => parseInt(establishment.district) === parseInt(form.district)).map((item, index) => (
                                                                <option value={item.establishment_code} key={index}>{item.establishment_name}</option>

                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="form-group row mb-3">
                                                    <label htmlFor="court" className='col-form-label col-sm-3'>Court</label>
                                                    <div className="col-sm-6">
                                                        <select
                                                            name="court"
                                                            className="form-control"
                                                            value={form.court}
                                                            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                        >
                                                            <option value="">Select Court</option>

                                                            {courts.filter(c => c.establishment === form.establishment)
                                                                .map((item, index) => (
                                                                    <option key={index} value={item.court_code}>{language === 'ta' ? item.court_lname : item.court_name}</option>
                                                                ))
                                                            }

                                                        </select>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {parseInt(form.user_type) === 5 && (
                                            <div className="form-group row mb-3">
                                                <label htmlFor="police_station" className='col-form-label col-sm-3'>Police Station</label>
                                                <div className="col-sm-6">
                                                    <select
                                                        name="police_station"
                                                        id="police_station"
                                                        className="form-control"
                                                        value={form.police_station}
                                                        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.event })}
                                                    >
                                                        <option value="">Select Police station</option>
                                                        {policeStations.map((station, index) => (
                                                            <option key={index} value={station.station_code}>{station.station_name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                        {parseInt(form.user_type) === 4 && (
                                            <div className="form-group row mb-3">
                                                <label htmlFor="prison" className='col-form-label col-sm-3'>Prison Name</label>
                                                <div className="col-sm-6">
                                                    <select
                                                        name="prison"
                                                        id="prison"
                                                        className="form-control"
                                                        value={form.prison}
                                                        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                    >
                                                        <option value="">Select Prison</option>
                                                        {prisons.map((prison, index) => (
                                                            <option key={index} value={prison.id}>{prison.prison_name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                        <div className="form-group row">
                                            <label className="col-form-label col-sm-3 pt-0">{t('password')}</label>
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
                                            <label className="col-form-label col-sm-3 pt-0">{t('confirm_password')}</label>
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
                                        <div className="form-group row mb-3">
                                            <label className="col-form-label col-sm-3">Mobile Number</label>
                                            <div className="col-sm-4">
                                                <FormControl className="mb-3" fullWidth>
                                                    <TextField
                                                        type="text"
                                                        name="mobile"
                                                        size="small"
                                                        label="Mobile Number"
                                                        value={form.mobile}
                                                        onChange={(e) => handleMobileChange(e, setForm, form, 'mobile')}
                                                        InputLabelProps={{
                                                            style: {
                                                                fontWeight: 'normal', // Set font weight to normal
                                                                fontSize: '1rem',     // Set font size to normal (you can adjust this as needed)
                                                            },
                                                        }} 
                                                    />
                                                </FormControl>
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label className="col-form-label col-sm-3">Email Address</label>
                                            <div className="col-sm-4">
                                                <TextField
                                                    type="email"
                                                    name="email"
                                                    className={`form-control ${errors.email ? 'is-invalid' : null}`}
                                                    size="small"
                                                    label="Email"
                                                    value={form.email}
                                                    onChange={handleChange}
                                                    InputLabelProps={{
                                                        style: {
                                                            fontWeight: 'normal', // Set font weight to normal
                                                            fontSize: '1rem',     // Set font size to normal (you can adjust this as needed)
                                                        },
                                                    }} 
                                                />
                                                <div className="invalid-feedback">
                                                    { errors.email }
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="form-group row mb-3">
                                            <label htmlFor="photo" className='col-form-label col-sm-3'>Upload Photo</label>
                                            <div className="col-sm-9">
                                                <Button
                                                    component="label"
                                                    role={undefined}
                                                    variant="contained"
                                                    color="secondary"
                                                    tabIndex={-1}
                                                    startIcon={<CloudUploadIcon />}
                                                    >
                                                    Upload file
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
                                                    color="secondary"
                                                    tabIndex={-1}
                                                    startIcon={<CloudUploadIcon />}
                                                    >
                                                    Upload file
                                                    <VisuallyHiddenInput 
                                                        type="file"
                                                        name="identity_proof"
                                                        onChange={(e) => setForm({...form, [e.target.name] : e.target.files[0]})} 
                                                    />
                                                </Button>
                                                <span className="mx-2">{ form.identity_proof.name }</span>
                                            </div>
                                        </div>
                                        { form.user_type === 1 && (
                                        <div className="form-group row mb-3">
                                            <label htmlFor="bar_certificate" className='col-form-label col-sm-3'>Bar Registration Certificate</label>
                                            <div className="col-sm-9">
                                                <Button
                                                    component="label"
                                                    role={undefined}
                                                    variant="contained"
                                                    tabIndex={-1}
                                                    color="secondary"
                                                    startIcon={<CloudUploadIcon />}
                                                    >
                                                    Upload file
                                                    <VisuallyHiddenInput 
                                                        type="file"
                                                        name="registration_certificate"
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.files[0]})} 
                                                    />
                                                </Button>
                                                <span className="mx-2">{ form.registration_certificate.name }</span>
                                            </div>
                                        </div>
                                        )} */}
                                        <div className="d-flex justify-content-center mt-2">
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
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DepartmentRegistration