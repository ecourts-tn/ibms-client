import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { toast, ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getStates, getStatesStatus } from '../../redux/features/StateSlice'
import { getDistrictByStateCode } from '../../redux/features/DistrictSlice'
import { getTalukByDistrictCode } from '../../redux/features/TalukSlice'
import { getPrisons } from '../../redux/features/PrisonSlice'
import { getRelations } from '../../redux/features/RelationSlice';
import * as Yup from 'yup'
import api from '../../api';

const Litigant = () => {
    const initialState = {
        petitioner: 'o',
        litigant_name: '',
        litigant_type: 1, 
        relation: '',
        relation_name: '',
        age:'',
        gender:'',
        address:'',
        rank: '',
        state:'',
        district:'',
        taluk:'',
        post_office:'',
        pincode:'',
        nationality: '',
        mobile_number:'',
        aadhar_number:'',
        email_address:'',
        act: '',
        section: '',
        is_custody: false,
        prison: '',
        custody_days: '',
        is_surrendered: false,
        identification_marks:'',
    }
    const[litigants, setLitigants] = useState([])
    const[litigant, setLitigant]    = useState(initialState)

    useEffect(() => {
        fetchLitigants()
    }, [])

    const fetchLitigants = async() => {
        try{
            const efile_no = localStorage.getItem("efile_no")
            const response = api.get(`api/litigant/list`, {params:{efile_no}})
            if(response.status === 200){
                setLitigants(response.data)
            }
        }catch(error){
            console.log(error)
        }
    }

    const addLitigant = async(litigant) => {
        try{
            const efile_no = localStorage.getItem("efile_no")
            const response = api.post(`api/litigant/${efile_no}/create`, litigant)
            if(response.status === 201){
                toast.success("Litigant details added successfully", {theme:"colored"})
                fetchLitigants();
            }
        }catch(error){
            console.log(error)
        }
    }

    const readLitigant =  async(id) => {
        try{
            const response = await api.get(`api/litigant/${id}/detail/`)
            if(response.status === 200){
                setLitigant(response.data)
            }
        }catch(error){
            console.error(error)
        }
    }

    const updateLitigant = async(id) => {
        try{
            const efile_no = localStorage.getItem("efile_no")
            const response = await api.put(`api/litigant/${id}/update/`, litigant)
            if(response.status === 200){
                toast.success("Litigant details updated successfully", {theme:"colored"})
            }
        }catch(error){
            console.error(error)
        }
    }

    const deleteLitigant = async(id) => {
        try{
            const newLitigants = litigants.filter((litigant) => {
                return litigant.id !== id
            })
            const response = api.delete(`api/litigant/${id}/delete/`)
            if(response.status === 204){
                toast.error("Litigant details deleted successfully", {theme:"colored"})
                setLitigants(newLitigants)
            }
        }catch(error){
            console.error(error)
        }
    }

    return (
        <>
            <PetitionerList />
            <PetitionerForm litigant={litigant} addLitigant={addLitigant}/>
        </>
    )
}

export default Litigant


