import React, { useEffect } from 'react'
import { useState } from 'react'
import api from '../../api'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useSelector, useDispatch } from 'react-redux'
import { getStates, getStatesStatus } from '../../redux/features/StateSlice'
import { getDistrictByStateCode } from '../../redux/features/DistrictSlice'
import { getPoliceSationByDistrict } from '../../redux/features/PoliceStationSlice'
import { getBasicDetails, getFirStatus } from '../../redux/features/FIRSeachSlice'
import { getAccusedDetails } from '../../redux/features/AccusedSlice'
import FIRDetails from '../FIRDetails'
import Loader from '../Loader'
import * as Yup from 'yup'


const FIRSearch = () => {

    const stateStatus = useSelector(getStatesStatus)
    const states = useSelector((state) => state.states.states)
    const districts = useSelector((state) => state.districts.districts)
    const policeStations = useSelector((state) => state.police_stations.police_stations)

    const [showAdditionalFields, setShowAdditionalFields] = useState(false)
    const [loading, setLoading] = useState(false)
    const[errors, setErrors] = useState({})

    const[petition, setPetition] = useState({
        crime_state: '',
        crime_district: '',
        police_station: '',
        crime_number: '',
        crime_year: '',
        date_of_occurrence  : null,
        investigation_officer:'',
        fir_date_time: null,
        place_of_occurrence: '',
        gist_of_fir: '',
        gist_in_local: '',
        complainant_age: null,
        complainant_guardian:null,
        complainant_guardian_name: '',
        complainant_name:'',
        investigation_officer_rank:'',
        no_of_accused: null
    })

    const validationSchema = Yup.object({
        crime_state: Yup.string().required(),
        crime_district: Yup.string().required(),
        police_station: Yup.string().required(),
        crime_number: Yup.string().required(),
        crime_year: Yup.string().required()
    })

    const dispatch = useDispatch()

    useEffect(() => {
        if(stateStatus === 'idle'){
            dispatch(getStates())
        }
    }, [stateStatus, dispatch])

    useEffect(() => {
        if(petition.crime_state){
            dispatch(getDistrictByStateCode(petition.crime_state))
        }
    }, [petition.crime_state, dispatch])

    useEffect(() => {
        if(petition.crime_district){
            dispatch(getPoliceSationByDistrict(petition.crime_district))
        }
    }, [petition.crime_district, dispatch])

    
    const handleSearch = async (e) => {
        e.preventDefault()
        try{
            await validationSchema.validate(petition, { abortEarly:false})
            setLoading(true)
            setShowAdditionalFields(false)
            const {data} = await api.get("api/external/police/tamilnadu/fir-details/")
            if(data){
                setPetition({
                    ...petition,
                    date_of_occurrence: data.date_of_Occurrence,
                    investigation_officer :data.investigation_officer_name,
                    fir_date_time: data.FIR_DATE_Time,
                    place_of_occurrence: data.place_of_occurence,
                    gist_of_fir: data.gist_of_FIR,
                    gist_in_local: data.gist_of_FIR_local_language,
                    complainant_age: data.complainant_age,
                    complainant_guardian_name: data.complainant_guardian_name,
                    complainant_name: data.complaintant_name,
                    investigation_officer_rank: data.investigation_officer_rank,
                    no_of_accused: data.no_of_accused,
                    complainant_guardian: data.complainant_guardian
                })
                if(petition.no_of_accused){
                    const cino = localStorage.getItem("cino")
                    const update = await api.put(`api/bail/filing/${cino}/update/`, petition)
                    setLoading(false)
                    setShowAdditionalFields(true)
                    dispatch(getAccusedDetails())
                }
            }
        }catch(error){
            if(error.inner){
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
            }
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-3">
                    <label htmlFor="crime_state">State</label>
                    <select 
                        name="crime_state" 
                        id="crime_state" 
                        className={ `form-control ${errors.crime_state ? 'is-invalid': ''}`}
                        value={petition.crime_state}
                        onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value })}    
                    >
                       <option value="">Select state</option>
                       { states.map((item, index) => (
                         <option key={index} value={item.state_code }>{ item.state_name }</option>
                       ))}
                    </select>
                    <div className="invalid-feedback">
                        { errors.crime_state }
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="crime_district">District</label><br />
                        <select 
                            name="crime_district" 
                            id="crime_district" 
                            className={`form-control ${errors.crime_district ? 'is-invalid' : ''}`}
                            value={petition.crime_district} 
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value })}
                        >
                            <option value="">Select district</option>
                            { districts.map((item, index) => (
                            <option key={index} value={item.district_code }>{ item.district_name }</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">
                            { errors.crime_district }
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                <div className="form-group">
                    <label htmlFor="police_station">Police Station Name</label><br />
                    <select 
                        name="police_station" 
                        id="police_station" 
                        className={`form-control ${errors.police_station ? 'is-invalid' : ''}`}
                        value={petition.police_station}
                        onChange={(e)=> setPetition({...petition, [e.target.name]: e.target.value })}
                    >
                        <option value="">Select station</option>
                        { policeStations.map((item, index) => (
                            <option key={index} value={item.id}>{ item.station_name}</option>
                        ))}
                    </select>
                    <div className="invalid-feedback">{ errors.police_station }</div>
                    </div>
                </div>
                <div className="col-md-2 offset-4">
                    <div className="form-group">
                    <Form.Group className="mb-3">
                        <Form.Label>Crime Number</Form.Label>
                        <Form.Control 
                            type="text"
                            name="crime_number"
                            className={`${errors.crime_number ? 'is-invalid': ''}`}
                            value={petition.crime_number}
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.crime_number }</div>
                    </Form.Group>
                    </div>
                </div>
                <div className="col-md-1">
                    <Form.Group>
                        <Form.Label>Year</Form.Label>
                        <Form.Control 
                            type="text"
                            name="crime_year"
                            className={`${errors.crime_year ? 'is-invalid' : ''}`}
                            value={petition.crime_year}
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.crime_year }</div>
                    </Form.Group>   
                </div>  
                <div className="col-md-2 mt-4 pt-2">
                    <Form.Group>
                        <Button 
                            variant="info"
                            onClick={ handleSearch }
                        ><i className="fa fa-search mr-2"></i>Search</Button>
                    </Form.Group>
                </div>
                { loading && (
                    <Loader />
                )}
            </div>
            { showAdditionalFields && (
                <FIRDetails fir={petition}/>
            )}
        </div>    
    )
}

export default FIRSearch