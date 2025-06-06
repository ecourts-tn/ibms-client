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

    const handleSubmit = async(e) => {
        e.preventDefault()
    }

    return (
        <div className="card card-outline card-primary">
            <div className="card-header">
                <strong>Profile</strong>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
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
                                <Form.Label>Designation<RequiredField/></Form.Label>
                                <select 
                                    name="designation" 
                                    className="form-control"
                                    value={form.designation}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                >
                                    <option value="">Select designation</option>
                                    { designations.map((d, index) => (
                                        <option key={index} value={d.id}>{ language === 'ta' ? d.designation_lname : d.designation_name }</option>
                                    ))}
                                </select>
                                <div className="invalid-feedback">{ errors.designation }</div>
                            </Form.Group>
                        </div>
                        <div className="col-md-2">
                            <Form.Group className="mb-3">
                                <Form.Label>Gender<RequiredField/></Form.Label>
                                <select 
                                    name="gender" 
                                    value={form.gender} 
                                    className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                >
                                    <option value="">Select gender</option>
                                    { genders.map((g, index) => (
                                    <option key={index} value={g.id}>{ language === 'ta' ? g.gender_lname : g.gender_name }</option>
                                    ))}
                                </select>
                                <div className="invalid-feedback">{ errors.gender }</div>
                            </Form.Group>
                        </div>
                        <div className="col-md-2">
                            <Form.Group className="mb-3">
                                <Form.Label>Age<RequiredField/></Form.Label>
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
                                <label htmlFor="relation">Relation<RequiredField/></label><br />
                                <select 
                                name="relation" 
                                id="relation" 
                                className={`form-control ${errors.relation ? 'is-invalid' : ''}`}
                                value={form.relation}
                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                >
                                <option value="">Select relation</option>
                                { relations.map((item, index) => (
                                    <option key={index} value={item.id}>{ language === 'ta' ? item.relation_lname : item.relation_name }</option>
                                )) }
                                </select>
                                <div className="invalid-feedback">{ errors.relation }</div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <Form.Group className="mb-3">
                                <Form.Label>Relation Name<RequiredField/></Form.Label>
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
                                <label htmlFor="state">State<RequiredField/></label><br />
                                <select 
                                    name="state" 
                                    id="state" 
                                    className="form-control"
                                    value={form.state}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                >
                                    <option value="">Select state</option>
                                    { states.map((s, index) => (
                                    <option value={s.state_code} key={index}>{ language === 'ta' ? s.state_lname : s.state_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="district">District<RequiredField/></label><br />
                                <select 
                                    name="district" 
                                    id="district" 
                                    className="form-control"
                                    value={form.district}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                >
                                    <option value="">Select District</option>
                                    { districts.filter((d) => parseInt(d.state) === parseInt(form.state)).map((d, index) => (
                                    <option value={d.district_code} key={index}>{ language === 'ta' ? d.district_lname : d.district_name }</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="taluk">Taluk<RequiredField/></label><br />
                                <select 
                                    name="taluk" 
                                    id="taluk" 
                                    className="form-control"
                                    value={form.taluk}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                >
                                    <option value="">Select Taluk</option>
                                    { taluks.filter((t) => parseInt(t.district) === parseInt(form.district)).map((t, index) => (
                                    <option value={t.taluk_code} key={index}>{ language === 'ta' ? t.taluk_lname : t.taluk_name }</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Address<RequiredField /></Form.Label>
                                <Form.Control
                                    name="address"
                                    value={form.address}
                                    className={`${errors.address ? 'is-invalid' : ''}`}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                ></Form.Control>
                                <div className="invalid-feedback">{ errors.address }</div>
                            </Form.Group>
                        </div>
                        <div className="col-md-3">
                            <Form.Group>
                                <Form.Label>Post Office </Form.Label>
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
                                <Form.Label>Pincode <RequiredField /></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="pincode"
                                    value={form.pincode}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                ></Form.Control>
                            </Form.Group>
                        </div>
                        <div className="col-md-3">
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
                        <div className="col-md-3">
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
                        <div className="col-md-12 mt-3">
                            <div className="form-group">
                                <input type="checkbox" className='mr-2'/>Is Active
                            </div>
                        </div>
                        <div className="col-md-12 mt-2">
                            <Button
                                variant="contained"
                                color="success"
                            >Save</Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Profile