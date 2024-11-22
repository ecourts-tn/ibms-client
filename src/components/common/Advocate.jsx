import React, {useState, useEffect} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import api from '../../api'
import Form from 'react-bootstrap/Form'

const Advocate = () => {
    
    const initialState = {

    }
    const[advocates, setAdvocates]  = useState([])
    const[advocate, setAdvocate]    = useState(initialState)

    useEffect(() => {
        fetchAdvocates();
    }, [])

    const fetchAdvocates = async() => {
        try{
            const efile_no = localStorage.getItem("efile_no")
            const response = await api.get(`api/advocate/${efile_no}/list/`)
            if(response.status === 200){
                setAdvocates(response.data)
            }
        }catch(error){
            console.log(error)
        }
    }

    const addAdvocate = async (advocate) => {
        try{
            const efile_no = localStorage.getItem("efile_no")
            const response = await api.post(`api/advocate/${efile_no}/create/`, advocate)
            if(response.status === 201){
                setAdvocates(advocates => [...advocates, advocate])
                toast.success("Advocate details added successfully", {
                    theme: "colored"
                })
                fetchAdvocates();
            }
        }catch(error){
            console.error(error)
        }
    }

    const readAdvocate = async(id) => {
        try{
            const response = await api.get(`api/advocate/${id}/detail/`)
            if(response.status === 200){
                setAdvocate(response.data)
            }
        }catch(error){
            console.error(error)
        }
    }

    const updateAdvocate = async(id) => {
        try{
            const response = await api.put(`api/advocate/${id}/update/`, advocate)
            if(response.status === 200){
                toast.success("Advocate details added successfully", {
                    theme: "colored"
                })
                fetchAdvocates()
            }
        }catch(error){
            console.error(error)
        }
    }
    
    const deleteAdvocate = async(advocate) => {
        const newAdvocate = advocates.filter((a) => {
            return a.id !== advocate.id
        })    
        const response = await api.delete(`api/advocate/${advocate.id}/delete/`) 
        if(response.status === 204){
            toast.success("Advocate details deleted successfully", {
                theme:"colored"
            })
            setAdvocates(newAdvocate)
        }
    }

    return (
        <div className="container">
            <ToastContainer />
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <div className="my-5">
                        <AdvocateList 
                            advocates={advocates}
                            editAdvocate={readAdvocate}
                            deleteAdvocate={deleteAdvocate}
                        />
                    </div>
                </div>
            </div>
            <AdvocateForm addAdvocate={addAdvocate} advocate={advocate} />
        </div>
    )
}

export default Advocate


const AdvocateForm = ({advocate, addAdvocate}) => {
    return(
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
                    onClick={addAdvocate}
                ><i className="fa fa-plus mr-2"></i>Add Advocate</Button>
            </div>
        </div>
    )
}

const AdvocateList = ({advocates, editAdvocate, deleteAdvocate}) => {
    return(
        <div className="table-responsive">
            <table className="table table-striped table-bordered table-sm">
                <thead className="bg-secondary">
                    <tr>
                        <th>S. No.</th>
                        <th>Advocate Name</th>
                        <th>Enrolment Number</th>
                        <th>Mobile Number</th>
                        <th>Email Address</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    { advocates.map((advocate, index) => (
                    <tr key={index}>
                        <td>{ index+1 }</td>
                        <td>{ advocate.advocate_name }</td>
                        <td>{ advocate.enrolment_number }</td>
                        <td>{ advocate.advocate_mobile }</td>
                        <td>{ advocate.advocate_email }</td>
                        <td>
                        { !advocate.is_primary && (
                            <>
                            <Button
                                variant='contained'
                                color='primary'
                                size='small'
                                onClick={() => editAdvocate(advocate.id)}
                            >Edit</Button>
                            <Button
                                variant='contained'
                                color='error'
                                size='small'
                                className='ml-1'
                                onClick={()=> deleteAdvocate(advocate)}
                            >Delete</Button>
                            </>
                        )}
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
