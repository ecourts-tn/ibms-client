import api from 'api';
import * as Yup from 'yup';
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/LockOpen';
import RefreshIcon from '@mui/icons-material/Refresh';
import Loading from 'components/utils/Loading';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';
import { AuthContext } from 'contexts/AuthContext';
import { IconButton } from '@mui/material'; 
import { Visibility, VisibilityOff } from '@mui/icons-material'; 
import { GroupContext } from 'contexts/GroupContext';
import { MasterContext } from 'contexts/MasterContext';
import {encryptData, decryptData} from 'utils';
// import bcrypt from 'bcryptjs';  

const Login = () => {
  // const { groups}     = useContext(GroupContext)
  const { masters: {groups, departments}} = useContext(MasterContext)
  const { language }  = useContext(LanguageContext);
  const { t }         = useTranslation();
  const { login }     = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [isDepartment, setIsDepartment] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaText, setCaptchaText] = useState("");
  const [errors, setErrors] = useState({});
  const [is2FA, setIs2FA] = useState(false)
  const [otp, setOtp] = useState('')
  const [form, setForm] = useState({
    usertype: '',
    username: '',
    password: '',
    captcha: '',
    remember: false
  });

  const validationSchema = Yup.object({
    usertype: Yup.string().required(t('errors.usertype_required')),
    username: Yup.string().required(t('errors.username_required')),
    password: Yup.string().required(t('errors.password_required')),
    captcha: Yup.string().required(t('errors.captcha_required')),
  });

  const fetchCaptcha = async () => {
    try {
        const response = await api.get("auth/captcha/generate/", {
          withCredentials:true
        })

        if (response.status === 200) {
            setCaptchaText(response.data.captcha);
        }
    } catch (error) {
        console.error("Error fetching captcha:", error);
    }
};



  useEffect(() => {
    fetchCaptcha()
  },[])

  const handleOtpSubmit = (e) => {
    e.preventDefault()
  }


  // Function to refresh the CAPTCHA
  const refreshCaptcha = () => {
    fetchCaptcha();
    setForm({ ...form, captcha: '' });
  };

  const handleCheckBox = () =>{
    setForm({...form, remember: !form.remember})
  }


  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
        await validationSchema.validate(form, { abortEarly: false });
        const response = await api.post('auth/login/', form, { skipInterceptor: true });

        // Call the login function from AuthContext
        await login(response.data, form.remember);
        // const encrypted = encryptData(response);
        // console.log("Encrypted:", encrypted);
        // const decrypted = decryptData(encrypted, response);
        // console.log("Decrypted:", decrypted);
        // toast.success('Logged in successfully', { theme: 'colored' });

    } catch (error) {
        console.error("Error during login:", error); // Debugging log

        if (error.inner) {
            const newErrors = {};
            error.inner.forEach((err) => {
                newErrors[err.path] = err.message;
            });
            setErrors(newErrors);
        } else if (error.response) {
            const { status, data } = error.response;
            switch (status) {
                case 400:
                case 404:
                    toast.error(data.message, { theme: 'colored' });
                    break;
                case 401:
                    toast.error(t?.('alerts.not_authorized') || "Not Authorized", { theme: 'colored' });
                    break;
                case 403:
                    toast.error(t?.('alerts.not_activated') || "Account Not Activated", { theme: 'colored' });
                    break;
                default:
                    console.error("Unexpected error:", error);
                    toast.error(error.message || "An unexpected error occurred", { theme: 'colored' });
            }
        }
    } finally {
        setLoading(false);
    }
};


  return (
    <React.Fragment>
      <ToastContainer />
      {loading && <Loading />}
        <React.Fragment>
          <div className="row">
            <div className="col-md-12">
              <div className="text-center mb-4">
                <img
                  className="mb-2"
                  src={`${process.env.PUBLIC_URL}/images/highcourtlogo.png`}
                  alt="High Court"
                  width={70}
                  height={70}
                />
                <h1 className="h4 mb-3 font-weight-bold">{t('signin')}</h1>
              </div>
            </div>
          </div>
        { !is2FA ? (
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12 d-flex justify-content-center">
                <div className="form-group">
                  <div className="custom-control custom-switch">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="customSwitch1"
                      onChange={() => setIsDepartment(!isDepartment)}
                    />
                    <label className="custom-control-label" htmlFor="customSwitch1">
                      {t('department_user')}
                    </label>
                  </div>
                </div>
              </div>
              {!isDepartment && (
                <div className="col-md-12">
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    className="d-flex justify-content-center"
                    value={form.usertype}
                    onChange={(e) => setForm({ ...form, usertype: e.target.value })}
                  >
                    <FormControlLabel value={1} control={<Radio />} label={t('advocate')} />
                    <FormControlLabel value={2} control={<Radio />} label={t('litigant')} />
                  </RadioGroup>
                  <p
                    className="text-danger mb-3 text-center"
                    style={{ marginTop: '-15px', fontSize: '14px', fontWeight: 'bold' }}
                  >
                    {errors.usertype}
                  </p>
                </div>
              )}
              {isDepartment && (
                <div className="col-md-12">
                  <div className="form-group">
                    <label htmlFor="">{t('usertype')}</label>
                    <select
                      name="usertype"
                      className="form-control"
                      onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                    >
                      <option value="">{t('alerts.select_usertype')}</option>
                      {departments
                        .filter((d) => d.display)
                        .map((d, index) => (
                          <option key={index} value={d.id}>
                            {language === 'ta' ? d.department_lname : d.department_name }
                          </option>
                        ))}
                    </select>
                  </div>
                  {/* <div className="form-group">
                    <label htmlFor="">{t('usertype')}</label>
                    <select
                      name="usertype"
                      className="form-control"
                      onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                    >
                      <option value="">{t('alerts.select_usertype')}</option>
                      {departments.map((d, index) => (
                          <option key={index} value={d.id}>
                            {language === 'ta' ? d.department_lname : d.department_name}
                          </option>
                        ))}
                    </select>
                  </div> */}
                </div>
              )}
              <div className="col-md-12">
                <div className="form-group mb-3">
                  <FormControl fullWidth>
                    <TextField
                      error={errors.username ? true : false}
                      helperText={errors.username}
                      label={`${t('mobile')}/${t('email')}/${t('username')}`}
                      size="small"
                      name="username"
                      value={form.username}
                      onChange={(e) =>
                        setForm({ ...form, [e.target.name]: e.target.value.trim() })
                      }
                    />
                  </FormControl>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group mb-3">
                  <FormControl fullWidth>
                    <div className="input-group" style={{ position: 'relative' }}>
                      <input
                        className={`form-control ${errors.password ? 'is-invalid' : null }`}
                        error={errors.password ? true : false}
                        helperText={errors.password}
                        label={t('password')}
                        size="small"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value.trim() })}
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
              <div className="col-md-7">
                <div class="input-group mb-3">
                  <input 
                    type="text" 
                    className="form-control captcha-text"
                    value={captchaText}
                    onClick={refreshCaptcha}
                    disabled={true}
                    style={{
                      cursor:"not-allowed",
                      backgroundColor:"#FAFAFA"
                    }}
                  />
                  <div class="input-group-append">
                    <span 
                      class="input-group-text bg-info"
                      onClick={refreshCaptcha}
                    ><RefreshIcon /></span>
                  </div>
                </div>
              </div>
              <div className="col-md-5">
                <FormControl fullWidth>
                  <TextField
                    error={errors.captcha ? true : false}
                    helperText={errors.captcha}
                    label={`${t('Captcha')}`}
                    size="small"
                    name="captcha"
                    value={form.captcha}
                    onChange={(e) =>
                      setForm({ ...form, [e.target.name]: e.target.value.trim() })
                    }
                  />
                </FormControl>
                <div className="invalid-feedback">
                  {errors.captcha}
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group my-2">
                  <input 
                    type="checkbox" 
                    checked={form.remember} 
                    style={{ width: 20 }} 
                    onChange={handleCheckBox}
                  />
                  {t('remember_me')}
                </div>
                <FormControl fullWidth>
                  <Button variant="contained" endIcon={<LoginIcon />} type="submit" color="success">
                    {t('signin')}
                  </Button>
                </FormControl>
                <div className="mt-1">
                  <p><Link to="auth/reset-password">{t('forgot_password')}</Link></p>
                  <p className="d-flex justify-content-end">{t('register_txt')}&nbsp;<Link to="auth/registration">{t('register')}</Link></p>
                </div>
              </div>
            </div>
          </form>
        ): (
          <form onSubmit={handleOtpSubmit}>
            <div className="row mt-3">
              <div className="col-md-12">
                <div className="form-group">
                  <label htmlFor="otp" className="mb-3">{t('alerts.mobile_otp_sent')}</label>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="form-control"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <Button variant="contained" type="submit" color="success">
              {t('verify')}
            </Button>
          </form>
        )}
      </React.Fragment>
    </React.Fragment>
  );
};

export default Login;