const PetitionerForm = ({litigant, addLitigant}) => {
    const dispatch      = useDispatch()
    const states        = useSelector((state) => state.states.states)
    const districts     = useSelector((state) => state.districts.districts)
    const taluks        = useSelector((state) => state.taluks.taluks)
    const relations     = useSelector((state) => state.relations.relations)
    const prisons       = useSelector((state) => state.prisons.prisons)
    const accused       = useSelector((state) => state.accused.accused)
    const stateStatus   = useSelector(getStatesStatus)

    const[errors, setErrors] = useState({})

    const validationSchema = Yup.object({
        petitioner_name: Yup.string().required(),
        relation: Yup.string().required(),
        relation_name: Yup.string().required(),
        age: Yup.number().required(),
        rank: Yup.string().required(),
        gender: Yup.string().required(),
        address: Yup.string().required(),
        mobile_number: Yup.number().required("The mobile number is required"),
        aadhar_number: Yup.number().required("Aadhaar number is required"),
        // email_address: Yup.string().required().email(),
        act: Yup.string().required(),
        section: Yup.string().required(),
        address: Yup.string().required(),
        is_custody: Yup.boolean().required(),
        // prison: Yup.string().when('is_custody', (is_custody, schema) => {
        //   if(is_custody){
        //       return schema.required("Please select the prison")
        //   }
        // }),
        // custody_days: Yup.number().when('is_custody', (is_custody, schema) => {
        //   if(is_custody){
        //     return schema.required("This field is required")
        //   }
        // })
    })

    useEffect(() => {
        if(stateStatus === 'idle'){
        dispatch(getStates())
        }
    },[stateStatus, dispatch])
    
    useEffect(() => {
        if(petitioner.state !== ''){
        dispatch(getDistrictByStateCode(petitioner.state))
        }
    },[petitioner.state, dispatch])

    useEffect(() => {
        if(petitioner.district !== ''){
        dispatch(getTalukByDistrictCode(petitioner.district))
        }
    },[petitioner.district, dispatch])

    useEffect(() => {
        if(petitioner.is_custody){
        dispatch(getPrisons())
        }
    },[petitioner.is_custody, dispatch])

    useEffect(() => {
        dispatch(getRelations())
    }, [dispatch])


    useEffect(() => {
        const result = accused.find((a) => {
        return a.name_of_accused === petitioner.petitioner
        })
        if(petitioner.petitioner === 'o'){
        setPetitioner(initialPetitioner)
        }
        else if(result){
        setPetitioner({
            ...petitioner,
            petitioner_name :result.name_of_accused,
            rank: result.Rank_of_accused,
            gender: result.gender,
            act: result.act,
            section: result.section.toString(),
            relation: result.accused_guardian,
            relation_name: result.accused_guardian_name,
            age: result.age,
            address: result.permanent_address,
            mobile_number: result.mobile_number,
            email_address: result.email_id,
        })
        }
    },[petitioner.petitioner, accused])

    const handleSubmit = async() => {
        try{
        // await validationSchema.validate(petitioner, { abortEarly:false})
        const efile_no = localStorage.getItem("efile_no")
        const response = await api.post(`api/litigant/create/`, petitioner, {
            params: {
            efile_no
            }
        })
        if(response.status === 200){
            toast.success("Petitioner details added successfully", {
            theme:"colored"
            })
        }
        }catch(error){
            if(error.inner){
                const newErrors = {};
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message;
                });
                setErrors(newErrors);
            }
            if(error){
                toast.error("error.response", {theme:"colored"})
            }
        }
    }

    return (
            <>
            <ToastContainer />
                <div className="row">
                    <div className="col-md-3 mb-3">
                        <div className="form-group">
                            <label htmlFor="petitioner">Select Petitioner</label><br />
                            <select name="petitioner" value={petitioner.petitioner} className="form-control" onChange={(e) => setPetitioner({...petitioner, [e.target.name]: e.target.value})} >
                            <option value="o">Select Petitioner</option>
                            { accused.map((item, index) => (
                            <option key={index} value={item.name_of_accused}>{item.name_of_accused}</option>
                            ))}
                            </select>
                        </div>
                    </div>
                    <div className="col-md-9 mt-4 pt-3">
                    <p className="text-danger"><strong>*****  Fill the following details if the petitioner name is not listed  *****</strong></p>
                    </div>
                </div>
                <div className="row">  
                    <div className="col-md-3">
                    <Form.Group className="mb-3">
                        <Form.Label>Name of the Petitioner</Form.Label>
                        <Form.Control
                        type="text"
                        name="litigant_name" 
                        className={`${errors.litigant_name ? 'is-invalid' : ''}`}
                        value={petitioner.litigant_name} 
                        readOnly={petitioner.petitioner !== 'o' ? 'readOnly' : false }
                        onChange={(e) => setPetitioner({...petitioner, [e.target.name]: e.target.value})}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.litigant_name }</div>
                    </Form.Group>
                    </div>
                    <div className="col-md-1">
                    <Form.Group className="mb-3">
                        <Form.Label>Gender</Form.Label>
                        { petitioner.petitioner !== 'o' && (
                        <Form.Control 
                            readOnly={petitioner.petitioner !== 'o' ? 'readOnly' : null }
                            value={petitioner.gender}
                        ></Form.Control>
                        )}
                        { petitioner.petitioner === 'o' && (
                        <select 
                            name="gender" 
                            value={petitioner.gender} 
                            className="form-control"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        )}
                    </Form.Group>
                    </div>
                    <div className="col-md-1">
                    <Form.Group className="mb-3">
                        <Form.Label>Age</Form.Label>
                        <Form.Control
                        type="text"
                        name="age"
                        readOnly={petitioner.petitioner !== 'o' ? 'readOnly' : null }
                        value={petitioner.age}
                        className={`${errors.age ? 'is-invalid' : ''}`}
                        onChange={(e) => setPetitioner({...petitioner, [e.target.name]: e.target.value})}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.age }</div>
                    </Form.Group>
                    </div>
                    <div className="col-md-2">
                    <Form.Group className="mb-3">
                        <Form.Label>Accused Rank</Form.Label>
                        <Form.Control
                        type="text"
                        name="rank"
                        readOnly={petitioner.petitioner !== 'o' ? 'readOnly' : null }
                        value={petitioner.rank}
                        className={`${errors.rank ? 'is-invalid': ''}`}
                        onChange={(e) => setPetitioner({...petitioner, [e.target.name]: e.target.value})}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.rank }</div>
                    </Form.Group>
                    </div>
                    <div className="col-md-2">
                        <div className="form-group mb-3">
                        <label htmlFor="relation">Relation</label><br />
                        { petitioner.petitioner !== 'o' && (
                            <Form.Control 
                            value={petitioner.relation}
                            readOnly={petitioner.petitioner !== 'o' ? 'readOnly' : null }
                            ></Form.Control>
                        )}
                        { petitioner.petitioner === 'o' && (
                        <>
                            <select 
                            name="relation" 
                            id="relation" 
                            className={`form-control ${errors.relation ? 'is-invalid' : ''}`}
                            value={petitioner.relation}
                            onChange={(e) => setPetitioner({...petitioner, [e.target.name]: e.target.value})}
                            >
                            <option value="">Select relation</option>
                            { relations.map((item, index) => (
                                <option key={index} value={item.relation_name}>{ item.relation_name }</option>
                            )) }
                            </select>
                            <div className="invalid-feedback">{ errors.relation }</div>
                        </>  
                        )}
                        </div>
                    </div>
                    <div className="col-md-3">
                    <Form.Group className="mb-3">
                        <Form.Label>Relation Name</Form.Label>
                        <Form.Control
                        type="text"
                        name="relation_name"
                        readOnly={petitioner.petitioner !== 'o' ? 'readOnly' : null }
                        value={petitioner.relation_name}
                        className={`${errors.relation_name ? 'is-invalid' : ''}`}
                        onChange={(e) => setPetitioner({...petitioner, [e.target.name]: e.target.value})}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.relation_name }</div>
                    </Form.Group>
                    </div>
                    <div className="col-md-3">
                    <Form.Group className="mb-3">
                        <Form.Label>Act</Form.Label>
                        <Form.Control
                        type="text"
                        name="act"
                        readOnly={petitioner.petitioner !== 'o' ? 'readOnly' : null }
                        value={petitioner.act}
                        className={`${errors.act ? 'is-invalid': ''}`}
                        onChange={(e) => setPetitioner({...petitioner, [e.target.name]: e.target.value})}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.act }</div>
                    </Form.Group>
                    </div>
                    <div className="col-md-3">
                    <Form.Group className="mb-3">
                        <Form.Label>Section</Form.Label>
                        <Form.Control
                        type="text"
                        name="section"
                        readOnly={petitioner.petitioner !== 'o' ? 'readOnly' : null }
                        value={petitioner.section.toString()}
                        className={`${errors.section ? 'is-invalid' : ''}`}
                        onChange={(e) => setPetitioner({...petitioner, [e.target.name]: e.target.value })}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.section }</div>
                    </Form.Group>
                    </div>
                    <div className="col-md-6">
                    <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                        type="text"
                        name="address"
                        readOnly={petitioner.petitioner !== 'o' ? 'readOnly' : null }
                        value={petitioner.address}
                        className={`${errors.address ? 'is-invalid' : ''}`}
                        onChange={(e) => setPetitioner({...petitioner, [e.target.name]: e.target.value})}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.address }</div>
                    </Form.Group>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                        <label htmlFor="state">State</label><br />
                        <select 
                            name="state" 
                            id="state" 
                            className="form-control"
                            value={petitioner.state}
                            onChange={(e) => setPetitioner({...petitioner, [e.target.name]: e.target.value})}
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
                            value={petitioner.district}
                            onChange={(e) => setPetitioner({...petitioner, [e.target.name]: e.target.value})}
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
                            value={petitioner.taluk}
                            onChange={(e) => setPetitioner({...petitioner, [e.target.name]: e.target.value})}
                        >
                            <option value="">Select Taluk</option>
                            { taluks.map((item, index) => (
                            <option value={item.taluk_code} key={index}>{ item.taluk_name }</option>
                            ))}
                        </select>
                        </div>
                    </div>
                    <div className="col-md-3">
                    <Form.Group>
                        <Form.Label>Post Office</Form.Label>
                        <Form.Control
                        type="text"
                        name="post_office"
                        value={petitioner.post_office}
                        onChange={(e) => setPetitioner({...petitioner, [e.target.name]: e.target.value})}
                        ></Form.Control>
                    </Form.Group>
                    </div>
                    <div className="col-md-2">
                    <Form.Group className="mb-3">
                        <Form.Label>Pincode</Form.Label>
                        <Form.Control
                        type="text"
                        name="pincode"
                        value={petitioner.pincode}
                        onChange={(e) => setPetitioner({...petitioner, [e.target.name]: e.target.value})}
                        ></Form.Control>
                    </Form.Group>
                    </div>
                    <div className="col-md-3">
                    <Form.Group>
                        <Form.Label>Nationality</Form.Label>
                        <select 
                        name="nationality" 
                        className="form-control"
                        value={petitioner.nationality}
                        onChange={(e) => setPetitioner({...petitioner, [e.target.name]: e.target.value})}
                        >
                        <option value="1">Indian</option>
                        <option value="2">Others</option>
                        </select>
                    </Form.Group>
                    </div>
                    <div className="col-md-3">
                    <Form.Group>
                        <Form.Label>Aadhaar Number</Form.Label>
                        <Form.Control
                        type="text"
                        name="aadhar_number"
                        value={petitioner.aadhar_number}
                        className={`${errors.aadhar_number ? 'is-invalid' : ''}`}
                        onChange={(e) => setPetitioner({...petitioner, [e.target.name]: e.target.value})}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.aadhar_number }</div>
                    </Form.Group>
                    </div>
                    <div className="col-md-3">
                    <Form.Group>
                        <Form.Label>Mobile Number</Form.Label>
                        <Form.Control
                        type="text"
                        name="mobile_number"
                        className={`${errors.mobile_number ? 'is-invalid' : ''}`}
                        value={petitioner.mobile_number}
                        onChange={(e) => setPetitioner({...petitioner, [e.target.name]: e.target.value})}
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
                        value={petitioner.email_address}
                        className={`${errors.email_address ? 'is-invalid' : ''}`}
                        onChange={(e) => setPetitioner({...petitioner, [e.target.name]: e.target.value})}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.email_address }</div>
                    </Form.Group>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                        <label>Whether Accused in Custody?</label><br />
                        <div>
                            <div className="icheck-success d-inline mx-2">
                            <input 
                                type="radio" 
                                name="is_custody" 
                                id="custodyYes" 
                                value={petitioner.is_custody}
                                checked={ petitioner.is_custody }
                                onChange={(e) => setPetitioner({...petitioner, is_custody: true})} 
                            />
                            <label htmlFor="custodyYes">Yes</label>
                            </div>
                            <div className="icheck-danger d-inline mx-2">
                            <input 
                                type="radio" 
                                id="custodyNo" 
                                name="is_custody" 
                                value={petitioner.is_custody}
                                checked={ !petitioner.is_custody } 
                                onChange={(e) => setPetitioner({...petitioner, is_custody: false})}
                            />
                            <label htmlFor="custodyNo">No</label>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                        <label htmlFor="prison">Name of Prison / Jail / Sub Jail</label><br />
                        <select 
                            name="prison" 
                            id="prison" 
                            className={`form-control ${errors.prison ? 'is-invalid' : ''}`}
                            disabled={ !petitioner.is_custody } 
                            value={petitioner.prison}
                            onChange={(e) => setPetitioner({...petitioner, [e.target.name]: e.target.value })}
                        >
                            <option value="">Select Prision</option>
                            { prisons.map((item, index) => (
                            <option value={item.prison_code} key={index}>{item.prison_name}</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">{ errors.prison}</div>
                        </div>
                    </div>  
                    <div className="col-md-2">
                        <Form.Group>
                        <Form.Label>No. of days in custody</Form.Label>
                        <Form.Control
                            type="text"
                            name="custody_days"
                            disabled={ !petitioner.is_custody }
                            value={petitioner.custody_days}
                            onChange={(e) => setPetitioner({...petitioner, [e.target.name]: e.target.value })}
                        ></Form.Control>
                        </Form.Group>
                    </div>
                    <div className="col-md-2">
                        <div className="form-group">
                        <label>If accused Surrendered</label><br />
                        <div>
                            <div className="icheck-success d-inline mx-2">
                            <input 
                                type="radio" 
                                id="surrenderedYes" 
                                name="is_surrendered" 
                                value={petitioner.is_surrendered}
                                checked={ petitioner.is_surrendered }
                                onChange={(e) => setPetitioner({...petitioner, is_surrendered: true })}
                            />
                            <label htmlFor="surrenderedYes">Yes</label>
                            </div>
                            <div className="icheck-danger d-inline mx-2">
                            <input 
                                type="radio" 
                                id="surrenderedNo" 
                                name="is_surrendered" 
                                value={petitioner.is_surrendered}
                                checked={ !petitioner.is_surrendered }
                                onChange={(e) => setPetitioner({...petitioner, is_surrendered: false })}
                            />
                            <label htmlFor="surrenderedNo">No</label>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <Form.Group>
                        <Form.Label>Identification marks of Accused</Form.Label>
                        <Form.Control
                            type="text"
                            name="identification_marks"
                            value={petitioner.identification_marks}
                            disabled={ !petitioner.is_surrendered }
                            onChange={(e) => setPetitioner({...petitioner, [e.target.name]: e.target.value})}
                        ></Form.Control>
                        </Form.Group>
                    </div>
                    <div className="col-md-3 mt-4 pt-2">
                        <Button 
                        variant="secondary"
                        onClick={handleSubmit}
                        ><i className="fa fa-plus mr-2"></i>Add Petitioner</Button>
                    </div>
                </div>
            </>
        )
    }