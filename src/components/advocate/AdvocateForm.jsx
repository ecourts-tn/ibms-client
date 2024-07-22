import React from 'react'
import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from '@mui/material/Button'
import { ToastContainer, toast } from 'react-toastify'

const AdvocateForm = ({addAdvocate}) => {
    const initialAdvocate = {
        advocate_name: '',
        advocate_email: '',
        advocate_mobile: '',
        enrolment_number: '',
        is_primary: false
    }

    const[advocate, setAdvocate] = useState(initialAdvocate)

    const handleChange = (e) => {
        const {name, value} = e.target
        setAdvocate({...advocate, [name]: value})
    }

    const handleSubmit = () => {
        addAdvocate(advocate)
        setAdvocate(initialAdvocate)
    }


    return (
        <>
            <ToastContainer />
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <Form.Group className="row mb-3">
                        <Form.Label  className="col-sm-3">Advocate Name</Form.Label>
                        <div className="col-sm-9">
                            <Form.Control
                                name="advocate_name"
                                value={advocate.advocate_name}
                                onChange={ handleChange }
                            ></Form.Control>
                        </div>
                    </Form.Group>
                    <Form.Group className="row mb-3">
                        <Form.Label className="col-sm-3">Enrollment Number</Form.Label>
                        <div className="col-sm-9">
                            <Form.Control
                                name="enrolment_number"
                                value={advocate.enrolment_number}
                                onChange={ handleChange }
                                placeholder='MS/----/----'
                            ></Form.Control>
                        </div>
                    </Form.Group>
                    <Form.Group  className="row mb-3">
                        <Form.Label className="col-sm-3">Mobile Number</Form.Label>
                        <div className="col-sm-9">
                            <Form.Control
                                name="advocate_mobile"
                                value={advocate.advocate_mobile}
                                onChange={ handleChange }
                            ></Form.Control>
                        </div>
                    </Form.Group>
                    <Form.Group className="row mb-3">
                        <Form.Label className="col-sm-3">E-Mail Address</Form.Label>
                        <div className="col-sm-9">
                            <Form.Control
                                name="advocate_email"
                                value={advocate.advocate_email}
                                onChange={ handleChange }
                            ></Form.Control>
                         </div>
                    </Form.Group>
                </div>
                <div className="col-md-12 mb-3 d-flex justify-content-center">
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleSubmit}
                    ><i className="fa fa-plus mr-2"></i>Add Advocate</Button>
                </div>
            </div>
        </>
    )
}

export default AdvocateForm