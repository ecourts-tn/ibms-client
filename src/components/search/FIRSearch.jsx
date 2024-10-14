import React, { useContext } from 'react'
import { useState } from 'react'
import api from '../../api'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FIRDetails from './FIRDetails'
import Loader from '../Loader'
import * as Yup from 'yup'
import { RequiredField } from '../../utils'
import Select from 'react-select'
import { BaseContext } from '../../contexts/BaseContext'
import { StateContext } from 'contexts/StateContext'
import { DistrictContext } from 'contexts/DistrictContext'
import { PoliceDistrictContext } from 'contexts/PoliceDistrictContext'
import { PoliceStationContext } from 'contexts/PoliceStationContext'
import { useTranslation } from 'react-i18next'


const FIRSearch = () => {

    const {fir, setFir, setAccused} = useContext(BaseContext)
    const {states} = useContext(StateContext)
    const {districts} = useContext(DistrictContext)
    const {policeDistricts} = useContext(PoliceDistrictContext)
    const {policeStations} = useContext(PoliceStationContext)
    const { t } = useTranslation()

    const [showAdditionalFields, setShowAdditionalFields] = useState(false)
    const [loading, setLoading] = useState(false)
    const[errors, setErrors] = useState({})
    const[notFound, setNotFound] = useState('')
    const initialState = {
        state: '',
        rdistrict: '',
        pdistrict: '',
        police_station : '',
        crime_number:'',
        year:''
    }
    const[form, setForm] = useState(initialState)

    const validationSchema = Yup.object({
        state: Yup.string().required("Please select state"),
        rdistrict: Yup.string().required("Please select district"),
        pdistrict: Yup.string().required("Please select district"),
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
            const response = await api.post("external/police/tamilnadu/fir-details/", form)
            if(response.status === 200){
                setLoading(false)
                if(response.data.FIR_date_time){
                    setFir({...fir,
                        state: form.state,
                        district: form.rdistrict,
                        police_station: form.police_station,
                        fir_number: form.crime_number,
                        fir_year: form.year,
                        act: response.data.act,
                        section: response.data.section,
                        date_of_occurrence  : response.data.date_of_occurrence,
                        investigation_officer: response.data.investigation_officer_name,
                        fir_date_time: response.data.FIR_date_time,
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
                    setAccused(response.data.accused_details)
                    setNotFound('')
                }
                else{
                    setNotFound('FIR details not found!!!.')
                    setShowAdditionalFields(true)
                    setForm(initialState)
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
    console.log(states)
    console.log(districts)
    return (
        <>
            <div className="row">
                {/* <div className="col-md-12 p-0">
                    <p className="bg-warning py-1 px-3"><strong>FIR Search</strong></p>
                </div> */}
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="state">{t('state')}<RequiredField/></label>
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
                        <label htmlFor="rdistrict">{t('revenue_district')}<RequiredField/></label><br />
                        <Select 
                            name="rdistrict"
                            options={districts.filter(d=>parseInt(d.state)===parseInt(form.state)).map((district) => { return { value:district.district_code, label:district.district_name}})} 
                            className={`${errors.rdistrict ? 'is-invalid' : null}`}
                            onChange={(e) => setForm({...form, rdistrict:e.value})}
                        />
                        <div className="invalid-feedback">
                            { errors.rdistrict }
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="pdistrict">{t('police_district')}<RequiredField/></label><br />
                        <Select 
                            name="pdistrict"
                            options={policeDistricts.filter(d=>parseInt(d.revenue_district)===parseInt(form.rdistrict)).map((district) => { return { value:district.district_code, label:district.district_name}})} 
                            className={`${errors.pdistrict ? 'is-invalid' : null}`}
                            onChange={(e) => setForm({...form, pdistrict:e.value})}
                        />
                        <div className="invalid-feedback">
                            { errors.pdistrict }
                        </div>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="form-group">
                    <label htmlFor="police_station">{t('police_station')}<RequiredField/></label><br />
                    <Select 
                        name="police_station"
                        options={policeStations.filter(p=>parseInt(p.district_code)===parseInt(form.pdistrict)).map((station) => { return { value:station.cctns_code, label:station.station_name}})} 
                        className={`${errors.district ? 'is-invalid' : null}`}
                        onChange={(e) => setForm({...form, police_station:e.value})}
                    />
                    <div className="invalid-feedback">{ errors.police_station }</div>
                    </div>
                </div>
                <div className="col-md-2">
                    <Form.Group className="mb-3">
                        <Form.Label>{t('fir_number')}<RequiredField/></Form.Label>
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
                        <Form.Label>{t('fir_year')}<RequiredField/></Form.Label>
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
                        ><i className="fa fa-search mr-2"></i>{t('search')}</Button>
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
            { notFound !== '' && (
                <div className="alert alert-danger">{notFound}</div>
            )}
        </>    
    )
}

export default FIRSearch