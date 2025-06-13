import React, {useState, useEffect, useContext} from 'react'
import Button from '@mui/material/Button'
import Form from 'react-bootstrap/Form'
import * as Yup from 'yup'
import { MasterContext } from 'contexts/MasterContext';
import { RequiredField } from 'utils';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';

const Profile = () => {

    const {masters:{
        states,
        districts,
        taluks,
        relations,
        designations,
        genders
    }} = useContext(MasterContext)
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)

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
        litigant_name: Yup.string().required('Litigant name is required'),
        designation: Yup.string().required('Designation is required'),
        gender: Yup.string().required('Gender is required'),
        age:Yup.string().required('Age is requried').matches(/^\d{1,2}$/, 'Age must be less than 99'),
        relation:Yup.string().required('Relation is required'),
        relation_name:Yup.string().required('Relation name is required'),
        state: Yup.string().required('State is required'),
        district: Yup.string().required('District is required'),
        taluk: Yup.string().required('Taluk is required'),
        address:Yup.string().required('Address is requried'),
        post_office:Yup.string().required('Post office is required'),
        pincode:Yup.string().required('Pincode is required').matches(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
        mobile_number:Yup.string().required('Mobile number is requried').matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
        email_address:Yup.string().email('Invalid email address').required('Email address is requried'),
    })
    
    const[errors, setErrors] = useState([])

    const handleSubmit = async(e) => {
        e.preventDefault()
        try{
            await validationSchema.validate(form, {abortEarly:false})
        }catch(error){
            console.log(error.inner)
            if(error.inner){
                const newErrors = {}
                error.inner.forEach(err => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
            }
        }
    }

    return (
        <div className="card card-outline card-primary">
            <div className="card-header">
                <strong>Profile</strong>
            </div>
            <div className="card-body">
                <div className="row">  
                    <div className="col-md-3">
                        <Form.Group className="mb-3">
                            <Form.Label>Name of the Petitioner<RequiredField /></Form.Label>
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
                            <Form.Label>{t('designation')} <RequiredField /></Form.Label>
                            <select 
                                name="designation" 
                                className={`form-control ${errors.designation ? 'is-invalid' : ''}` }
                                value={form.designation}
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                            >
                                <option value="">{t('alerts.select_designation')}</option>
                                { designations.map((d, index) => (
                                    <option key={index} value={d.id}>{language === 'ta' ? d.designation_lname : d.designation_name }</option>
                                ))}
                            </select>
                            <div className="invalid-feedback">{ errors.designation }</div>
                        </Form.Group>
                    </div>
                    <div className="col-md-2">
                        <Form.Group className="mb-3">
                            <Form.Label>{t('gender')}<RequiredField /></Form.Label>
                            <select 
                                name="gender" 
                                value={form.gender} 
                                className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                            >
                                <option value="Select">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            <div className="invalid-feedback">{ errors.gender }</div>
                        </Form.Group>
                    </div>
                    <div className="col-md-2">
                        <Form.Group className="mb-3">
                            <Form.Label>{t('age')} <RequiredField /></Form.Label>
                            <Form.Control
                                name="age"
                                value={form.age}
                                className={`${errors.age ? 'is-invalid' : ''}`}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '')
                                    if(value.length <= 2){
                                        setForm({...form, [e.target.name]: value})

                                    }}
                                }
                            ></Form.Control>
                            <div className="invalid-feedback">{ errors.age }</div>
                        </Form.Group>
                    </div>
                    <div className="col-md-2">
                        <div className="form-group mb-3">
                            <label htmlFor="relation">{t('relationship_type')} <RequiredField /></label><br />
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
                            <Form.Label>{t('relationship_name')} <RequiredField /></Form.Label>
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
                            <label htmlFor="state">{t('state')} <RequiredField /></label>
                            <select 
                                name="state" 
                                className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                                value={form.state}
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                            >
                                <option value="">Select state</option>
                                { states.map((item, index) => (
                                <option value={item.state_code} key={index}>{item.state_name}</option>
                                ))}
                            </select>
                            <div className="invalid-feedback">{ errors.state }</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="district">{t('district')} <RequiredField /></label>
                            <select 
                                name="district" 
                                className={`form-control ${errors.district ? 'is-invalid' : ''}`}
                                value={form.district}
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                            >
                                <option value="">Select District</option>
                                { districts.filter(d=>parseInt(d.state) === parseInt(form.state)).map((item, index) => (
                                <option value={item.district_code} key={index}>{item.district_name}</option>
                                ))}
                            </select>
                            <div className="invalid-feedback">{ errors.district }</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="taluk">{t('taluk')} <RequiredField /></label>
                            <select 
                                name="taluk" 
                                className={`form-control ${errors.district ? 'is-invalid' : ''}`}
                                value={form.taluk}
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                            >
                                <option value="">Select Taluk</option>
                                { taluks.filter(t=>parseInt(t.district) === parseInt(form.district)).map((item, index) => (
                                <option value={item.taluk_code} key={index}>{ item.taluk_name }</option>
                                ))}
                            </select>
                            <div className="invalid-feedback">{ errors.taluk }</div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <Form.Group className="mb-3">
                            <Form.Label>{t('address')} <RequiredField /></Form.Label>
                            <Form.Control
                                name="address"
                                value={form.address}
                                className={`${errors.address ? 'is-invalid' : ''}`}
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                            ></Form.Control>
                            <div className="invalid-feedback">{ errors.address }</div>
                        </Form.Group>
                    </div>
                    <div className="col-md-4">
                        <Form.Group>
                            <Form.Label>{t('post_office')} <RequiredField /></Form.Label>
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
                            <Form.Label>{t('pincode')} <RequiredField /></Form.Label>
                            <Form.Control
                                type="text"
                                name="pincode"
                                className={`${errors.pincode ? 'is-invalid' : ''}`}
                                value={form.pincode}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '')
                                    if(value.length <= 6){
                                        setForm({...form, [e.target.name]: value})
                                    }
                                }}
                            ></Form.Control>
                            <div className="invalid-feedback">{ errors.pincode }</div>
                        </Form.Group>
                    </div>
                    <div className="col-md-3">
                        <Form.Group>
                            <Form.Label>{t('mobile_number')} <RequiredField /></Form.Label>
                            <Form.Control
                                type="text"
                                name="mobile_number"
                                className={`${errors.mobile_number ? 'is-invalid' : ''}`}
                                value={form.mobile_number}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '')
                                    if(value.length <= 6){
                                        setForm({...form, [e.target.name] :  value})
                                    }
                                }}
                            ></Form.Control>
                            <div className="invalid-feedback">{ errors.mobile_number}</div>
                        </Form.Group>
                    </div>
                    <div className="col-md-4">
                        <Form.Group>
                            <Form.Label>{t('email_address')} <RequiredField /></Form.Label>
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
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <Button
                            variant='contained'
                            color='success'
                            onClick={handleSubmit}
                        >Submit</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile