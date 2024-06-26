import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import { toast, ToastContainer } from 'react-toastify';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { getUserTypes, getUserTypeStatus } from '../redux/features/UserTypeSlice';
import highcourtlogo from '../../highcourtlogo.png'
import './header.css'


const Login = () => {

    const [loading, setLoading]   = useState(false);
    const[form, setForm] =  useState({
        usertype: '',
        username:'',
        password:''
    })

    const userStatus = useSelector(getUserTypeStatus)
    const usertype = useSelector(state=>state.usertypes.usertypes)

    const dispatch = useDispatch()

    const navigate = useNavigate();

    useEffect(() => {
        if( userStatus === 'idle'){
            dispatch(getUserTypes())
        }
    }, [userStatus, dispatch]);

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        if(form.username === ""){
            toast.error("Please enter username", {
                theme: "colored"
            })
            setLoading(false)
            return false
        }

        if(form.password === ""){
            toast.error("Please enter username", {
                theme: "colored"
            })
            setLoading(false)
            return false
        }

        if(form.usertype === ""){
            toast.error("Please select user type", {
                theme: "colored"
            })
            setLoading(false)
            return false;
        }

        try {
            const {username, password, usertype} = form
            const res = await api.post('api/login/', { usertype, username, password })
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            toast.success('logged in successfully', {
                theme: "colored"
            })
            navigate("/dashboard")
        } catch (error) {
            if(error.response.status === 401){
                toast.error("Invalid username or password", {
                    theme: "colored"
                });
                setLoading(false)
                navigate("/")
            }
            if(error.response.status === 403){
                toast.error( error.response.data.message , {
                    theme: "colored"
                });
                setLoading(false)
                navigate("/")
            }
        } 
    }

    return (
        <>
            <Container>
                <Row className='py-2'>
                    <Col md={4} className="my-3" style={{ backgroundColor:'lightblue', padding:'5px', borderRadius:'10px'}}>
                        <ToastContainer />
                        <div className="text-center mb-4">
                            <img className="mb-2" src={highcourtlogo} alt width={70} height={70} />
                            <h1 className="h4 mb-3 font-weight-bold">Sign In</h1>
                        </div>    
                        <form className="form-signin" onSubmit={handleSubmit} style={{ backgroundColor:'lightblue', boxShadow:'none'}}>
                            <div className="form-group mb-3">
                                <select 
                                    name="usertype" 
                                    id="usertype" 
                                    className="form-control"
                                    value={form.usertype}
                                    onChange={(e) => setForm({...form, [e.target.name]:e.target.value})}    
                                >
                                    <option value="">Select user type</option>
                                    { usertype.map( (item, index) => (
                                        <option key={index} value={item.id}>{item.user_type}</option>)
                                    )}
                                </select>
                            </div>
                            <div className="form-group mb-3">
                                <input  
                                    type="text" 
                                    id="username" 
                                    className="form-control" 
                                    name="username"
                                    placeholder="Username/Mobile/Email/Bar. Code"  
                                    value={form.username}
                                    onChange={(e) => setForm({...form, username: e.target.value})}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <input 
                                    type="password" 
                                    id="password" 
                                    name="password"
                                    className="form-control" 
                                    placeholder="Password"  
                                    value={form.password}
                                    onChange={(e) => setForm({...form, password: e.target.value})}
                                />              
                            </div>
                            <div className="form-group mb-1">
                                <input type="checkbox" defaultValue="remember-me" style={{ width:20}} /> Remember me
                            </div>
                            { loading && (
                                <div className="d-flex justify-content-center pt-1 pb-3">
                                    <Spinner animation="border" variant="primary" style={{ height:50, width:50}}/>
                                </div>
                            )}
                            <button className="btn btn-block btn-signin">Sign in</button>
                            <div className="mt-1">
                                <p><a href="#">Forgot&nbsp;password?</a></p>
                                <p className="d-flex justify-content-end">Don't have an account?&nbsp;<Link to="register"> Register</Link></p>
                            </div>
                        </form>
                    </Col>
                    <Col md={8} className="mt-5">
                        <div className="ml-5">
                            <h2 className="section-heading">About IBMS</h2>
                            <p className="text-justify" style={{lineHeight: '1.5rem'}}>Integrated Bail Management System is a complete end to end solution developed for online filing of various applications such as Bail Applications, Anticipatory Bail Applications, Condition Relaxation, Intervene Petition, Modification Petition, Discharge of Surety, Return of Passport, Extension of Time and Cancellation of Bail. All the applications can be filed before Madras High Court or District Courts of Tamil Nadu. It is designed in Bilingual (English and local language) to reach wider group covering advocates/litigants.<br /><br />
                            <strong>IBMS system provides several benefits;</strong> 
                            </p><ul style={{lineHeight: '1.5rem'}}>
                                <li>Save time, money, travel of advocates, litigants and government officials </li>
                                <li>Obviate the need to physically visit the court</li>
                                {/* <li>Reduce the need of meetings between clients and advocates</li> */}
                                <li>Automatic digitization of case records</li>
                                <li>Positive impact on environment by reducing paper footprint</li> 
                            </ul>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Login
