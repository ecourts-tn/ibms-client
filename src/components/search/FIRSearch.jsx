import React, { useContext } from 'react'
import { useState } from 'react'
import api from '../../api'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useSelector, useDispatch } from 'react-redux'
import FIRDetails from './FIRDetails'
import Loader from '../Loader'
import * as Yup from 'yup'
import { RequiredField } from '../../utils'
import Select from 'react-select'
import { BaseContext } from '../../contexts/BaseContext'


const FIRSearch = () => {

    const {
        states, 
        districts, 
        policeStations, 
        fir, 
        setFir, 
        accused, 
        setAccused
    } = useContext(BaseContext)

    // const stateStatus = useSelector(getStatesStatus)
    // const states = useSelector((state) => state.states.states)
    // const districts = useSelector((state) => state.districts.districts)
    // const policeStations = useSelector((state) => state.police_stations.police_stations)

    const [showAdditionalFields, setShowAdditionalFields] = useState(false)
    const [loading, setLoading] = useState(false)
    const[errors, setErrors] = useState({})
    const initialState = {
        state: '',
        district: '',
        police_station : '',
        crime_number:'',
        year:''
    }
    const[form, setForm] = useState(initialState)

    const validationSchema = Yup.object({
        state: Yup.string().required("Please select state"),
        district: Yup.string().required("Please select district"),
        police_station: Yup.string().required("Please select police station"),
        crime_number: Yup.number().required("Please enter FIR number").typeError("This field should be numeric"),
        year: Yup.number().required("Please enter year").typeError("This field should be numeric")
    })

    const handleSearch = async (e) => {
        e.preventDefault()
        try{
            await validationSchema.validate(form, { abortEarly:false})
            setLoading(true)
            setShowAdditionalFields(false)
            const response = await api.get("external/police/tamilnadu/fir-details/", {
                params: form
            })
            console.log(typeof(response.data))
            if(response.status === 200){
                setLoading(false)
                setFir({...fir,
                    state: form.state,
                    district: form.district,
                    police_station: form.police_station,
                    fir_number: form.crime_number,
                    fir_year: form.year,
                    date_of_occurrence  : response.data.date_of_Occurrence,
                    investigation_officer: response.data.investigation_officer_name,
                    fir_date_time: response.data.FIR_DATE_Time,
                    place_of_occurrence: response.data.place_of_occurence,
                    gist_of_fir: response.data.gist_of_FIR,
                    gist_in_local: response.data.gist_of_FIR_local_language,
                    complainant_age: response.data.complainant_age,
                    complainant_guardian: response.data.complainant_guardian,
                    complainant_guardian_name: response.data.complainant_guardian_name,
                    complainant_name:response.data.complaintant_name,
                    investigation_officer_rank:response.data.investigation_officer_rank,
                    no_of_accused: response.data.no_of_accused
                })
                setShowAdditionalFields(true)
            }
            const response2 = await api.get("external/police/tamilnadu/accused-details/", {
                params: form
            })
            if(response2.status === 200){
                setAccused(response2.data)
            }
        }catch(error){
            console.log(error.inner)
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
        <>
            <div className="row" style={{border:"1px solid #ffc107"}}>
                <div className="col-md-12 p-0">
                    <p className="bg-warning py-1 px-3"><strong>FIR Search</strong></p>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="state">State<RequiredField/></label>
                        <select 
                            name="state" 
                            id="state" 
                            className={ `form-control ${errors.state ? 'is-invalid': ''}`}
                            value={form.state}
                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value })}    
                        >
                        <option value="">Select state</option>
                        { states.map((item, index) => (
                            <option key={index} value={item.state_code }>{ item.state_name }</option>
                        ))}
                        </select>
                        <div className="invalid-feedback">
                            { errors.state }
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="district">District<RequiredField/></label><br />
                        <Select 
                            name="district"
                            options={districts.filter(d=>parseInt(d.state)===parseInt(form.state)).map((district) => { return { value:district.district_code, label:district.district_name}})} 
                            className={`${errors.district ? 'is-invalid' : null}`}
                            onChange={(e) => setForm({...form, district:e.value})}
                        />
                        {/* <select 
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
                        </select> */}
                        <div className="invalid-feedback">
                            { errors.district }
                        </div>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="form-group">
                    <label htmlFor="police_station">Police Station<RequiredField/></label><br />
                    <Select 
                        name="police_station"
                        options={policeStations.filter(p=>parseInt(p.revenue_district)===parseInt(form.district)).map((station) => { return { value:station.cctns_code, label:station.station_name}})} 
                        className={`${errors.district ? 'is-invalid' : null}`}
                        onChange={(e) => setForm({...form, police_station:e.value})}
                    />
                    {/* <select 
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
                    </select> */}
                    <div className="invalid-feedback">{ errors.police_station }</div>
                    </div>
                </div>
                <div className="col-md-2 offset-4">
                    <Form.Group className="mb-3">
                        <Form.Label>FIR Number<RequiredField/></Form.Label>
                        <Form.Control 
                            type="text"
                            name="crime_number"
                            className={`${errors.crime_number ? 'is-invalid': ''}`}
                            value={form.crime_number}
                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.crime_number }</div>
                    </Form.Group>
                </div>
                <div className="col-md-2">
                    <Form.Group>
                        <Form.Label>Year<RequiredField/></Form.Label>
                        <Form.Control 
                            type="text"
                            name="year"
                            className={`${errors.year ? 'is-invalid' : ''}`}
                            value={form.year}
                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.year }</div>
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
                <div className="col-md-12 d-flex justify-content-center">
                    { showAdditionalFields && (
                        <FIRDetails/>
                    )}
                </div>
            </div>
        </>    
    )
}

export default FIRSearch