import React, { useState, useEffect, useContext } from 'react'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { toast, ToastContainer } from 'react-toastify';
import api from 'api';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';
import { handleMobileChange, validateMobile, validateEmail, handleAgeChange, handleBlur, handleNameChange, handlePincodeChange } from 'components/validation/validations';
import { EstablishmentContext } from 'contexts/EstablishmentContext'
import { CourtContext } from 'contexts/CourtContext'
import { PoliceStationContext } from 'contexts/PoliceStationContext'
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";
import { IconButton } from '@mui/material'; 
import { Visibility, VisibilityOff } from '@mui/icons-material'; 
import { MasterContext } from 'contexts/MasterContext'
import { AuthContext } from 'contexts/AuthContext';

const DepartmentRegistration = () => {
    const { user } = useContext(AuthContext)
    const initialState = {
        judiciary: '',
        seat: '',
        bench: '',
        department: '',
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
    const [userRoles, setUserRoles] = useState([])
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

    useEffect(() => {
        if(user){
            setForm({...form, department:user?.department})
        }
    }, [user])


    const handleSubmit = async () => {
        try {
            const post_data = {
                user: form,
                roles: userRoles
            }
            const response = await api.post("auth/user/register/", post_data)
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

    const { establishments } = useContext(EstablishmentContext)
    const { courts } = useContext(CourtContext)
    const { policeStations } = useContext(PoliceStationContext)

    const {masters: {
        states,
        districts,
        prisons,
        departments,
        judiciaries,
        seats,
        benches,
        roles
    }} = useContext(MasterContext)

    const handleCheckboxChange = (roleId) => {
        setUserRoles((prev) =>
          prev.includes(roleId)
            ? prev.filter((id) => id !== roleId) // remove
            : [...prev, roleId]                  // add
        );
      };

    return (
        <div className="card card-outline card-primary">
            <ToastContainer />
            <div className="card-header">
                <h3 className="card-title"><i className="fas fa-users mr-2"></i><strong>User Registration</strong></h3>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group row mb-3">
                                <label htmlFor="" className="col-sm-3">Department</label>
                                <div className="col-sm-9">
                                    <select
                                        name="department"
                                        className="form-control"
                                        value={form.department}
                                        disabled={ user?.department ? true : false }
                                        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                    >
                                        <option value="">Select department</option>
                                        {departments.filter((d) => d.display).map((d, index) => (
                                            <option value={d.id} key={index}>{ language === 'ta' ? d.department_lname : d.department_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row mb-3">
                                <label htmlFor="" className="col-sm-3">Username</label>
                                <div className="col-sm-9">
                                    <input
                                        type="text"
                                        name="username"
                                        value={form.username}
                                        className="form-control"
                                        onChange={(e) => handleNameChange(e, setForm, form, 'username')} 
                                    />
                                </div>
                            </div>
                            { parseInt(form.department) === 1 && (
                            <div className="form-group row mb-3">
                                <label htmlFor="judiciary" className='col-form-label col-sm-3'>Judiciary</label>
                                <div className="col-sm-9">
                                    <select
                                        name="judiciary"
                                        className="form-control"
                                        value={form.judiciary}
                                        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                    >
                                        <option value="">Select State</option>
                                        { judiciaries.map((j, index) => (
                                            <option value={j.id} key={index}>{j.judiciary_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            )}
                            { parseInt(form.judiciary) === 1 && (
                            <React.Fragment>
                                <div className="form-group row mb-3">
                                    <label htmlFor="seat" className='col-form-label col-sm-3'>High Court seat</label>
                                    <div className="col-sm-9">
                                        <select
                                            name="seat"
                                            className="form-control"
                                            value={form.seat}
                                            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                        >
                                            <option value="">Select seat</option>
                                            {seats.map((s, index) => (
                                                <option value={s.seat_code} key={index}>{s.seat_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group row mb-3">
                                    <label htmlFor="bench" className='col-form-label col-sm-3'>Bench</label>
                                    <div className="col-sm-9">
                                        <select
                                            name="bench"
                                            className="form-control"
                                            value={form.bench}
                                            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                        >
                                            <option value="">Select State</option>
                                            {benches.map((b, index) => (
                                                <option value={b.bench_code} key={index}>{b.bench_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </React.Fragment>
                            )}
                            { parseInt(form.judiciary) !== 1 && (
                            <React.Fragment>
                                <div className="form-group row mb-3">
                                    <label htmlFor="state" className='col-form-label col-sm-3'>State</label>
                                    <div className="col-sm-9">
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
                                    <div className="col-sm-9">
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
                            </React.Fragment>
                            )}
                            { (parseInt(form.department) === 1 && parseInt(form.judiciary) === 2) && (
                            <React.Fragment>
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
                                    <div className="col-sm-9">
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
                            </React.Fragment>
                            )}
                            {parseInt(form.department) === 2 && (
                            <div className="form-group row mb-3">
                                <label htmlFor="police_station" className='col-form-label col-sm-3'>Police Station</label>
                                <div className="col-sm-9">
                                    <select
                                        name="police_station"
                                        id="police_station"
                                        className="form-control"
                                        value={form.police_station}
                                        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                    >
                                        <option value="">Select Police station</option>
                                        {policeStations.filter((p) => p.revenue_district === form.district).map((station, index) => (
                                            <option key={index} value={station.cctns_code}>{station.station_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            )}
                            {parseInt(form.department) === 3 && (
                            <div className="form-group row mb-3">
                                <label htmlFor="prison" className='col-form-label col-sm-3'>Prison Name</label>
                                <div className="col-sm-9">
                                    <select
                                        name="prison"
                                        id="prison"
                                        className="form-control"
                                        value={form.prison}
                                        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                    >
                                        <option value="">Select Prison</option>
                                        {prisons.filter((p) => parseInt(p.district) === parseInt(form.district)).map((prison, index) => (
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
                                <div className="col-sm-6">
                                    <input
                                        type="text"
                                        name="mobile"
                                        value={form.mobile}
                                        className='form-control'
                                        onChange={(e) => handleMobileChange(e, setForm, form, 'mobile')}
                                    />
                                </div>
                            </div>
                            <div className="form-group row mb-3">
                                <label className="col-form-label col-sm-3">Email Address</label>
                                <div className="col-sm-6">
                                    <input
                                        type="email"
                                        name="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : null}`}
                                        value={form.email}
                                        onChange={handleChange}
                                    />
                                    <div className="invalid-feedback">
                                        { errors.email }
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row mb-3">
                                <label htmlFor="roles" className="col-sm-3">User roles</label>
                                <div className="col-md-9">
                                    <div className='d-inline mr-3'>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="userRoles"
                                                className="mr-1"
                                                checked={userRoles.includes(1)}
                                                onChange={() => handleCheckboxChange(1)}
                                            />
                                            {'Admin'}
                                        </label>
                                    </div>
                                    {roles.filter((r) => parseInt(r.department) === parseInt(form.department)).map((r, index) => (
                                        <div key={index} className='d-inline mr-3'>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    
                                                    name="roles"
                                                    className="mr-1"
                                                    checked={userRoles.includes(r.id)}
                                                    onChange={() => handleCheckboxChange(r.id)}
                                                />
                                                {r.role_name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
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
    )
}

export default DepartmentRegistration