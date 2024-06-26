import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { getDistricts, getDistrictsStatus } from '../redux/features/DistrictSlice'
import { getUserTypes, getUserTypeStatus } from '../redux/features/UserTypeSlice'
import { getPoliceSationByDistrict, getPoliceStationsStatus } from '../redux/features/PoliceStationSlice'
import { getPrisonsByDistrict, getPrisonsStatus } from '../redux/features/PrisonSlice'
import { useSelector, useDispatch } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import api from '../api'

const Register = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate();

    const districtStatus = useSelector(getDistrictsStatus)
    const policeStatus = useSelector(getPoliceStationsStatus)
    const prisonStatus = useSelector(getPrisonsStatus)
    const userStatus = useSelector(getUserTypeStatus)
    const usertype = useSelector(state=>state.usertypes.usertypes)
    const districts = useSelector(state => state.districts.districts)
    const policeStations = useSelector((state) => state.police_stations.police_stations)
    const prisons = useSelector((state) => state.prisons.prisons)

    const[user, setUser] =  useState([])
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        navigate("/")
    }
    const [form, setForm] = useState({
        user_type: '',
        advocate:'',
        username: '',
        bar_code:'',
        reg_number:'',
        reg_year:'',
        gender: 1,
        date_of_birth: '',
        litigation_place: '',
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
        state_code:''
    })

    const [errors, setErrors] = useState({
        // Define error states for each field
        user_type:'',
        advocate: '',
        state_code:'',
        reg_number:'',
        reg_year:'',
        gender: '',
        date_of_birth: '',
        litigation_place: '',
        district: '',
        police_station:'',
        prison:'',
        password:'',
        confirm_password:'',
        mobile_number:'',
        mobile_otp:'',
        email_address:'',
        email_otp:'',
        idproof:'',
        photo:'',

        // Add more fields as needed
    });


    useEffect(() => {
        if( userStatus === 'idle'){
            dispatch(getUserTypes())
        }
    }, [userStatus, dispatch]);

    useEffect(() => {
        if(districtStatus === 'idle'){
            dispatch(getDistricts())
        }
    },[districtStatus, dispatch])

    useEffect(() => {
        if(form.district !== '' ){
            dispatch(getPoliceSationByDistrict(form.district))
        }
    },[form.district, dispatch])

    useEffect(() => {
        if( form.district !== '' && form.user_type ==5 ){
            dispatch(getPrisonsByDistrict(form.district))
        }
    },[form.district, dispatch])

    const[mobileOtp, setMobileOtp] = useState(false)
    const[emailOtp, setEmailOtp] = useState(false)
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        let isValid = true;
        const newErrors = { ...errors };
        if (!form.advocate && form.advocate.trim() === '') {
            newErrors.advocate = 'Please enter Advocate Name';
            isValid = false;
        } else {
            newErrors.advocate = '';
        }
        if (!form.user_type && form.user_type.trim() === '') {
            newErrors.user_type = 'Please Choose usertype';
            isValid = false;
        } else {
            newErrors.user_type = '';
        }
        if (!form.gender && form.gender.trim() === '') {
            newErrors.gender = 'Please enter gender';
            isValid = false;
        } else {
            newErrors.gender = '';
        }
        if (!form.district && form.district.trim() === '') {
            newErrors.district = 'Please enter district Name';
            isValid = false;
        } else {
            newErrors.district = '';
        } 
        if (!form.password && form.password.trim() === '') {
            newErrors.password = 'Please enter password';
            isValid = false;
        } else {
            newErrors.password = '';
        } 
        if (!form.confirm_password && form.confirm_password.trim() === '') {
            newErrors.confirm_password = 'Please enter confirm_password';
            isValid = false;
        } else {
            newErrors.confirm_password = '';
        }
        if (!form.date_of_birth && form.date_of_birth.trim() === '') {
            newErrors.date_of_birth = 'Please enter date_of_birth';
            isValid = false;
        } else {
            newErrors.date_of_birth = '';
        }
        if (!form.litigation && form.litigation_place.trim() === '') {
            newErrors.litigation = 'Please enter litigation';
            isValid = false;
        } else {
            newErrors.litigation = '';
        }
        if (!form.police_station && form.police_station.trim() === '') {
            newErrors.police_station = 'Please enter police_station';
            isValid = false;
        } else {
            newErrors.police_station = '';
        }
        if (!form.mobile && form.mobile.trim() === '') {
            newErrors.mobile = 'Please enter mobile_number';
            isValid = false;
        } else {
            newErrors.mobile = '';
        }
        if (!form.email && form.email.trim() === '') {
            newErrors.email = 'Please enter email_address';
            isValid = false;
        } else {
            newErrors.email = '';
        }
        if (!form.prison && form.prison.trim() === '') {
            newErrors.prison = 'Please enter prison';
            isValid = false;
        } else {
            newErrors.prison = '';
        }
        if (!form.gender && form.gender.trim() === '') {
            newErrors.gender = 'Please select a gender';
            isValid = false;
        }else{
            newErrors.gender ='';
        }  
        if (!form.idproof && form.idproof.trim() === '') {
            newErrors.idproof = 'Please upload a file';
            isValid = false;
        }else{
            newErrors.idproof ='';
        }     
        if (!form.photo && form.photo.trim() === '') {
            newErrors.photo = 'Please upload a photo';
            isValid = false;
        }else{
            newErrors.photo ='';
        }  
        if (!form.litigation_place && form.litigation_place.trim() === '') {
            newErrors.litigation_place = 'Please select litigation_place';
            isValid = false;
        }else{
            newErrors.litigation_place ='';
        } 
        if (!form.state_code && form.state_code.trim() === '') {
            newErrors.state_code = 'Please select state_code';
            isValid = false;
        }else{
            newErrors.state_code ='';
        }       
        if (!form.reg_number && form.reg_number.trim() === '') {
            newErrors.reg_number = 'Please select reg_number';
            isValid = false;
        }else{
            newErrors.reg_number ='';
        }       
        if (!form.reg_year && form.reg_year.trim() === '') {
            newErrors.reg_year = 'Please select reg_year';
            isValid = false;
        }else{
            newErrors.reg_year ='';
        }       

        if (isValid) {

         
        } else {
            setErrors(newErrors);
        }
        
        // try{
        //     const response = await api.post("/api/auth/register/", form)
        //     setUser(response.data)
        //     setShow(true)
        //     toast.success("User registered successfully", {
        //         theme:"colored"
        //     })
        // }
        // catch(error){
        //     const errors = error.response.data 
        //     for(const err in errors){
        //         toast.error(`${err.toUpperCase()} - ${errors[err]}`, {
        //             theme: "colored"
        //         })
        //     }

        // }
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
                            <div className="card my-2 registration-card">
                            <div className="card-header">
                                <h5><strong>New User Registration</strong></h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-8 offset-2">
                                        <div className="form-group row mb-3">
                                            <label htmlFor="inputEmail3" className="col-sm-3 col-form-label">Usertype</label>
                                            <div className="col-sm-3">
                                                <select 
                                                    name="user_type" 
                                                    className={`form-control ${errors.advocate ? 'is-invalid' : ''}`} 
                                                    value={form.user_type} 
                                                    onChange={(e) => setForm({...form, [e.target.name]:e.target.value})}
                                                >
                                                    <option value="">Select usertype</option>
                                                    <option value="1">Advocate</option>
                                                    <option value="2">Litigant</option>
                                                    <option value="3">Public Prosecuter / APP</option>
                                                    <option value="4">Police</option>
                                                    <option value="5">Prison</option>
                                                </select>
                                                {errors.user_type && <div className="text-danger">{errors.user_type}</div>}
                                            </div>
                                            <div className="col-md-2">
                                                <label htmlFor="">Advocate Name</label>
                                            </div>
                                            <div className="col-sm-4">
                                            <input 
                                                type="text" 
                                                name="username" 
                                                value={form.username}
                                                className="form-control" 
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            />
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label htmlFor="" className="col-sm-3 col-form-label">Gender</label>
                                            <div className="col-sm-4">
                                                <input 
                                                    type="radio" 
                                                    className="mx-2" 
                                                    name="gender"
                                                    value={form.gender}
                                                    checked={ form.gender == 1 ? true : false }
                                                    onChange={(e) => setForm({...form, gender:1})}
                                                />Male
                                                <input 
                                                    type="radio" 
                                                    className="mx-2" 
                                                    name="gender"
                                                    value={form.gender}
                                                    onChange={(e) => setForm({...form, gender:2})}
                                                />Female
                                                <input 
                                                    type="radio" 
                                                    className="mx-2" 
                                                    name="gender"
                                                    value={form.gender}
                                                    onChange={(e) => setForm({...form, gender:3})}
                                                />Other
                                            </div>
                                            <div className="col-sm-2">
                                                <label htmlFor="">Date of Birth</label>
                                            </div>
                                            <div className="col-sm-3">
                                                <input 
                                                    type="date" 
                                                    className="form-control" 
                                                    name="date_of_birth"
                                                    value={form.date_of_birth}
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label htmlFor="" className="col-sm-3 col-form-label">Place of Practice/Litigation</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="radio" 
                                                    className="mx-2" 
                                                    name="litigation_place"
                                                    value={form.litigation_place}
                                                    checked={true}
                                                    onChange={(e) => setForm({...form, [e.target.name]: 1})}
                                                />High Court 
                                                <input 
                                                    type="radio" 
                                                    className="mx-2" 
                                                    name="litigation_place"
                                                    value={form.litigation_place}
                                                    onChange={(e) => setForm({...form, [e.target.name]: 2})}
                                                />District Court
                                            </div>
                                        </div>
                                        { form.user_type == 1 && (
                                            <div className="form-group row mb-3">
                                                <label htmlFor="#" className="col-sm-3 col-form-label">Bar Registration Number</label>
                                                <div className="col-sm-9">
                                                    <div className="row">
                                                        <div className="col-sm-3">
                                                            <input 
                                                                type="text" 
                                                                className="form-control" 
                                                                id="bar_code" 
                                                                placeholder="State Code" 
                                                                name="bar_code"
                                                                value={form.bar_code}
                                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.event})}
                                                            />
                                                        </div>
                                                        <div className="col-sm-3">
                                                            <input 
                                                                type="text" 
                                                                className="form-control" 
                                                                id="reg_number" 
                                                                placeholder="Bar Reg." 
                                                                name="reg_number"
                                                                value={form.reg_number}
                                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                            />
                                                        </div>
                                                        <div className="col-sm-3">
                                                            <input 
                                                                type="text" 
                                                                className="form-control" 
                                                                id="reg_year" 
                                                                placeholder="Bar Year" 
                                                                name="reg_year"
                                                                value={form.reg_year}
                                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        { form.litigation_place == 2 && (
                                            <div className="form-group row mb-3">
                                                <label htmlFor="district" className='col-form-label col-sm-3'>District</label>
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
                                        { form.user_type == 4 && (
                                        <div className="form-group row mb-3">
                                            <label htmlFor="police_station" className='col-form-label col-sm-3'>Police Station</label>
                                            <div className="col-sm-6">
                                                <select 
                                                    name="police_station" 
                                                    id="police_station" 
                                                    className="form-control"
                                                    value={form.police_station}
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.event})}
                                                >
                                                    <option value="">Select Police station</option>
                                                    { policeStations.map((station, index) => (
                                                        <option key={index} value={station.station_code }>{ station.station_name }</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        )}
                                        { form.user_type == 5 && (
                                            <div className="form-group row mb-3">
                                                <label htmlFor="prison" className='col-form-label col-sm-3'>Prison Name</label>
                                            <div className="col-sm-6">
                                                <select 
                                                    name="prison" 
                                                    id="prison" 
                                                    className="form-control"
                                                    value={form.prison}
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} 
                                                >
                                                    <option value="">Select Prison</option>
                                                    { prisons.map((prison, index) => (
                                                        <option key={index} value={prison.prison_code }>{ prison.prison_name }</option>
                                                    ))}
                                                </select>
                                            </div>
                                            </div>
                                        )}
                                        <div className="form-group row">
                                            <label className="col-form-label col-sm-3 pt-0">Password</label>
                                            <div className="col-sm-6">
                                                <input 
                                                    type="password" 
                                                    name="password" 
                                                    className="form-control" 
                                                    value={form.password}
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                />
                                            </div> 
                                        </div>
                                        <div className="form-group row" style={{ marginTop:"-10px"}}>
                                            <div className="col-sm-3"></div>   
                                            <div className="col-sm-9">
                                                <small className="text-muted">
                                                    <ul style={{ marginLeft:"-25px"}}>
                                                        <li>Your password can't be too similar to your other personal information.</li>
                                                        <li>Your password must contain at least 8 characters.</li>
                                                        <li>Your password can't be a commonly used password.</li>
                                                        <li>Your password can't be entirely numeric.</li>
                                                    </ul>
                                                </small> 
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label className="col-form-label col-sm-3 pt-0">Confirm Password</label>
                                            <div className="col-sm-4">
                                                <input 
                                                    type="password" 
                                                    name="confirm_password" 
                                                    className="form-control" 
                                                    value={form.confirm_password}
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label className="col-form-label col-sm-3">Mobile Number</label>
                                            <div className="col-sm-4">
                                                <input 
                                                    type="text" 
                                                    name="mobile" 
                                                    className="form-control" 
                                                    value={form.mobile}
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                />
                                            </div>
                                            <div className="col-sm-2">
                                                <Button 
                                                    variant="secondary" 
                                                    className="btn-block" 
                                                    onClick={(e) => setMobileOtp(true)}
                                                >
                                                    <i className="fa fa-paper-plane mr-1"></i>
                                                    Send OTP</Button>
                                            </div>
                                            { mobileOtp && (
                                                <div className="col-sm-3">
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <input 
                                                                type="text" 
                                                                name="mobile_otp" 
                                                                className="form-control" 
                                                                value={form.mobile_otp}
                                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <Button 
                                                                variant="primary"
                                                            >
                                                            Verify</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label className="col-form-label col-sm-3">Email Address</label>
                                            <div className="col-sm-4">
                                                <input 
                                                    type="email" 
                                                    name="email" 
                                                    className="form-control" 
                                                    value={form.email}
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                />
                                            </div>
                                            <div className="col-sm-2">
                                                <Button 
                                                    variant="secondary" 
                                                    className="btn-block" 
                                                    onClick={(e) => setEmailOtp(true)}
                                                >
                                                    <i className="fa fa-envelope mr-1"></i>
                                                    Send OTP</Button>
                                            </div>
                                            { emailOtp && (
                                                <div className="col-sm-3">
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <input  
                                                                type="text" 
                                                                name="emailOtp" 
                                                                className="form-control" 
                                                                value={form.email_otp}
                                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <Button variant="primary">Verify</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label htmlFor="photo" className='col-form-label col-sm-3'>Upload Photo</label>
                                            <div className="col-sm-9">
                                                <input type="file" />
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label htmlFor="address_proof" className='col-form-label col-sm-3'>Identity Proof</label>
                                            <div className="col-sm-9">
                                            <input type="file" />
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label htmlFor="bar_certificate" className='col-form-label col-sm-3'>Bar Registration Certificate</label>
                                            <div className="col-sm-9">
                                                <input type="file" />
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-center">
                                            <Button
                                                type="submit"
                                                variant="success"
                                                className="px-4"
                                            >
                                                <i className="fa fa-user mr-2"></i>
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
