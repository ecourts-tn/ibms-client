import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import { toast, ToastContainer } from 'react-toastify';
import api from '../../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import { useAuth } from '../../hooks/useAuth';
import highcourtlogo from '../../highcourtlogo.png'
import './header.css'
import axios from 'axios'

import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button'
import LoginIcon from '@mui/icons-material/LockOpen'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next';
import RefreshIcon from '@mui/icons-material/Refresh';


const Login = () => {

    const [loading, setLoading]   = useState(false);
    const {t} = useTranslation()
    const[form, setForm] =  useState({
        usertype: '',
        username:'',
        password:'',
        captcha: ''
    })
    const { login } = useAuth();
    const[errors, setErrors] = useState({})
    const [captchaImageUrl, setCaptchaImageUrl] = useState('');
    const [captchaValid, setCaptchaValid] = useState(null);

    const validationSchema = Yup.object({
        usertype: Yup.string().required(t('errors.usertype_required')),
        username: Yup.string().required(t('errors.username_required')),
        password: Yup.string().required(t('errors.password_required')),
        captcha: Yup.string().required("Please enter captcha")
    })

    useEffect(() => {
        fetchCaptcha();
      }, []);
    
    const fetchCaptcha = async () => {
        try {
            const response = await api.get('auth/generate-captcha/', {
                responseType: 'blob',
                withCredentials: true,  // Ensure session cookies are included
            });
            const imageBlob = URL.createObjectURL(response.data);
            setCaptchaImageUrl(imageBlob);
        } catch (error) {
            console.error('Error fetching CAPTCHA:', error);
        }
    };



    const verifyCaptcha = async () => {
        try {
          const response = await api.post('auth/verify-captcha/', {
            captcha: form.captcha},{
            withCredentials: true,  // Ensure session cookies are included
            });
          if (response.data.success) {
            setCaptchaValid(true);
            return true;
          } else {
            setCaptchaValid(false);
            fetchCaptcha(); 
            return false;
          }
        } catch (error) {
          console.error('Error verifying CAPTCHA:', error);
        }
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try{
            await validationSchema.validate(form, {abortEarly: false})
            const isCaptchaValid = await verifyCaptcha();
            if(isCaptchaValid){
                const {username, password, usertype} = form
                const response = await api.post('auth/public/login/', { usertype, username, password }, {
                    skipInterceptor: true // Custom configuration to skip the interceptor
                })
                sessionStorage.clear()
                sessionStorage.setItem(ACCESS_TOKEN, response.data.access);
                sessionStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                await login(response.data)
                toast.success('logged in successfully', {
                    theme: "colored"
                })
            }
            setLoading(false);
        }catch(error){
            if(error.inner){
                setLoading(false)
                const newErrors = {};
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message;
                });
                setErrors(newErrors);
                return
            }
            if(error.response){
                const { status, data } = error.response
                switch(status){
                    case 400:
                        toast.error(t('alerts.invalid_credentials'), {theme: "colored"})
                        setLoading(false)
                        break;
                    case 401:
                        toast.error(t('alerts.not_authorized'), {theme:"colored"})
                        setLoading(false)
                        break;
                    case 403:
                        toast.error(t('alerts.not_activated'), {theme:"colored"})
                        setLoading(false)
                        break;
                    case 404:
                        toast.error(data.message, {theme:"colored"})
                        setLoading(false)
                        break;
                    default:
                        toast.error(error, {theme:"colored"})
                        setLoading(false)
                }
            }
        }
    }

    console.log(errors)
    return (
        <>
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="text-center mb-4">
                            <img className="mb-2" src={highcourtlogo} alt width={70} height={70} />
                            <h1 className="h4 mb-3 font-weight-bold">{t('signin')}</h1>
                        </div>    
                    </div>
                    <div className="col-md-12">
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            className="d-flex justify-content-center"
                            value={form.usertype}
                            onChange={(e) => setForm({...form, usertype: e.target.value})}
                        >
                            <FormControlLabel value={1} control={<Radio />} label={t('advocate')} />
                            <FormControlLabel value={2} control={<Radio />} label={t('litigant')} />
                        </RadioGroup>
                        <p className="text-danger mb-3 text-center" style={{marginTop:'-15px', fontSize:'14px', fontWeight:'bold'}}>{ errors.usertype }</p>
                    </div>
                    <div className="col-md-12">
                        <div className="form-group mb-3">
                            <FormControl fullWidth>
                                <TextField
                                    error={ errors.username ? true : false }
                                    helperText={ errors.username }
                                    label={`${t('mobile')}/${t('email')}/${t('bar_code')}`}
                                    size="small"
                                    name="username"
                                    value={ form.username }
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                />
                            </FormControl>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="form-group mb-3">
                            <FormControl fullWidth>
                                <TextField
                                    error={ errors.password ? true : false }
                                    helperText={errors.password}
                                    label={t('password')}
                                    size="small"
                                    type="password"
                                    name="password"
                                    value={ form.password }
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                />
                            </FormControl>
                        </div>
                    </div>
                    <div className="col-md-6 d-flex">
                        {captchaImageUrl && (<img src={captchaImageUrl} alt="CAPTCHA" className='img-captcha'/>)}
                        <button className="btn bg-olive btn-captcha" onClick={fetchCaptcha} type="button"><RefreshIcon /></button>                    
                    </div>
                    <div className="col-md-6">
                        <input
                            type="text"
                            name="captcha"
                            value={form.captcha}
                            onChange={(e) => setForm({...form, [e.target.name]:e.target.value})}
                            placeholder="Enter CAPTCHA"
                            className={`form-control ${errors.captcha ? 'is-invalid': ''}`}
                        />
                        <div className="invalid-feedback">
                            { errors.captcha }
                        </div>
                    </div>
                    <div className="col-md-12">
                        {captchaValid === false && <span className='text-danger pt-1' style={{fontSize:'12px'}}><strong>{t('alerts.captcha_failed')}</strong></span>}
                        <div className="form-group my-2">
                            <input type="checkbox" defaultValue="remember-me" style={{ width:20}} />{t('remember_me')}
                        </div>
                        <FormControl fullWidth>
                            <Button 
                                variant="contained" 
                                endIcon={<LoginIcon />}
                                type="submit"
                                color="success"
                            >{t('signin')}</Button>
                        </FormControl>
                        { loading && (
                            <div className="d-flex justify-content-center pt-1 pb-3">
                                <Spinner animation="border" variant="primary" style={{ height:50, width:50}}/>
                            </div>
                        )}
                        <div className="mt-1">
                            <p><a href="#">{t('forgot_password')}</a></p>
                            <p className="d-flex justify-content-end">{t('register_txt')}&nbsp;<Link to="user/registration">{t('register')}</Link></p>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default Login



