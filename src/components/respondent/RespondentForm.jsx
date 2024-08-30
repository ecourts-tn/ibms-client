import React, { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { nanoid } from '@reduxjs/toolkit'
import { getStates, getStatesStatus } from '../../redux/features/StateSlice'
import { getDistrictByStateCode } from '../../redux/features/DistrictSlice'
import { getPoliceSationByDistrict } from '../../redux/features/PoliceStationSlice'
import { useSelector, useDispatch } from 'react-redux'
import api from '../../api'
import * as Yup from 'yup'
import { toast, ToastContainer } from 'react-toastify'


const RespondentForm = ({addRespondent}) => {
    const dispatch = useDispatch()
    const states = useSelector((state) => state.states.states)
    const districts = useSelector((state) => state.districts.districts)
    const stateStatus = useSelector(getStatesStatus)
    const policeStations = useSelector((state) => state.police_stations.police_stations)

    const initialState = {
        litigant_name: 'State of Tamil Nadu rep by',
        litigant_type: 2, 
        designation:'',
        state:'',
        district:'',
        police_station: '',
        address:'',
    }
    const[litigant, setLitigant] = useState(initialState)
    useEffect(() => {
        if(stateStatus === 'idle'){
            dispatch(getStates())
        }
    },[stateStatus, dispatch])
      
    useEffect(() => {
        if(litigant.state !== ''){
          dispatch(getDistrictByStateCode(litigant.state))
        }
    },[litigant.state, dispatch])

    useEffect(() => {
        if(litigant.district){
            dispatch(getPoliceSationByDistrict(litigant.district))
        }
    }, [litigant.district, dispatch])
    

    const validationSchema = Yup.object({
        litigant_name: Yup.string().required(),
        designation: Yup.string().required(),
        address: Yup.string().required(),
        district: Yup.string().required()
    })
    const[errors, setErrors] = useState({})

    const handleSubmit = async () => {
        try{
            await validationSchema.validate(litigant, {abortEarly:false})
            addRespondent(litigant)
        }catch(error){
            console.error(error)
            if(error.inner){
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                });
                setErrors(newErrors)
                }
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="row">
                <div className="col-md-3">
                    <div className="form-group">
                    <label htmlFor="state">State</label><br />
                    <select 
                        name="state" 
                        id="state" 
                        className="form-control"
                        value={litigant.state}
                        onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
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
                        value={litigant.district}
                        onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                    >
                        <option value="">Select District</option>
                        { districts.map((item, index) => (
                        <option value={item.district_code} key={index}>{item.district_name}</option>
                        ))}
                    </select>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="police_station">Police Station Name</label><br />
                        <select 
                            name="police_station" 
                            id="police_station" 
                            className={`form-control ${errors.police_station ? 'is-invalid' : ''}`}
                            value={litigant.police_station}
                            onChange={(e)=> setLitigant({...litigant, [e.target.name]: e.target.value })}
                        >
                            <option value="">Select station</option>
                            { policeStations.map((item, index) => (
                                <option key={index} value={item.cctns_code}>{ item.station_name}</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">
                            { errors.police_station }
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <Form.Group>
                        <Form.Label>Repondent Name</Form.Label>
                        <Form.Control
                            name="litigant_name"
                            value={litigant.litigant_name}
                            className={`${errors.litigant_name ? 'is-invalid' : ''}`}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.litigant_name }</div>
                    </Form.Group>
                </div>
                <div className="col-md-3">
                    <Form.Group>
                        <Form.Label>Designation</Form.Label>
                        <select 
                            name="designation" 
                            className={`form-control ${errors.designation ? 'is-invalid' : ''}` }
                            value={litigant.designation}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
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
                <div className="col-md-6">
                    <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            name="address"
                            value={litigant.address}
                            className={`${errors.address ? 'is-invalid' : ''}`}
                            onChange={(e) => setLitigant({...litigant, [e.target.name]: e.target.value})}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.address }</div>
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