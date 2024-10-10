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

// const Search = styled('div')(({ theme }) => ({
//     position: 'relative',
//     borderRadius: theme.shape.borderRadius,
//     backgroundColor: alpha(theme.palette.common.white, 0.15),
//     '&:hover': {
//       backgroundColor: alpha(theme.palette.common.white, 0.25),
//     },
//     borderColor:'green',
//     marginLeft: 0,
//     width: '100%',
//     [theme.breakpoints.up('sm')]: {
//       marginLeft: theme.spacing(1),
//       width: 'auto',
//     },
//   }));
  
//   const SearchIconWrapper = styled('div')(({ theme }) => ({
//     padding: theme.spacing(0, 2),
//     height: '100%',
//     borderColor:'green',
//     position: 'absolute',
//     pointerEvents: 'none',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   }));
  
//   const StyledInputBase = styled(InputBase)(({ theme }) => ({
//     color: 'inherit',
//     width: '100%',
//     borderColor:'green',
//     '& .MuiInputBase-input': {
//       padding: theme.spacing(1, 1, 1, 0),
//       // vertical padding + font size from searchIcon
//       paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//       transition: theme.transitions.create('width'),
//       [theme.breakpoints.up('sm')]: {
//         width: '12ch',
//         '&:focus': {
//           width: '20ch',
//         },
//       },
//     },
//   }));

const Login = () => {

    const [loading, setLoading]   = useState(false);
    const {t} = useTranslation()
    const[form, setForm] =  useState({
        usertype: '',
        username:'',
        password:''
    })
    const { login } = useAuth();
    const[errors, setErrors] = useState({})

    const validationSchema = Yup.object({
        usertype: Yup.string().required("Please select the usertype"),
        username: Yup.string().required("Username is required"),
        password: Yup.string().required("Password is required")
    })

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try{
            await validationSchema.validate(form, {abortEarly: false})
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
                        toast.error(data.message, {theme: "colored"})
                        setLoading(false)
                        break;
                    case 401:
                        toast.error(data.message, {theme:"colored"})
                        setLoading(false)
                        break;
                    case 403:
                        toast.error(data.message, {theme:"colored"})
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

    return (
        <>
            <ToastContainer />
            <div className="text-center mb-4">
                <img className="mb-2" src={highcourtlogo} alt width={70} height={70} />
                <h1 className="h4 mb-3 font-weight-bold">{t('signin')}</h1>
            </div>    
            <form onSubmit={handleSubmit}>
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
                
                <div className="form-group mb-3">
                    <FormControl fullWidth className="mb-3">
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
                    <FormControl fullWidth className="mb-3">
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
                    <div className="form-group mb-1">
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
                </div>
                { loading && (
                    <div className="d-flex justify-content-center pt-1 pb-3">
                        <Spinner animation="border" variant="primary" style={{ height:50, width:50}}/>
                    </div>
                )}
                <div className="mt-1">
                    <p><a href="#">{t('forgot_password')}</a></p>
                    <p className="d-flex justify-content-end">{t('register_txt')}&nbsp;<Link to="user/registration">{t('register')}</Link></p>
                </div>
            </form>
        </>
    )
}

export default Login
