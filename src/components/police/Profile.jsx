import React, {useState, useEffect} from 'react'
import Button from '@mui/material/Button'
import Form from 'react-bootstrap/Form'
import { toast, ToastContainer } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux'
import { getStates, getStatesStatus } from '../../redux/features/StateSlice'
import { getDistrictByStateCode } from '../../redux/features/DistrictSlice'
import { getTalukByDistrictCode } from '../../redux/features/TalukSlice'
import { getRelations } from '../../redux/features/RelationSlice';
import api from '../../api';
import * as Yup from 'yup'

const Profile = () => {

    const dispatch = useDispatch()

    const states = useSelector((state) => state.states.states)
    const districts = useSelector((state) => state.districts.districts)
    const taluks = useSelector((state) => state.taluks.taluks)
    const relations = useSelector(state => state.relations.relations)
    const stateStatus = useSelector(getStatesStatus)

    const initialState = {
        petitioner_name:'',
        designation:'',
        gender:'',
        age:'',
        relation:'',
        relation_name:'',
        state:'',
        district:'',
        taluk:'',
        address:'',
        post_office:'',
        pincode:'',
        mobile_number:'',
        email_address:'',
    }
    const[form, setForm] = useState(initialState)

    const validationSchema = Yup.object({
        petitioner_name: Yup.string().required(),
        designation: Yup.string().required(),
        gender: Yup.string().required(),
        age:Yup.string().required(),
        relation:Yup.string().required(),
        relation_name:Yup.string().required(),
        state:'',
        district:'',
        taluk:'',
        address:Yup.string().required(),
        post_office:Yup.string().required(),
        pincode:Yup.string().required(),
        mobile_number:Yup.string().required(),
        email_address:Yup.string().required(),
    })
    
    const[errors, setErrors] = useState([])

    useEffect(() => {
        if(stateStatus === 'idle'){
          dispatch(getStates())
        }
    },[stateStatus, dispatch])
      
    useEffect(() => {
        if(form.state !== ''){
          dispatch(getDistrictByStateCode(form.state))
        }
    },[form.state, dispatch])
    
    useEffect(() => {
        if(form.district !== ''){
          dispatch(getTalukByDistrictCode(form.district))
        }
    },[form.district, dispatch])
    
    useEffect(() => {
        dispatch(getRelations())
    }, [dispatch])

    const handleSubmit = async(e) => {
        e.preventDefault()
    }

    return (
        <div className="content-wrapper">
            <div className="container-fluid mt-3">
                <div className="card card-outline card-primary">
                    <div className="card-header">
                        Profile
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row">  
                                <div className="col-md-3">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Name of the Petitioner</Form.Label>
                                        <Form.Control
                                            name="litigant_name" 
                                            className={`${errors.litigant_name ? 'is-invalid' : ''}`}
                                            value={form.litigant_name} 
                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                        ></Form.Control>
                                        <div className="invalid-feedback">{ errors.litigant_name }</div>
                                    </Form.Group>
                                </div>
                                <div className="col-md-3">
                                    <Form.Group>
                                        <Form.Label>Designation</Form.Label>
                                        <Form.Control
                                            name="designation"
                                            value={form.designation}
                                            className={`${errors.designation ? 'is-invalid' : ''}`}
                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                        ></Form.Control>
                                        <div className="invalid-feedback">{ errors.designation }</div>
                                    </Form.Group>
                                </div>
                                <div className="col-md-2">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Gender</Form.Label>
                                        <select 
                                            name="gender" 
                                            value={form.gender} 
                                            className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <div className="invalid-feedback">{ errors.gender }</div>
                                    </Form.Group>
                                </div>
                                <div className="col-md-2">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Age</Form.Label>
                                        <Form.Control
                                            name="age"
                                            value={form.age}
                                            className={`${errors.age ? 'is-invalid' : ''}`}
                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                        ></Form.Control>
                                        <div className="invalid-feedback">{ errors.age }</div>
                                    </Form.Group>
                                </div>
                                <div className="col-md-2">
                                    <div className="form-group mb-3">
                                        <label htmlFor="relation">Relation</label><br />
                                        <select 
                                        name="relation" 
                                        id="relation" 
                                        className={`form-control ${errors.relation ? 'is-invalid' : ''}`}
                                        value={form.relation}
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                        >
                                        <option value="">Select relation</option>
                                        { relations.map((item, index) => (
                                            <option key={index} value={item.relation_name}>{ item.relation_name }</option>
                                        )) }
                                        </select>
                                        <div className="invalid-feedback">{ errors.relation }</div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Relation Name</Form.Label>
                                        <Form.Control
                                            name="relation_name"
                                            value={form.relation_name}
                                            className={`${errors.relation_name ? 'is-invalid' : ''}`}
                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                        ></Form.Control>
                                        <div className="invalid-feedback">{ errors.relation_name }</div>
                                    </Form.Group>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="state">State</label><br />
                                        <select 
                                            name="state" 
                                            id="state" 
                                            className="form-control"
                                            value={form.state}
                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                        >
                                            <option value="">Select state</option>
                                            { states.map((item, index) => (
                                            <option value={item.state_code} key={index}>{item.state_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="district">District</label><br />
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
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="taluk">Taluk</label><br />
                                        <select 
                                            name="taluk" 
                                            id="taluk" 
                                            className="form-control"
                                            value={form.taluk}
                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                        >
                                            <option value="">Select Taluk</option>
                                            { taluks.map((item, index) => (
                                            <option value={item.taluk_code} key={index}>{ item.taluk_name }</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control
                                            name="address"
                                            value={form.address}
                                            className={`${errors.address ? 'is-invalid' : ''}`}
                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                        ></Form.Control>
                                        <div className="invalid-feedback">{ errors.address }</div>
                                    </Form.Group>
                                </div>
                                <div className="col-md-2">
                                    <Form.Group>
                                        <Form.Label>Post Office</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="post_office"
                                            value={form.post_office}
                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                        ></Form.Control>
                                    </Form.Group>
                                </div>
                                <div className="col-md-2">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Pincode</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="pincode"
                                            value={form.pincode}
                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                        ></Form.Control>
                                    </Form.Group>
                                </div>
                                <div className="col-md-2">
                                    <Form.Group>
                                        <Form.Label>Mobile Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="mobile_number"
                                            className={`${errors.mobile_number ? 'is-invalid' : ''}`}
                                            value={form.mobile_number}
                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                        ></Form.Control>
                                        <div className="invalid-feedback">
                                        { errors.mobile_number}
                                        </div>
                                    </Form.Group>
                                </div>
                                <div className="col-md-2">
                                    <Form.Group>
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="email_address"
                                            value={form.email_address}
                                            className={`${errors.email_address ? 'is-invalid' : ''}`}
                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                        ></Form.Control>
                                        <div className="invalid-feedback">{ errors.email_address }</div>
                                    </Form.Group>
                                </div>
                                <div className="col-md-12">
                                    <Button
                                        variant="contained"
                                        color="success"
                                    >Save</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile