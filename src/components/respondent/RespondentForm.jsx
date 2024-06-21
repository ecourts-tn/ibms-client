import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { nanoid } from '@reduxjs/toolkit'
import api from '../../api'
import * as Yup from 'yup'


const RespondentForm = ({respondents, addRespondent}) => {


    const initialState = {
        id: nanoid(),
        respondent_name: 'State of Tamil Nadu',
        designation:'',
        address:'',
        district:''
    }

    const validationSchema = Yup.object({
        respondent_name: Yup.string().required(),
        designation: Yup.string().required(),
        address: Yup.string().required(),
        district: Yup.string().required()
    })

    const[respondent, setRespondent] = useState(initialState)
    const[errors, setErrors] = useState({})

    const handleSubmit = async () => {
        try{
            await validationSchema.validate(respondent, {abortEarly:false})
            const cino = localStorage.getItem("cino")
            const response = await api.post(`api/bail/filing/${cino}/respondent/create/`, respondent)
            addRespondent(respondent)
            setRespondent(initialState)
        }catch(error){
            const newErrors = {}
            error.inner.forEach((err) => {
                newErrors[err.path] = err.message
            });
            setErrors(newErrors)
        }
    }

    return (
        <>
            <div className="row">
                <div className="col-md-3">
                    <Form.Group>
                        <Form.Label>Repondent Name</Form.Label>
                        <Form.Control
                            name="respondent_name"
                            value={respondent.respondent_name}
                            className={`${errors.respondent_name ? 'is-invalid' : ''}`}
                            onChange={(e) => setRespondent({...respondent, [e.target.name]: e.target.value})}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.respondent_name }</div>
                    </Form.Group>
                </div>
                <div className="col-md-3">
                    <Form.Group>
                        <Form.Label>Designation</Form.Label>
                        <select 
                            name="designation" 
                            className={`form-control ${errors.designation ? 'is-invalid' : ''}` }
                            value={respondent.designation}
                            onChange={(e) => setRespondent({...respondent, [e.target.name]: e.target.value})}
                        >
                            <option value="">Select designation</option>
                            <option value="Superintendent of Police">Superintendent of Police</option>
                            <option value="Deputy Superintendent of Police">Deputy Superintendent of Police</option>
                            <option value="Inspector of Police">Inspector of Police</option>
                            <option value="Sub-Inspector of Police">Sub-Inspector of Police</option>
                        </select>
                        <div className="invalid-feedback">{ errors.designation }</div>
                    </Form.Group>
                </div>
                <div className="col-md-4">
                    <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            name="address"
                            value={respondent.address}
                            className={`${errors.address ? 'is-invalid' : ''}`}
                            onChange={(e) => setRespondent({...respondent, [e.target.name]: e.target.value})}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.address }</div>
                    </Form.Group>
                </div>
                <div className="col-md-2">
                    <Form.Group>
                        <Form.Label>District</Form.Label>
                        <Form.Control
                            name="district"
                            value={respondent.district}
                            className={`${errors.district ? 'is-invalid' : ''}`}
                            onChange={(e) => setRespondent({...respondent, [e.target.name]: e.target.value})}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.district }</div>
                    </Form.Group>
                </div>
                <div className="col-md-3 mt-4 pt-2">
                    <Button 
                        variant="secondary"
                        onClick={handleSubmit}>
                        <i className="fa fa-plus mr-2"></i>Add Respondent</Button>
                </div>
            </div>
        </>
    )
}

export default RespondentForm