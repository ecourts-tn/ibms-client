import api from 'api'
import * as Yup from 'yup'
import React, { useState, useContext, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Select from 'react-select'
import { RequiredField } from 'utils'
import { BaseContext } from 'contexts/BaseContext'
import { StateContext } from 'contexts/StateContext'
import { DistrictContext } from 'contexts/DistrictContext'
import { PoliceDistrictContext } from 'contexts/PoliceDistrictContext'
import { PoliceStationContext } from 'contexts/PoliceStationContext'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import FIRDetails from 'components/search/FIRDetails'
import Loading from 'components/common/Loading'
import { toast, ToastContainer } from 'react-toastify'

const FIRSearch = ({petition}) => {

    const {fir, setFir, setAccused, setFirId} = useContext(BaseContext)
    const {states} = useContext(StateContext)
    const {districts} = useContext(DistrictContext)
    const {policeDistricts} = useContext(PoliceDistrictContext)
    const {policeStations} = useContext(PoliceStationContext)
    const {language} = useContext(LanguageContext)
    const {t} = useTranslation()

    const [showAdditionalFields, setShowAdditionalFields] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [notFound, setNotFound] = useState('')
    const initialState = {
        state: '',
        rdistrict: '',
        pdistrict: '',
        police_station : '',
        crime_number:'',
        year:''
    }
    const [form, setForm] = useState(initialState)
    const validationSchema = Yup.object({
        state: Yup.string().required(t('errors.state_required')),
        rdistrict: Yup.string().required(t('errors.district_required')),
        pdistrict: Yup.string().required(t('errors.district_required')),
        police_station: Yup.string().required(t('errors.station_required')),
        crime_number: Yup.number().required("Please enter FIR number").typeError(t('errors.numeric')),
        year: Yup.number().required("Please enter year").typeError(t('errors.numeric'))
    })

    useEffect(() => {
        setForm({...form, 
            state: petition?.state,
            rdistrict: petition?.district
        })
    },[])

<<<<<<< HEAD
    console.log(petition)
    console.log(form)

=======
>>>>>>> deena
    const handleSearch = async (e) => {
        e.preventDefault()
        try{
            await validationSchema.validate(form, { abortEarly:false})
            setLoading(true)
            setShowAdditionalFields(false)
            const response = await api.post("external/police/tamilnadu/fir-details/", form);
            if (response.status === 200) {
                const data = typeof response.data.fir === 'string' ? JSON.parse(JSON.stringify(response.data.fir)) : response.data.fir;
                setFirId(response.data.id)
                setFir({
                    ...fir,
                    state: form.state,
                    district: form.rdistrict,
                    police_station: form.police_station,
                    fir_number: form.crime_number,
                    fir_year: form.year,
                    act: data?.act || "",
                    section: data?.section || [],
                    date_of_occurrence: data?.date_of_occurrence || "",
                    investigation_officer: data?.investigation_officer_name || "",
                    fir_date_time: data?.FIR_date_time || "",
                    place_of_occurrence: data?.place_of_occurence || "",
                    gist_of_fir: data?.gist_of_FIR || "",
                    gist_in_local: data?.gist_of_FIR_local_language || "",
                    complainant_age: data?.complainant_age || "",
                    complainant_guardian: data?.complainant_guardian || "",
                    complainant_guardian_name: data?.complainant_guardian_name || "",
                    complainant_name: data?.complaintant_name || "",
                    investigation_officer_rank: data?.investigation_officer_rank || "",
                    no_of_accused: data?.no_of_accused || 0,
                    sencitive_case: data?.sencitive_case || false
                });

                setShowAdditionalFields(true);
                setAccused(data?.accused_details || []);
                setNotFound("");
            } else {
                setNotFound(t('errors.fir_not_found'));
                setShowAdditionalFields(false);
                setForm(initialState);
            }

        }catch(error){
            if(error.response){
                if(error.response.status === 500){
                    toast.error("Internal server error", {
                        theme : "colored"
                    })
                }
            }
            if(error.inner){
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
            }
        }finally{
            setLoading(false)
        }
    }
    return (
        <>
            <ToastContainer />
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
                            disabled={ form.state !== "" ? true : false }
                        >
                        <option value="">{t('alerts.select_state')}</option>
                        { states.map((item, index) => (
                            <option key={index} value={item.state_code }>{ language === 'ta' ? item.state_lname : item.state_name }</option>
                        ))}
                        </select>
                        <div className="invalid-feedback">
                            { errors.state }
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="rdistrict">{t('revenue_district')}<RequiredField/></label>
                        <select 
                            name="rdistrict" 
                            className="form-control"
                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                            value={form.rdistrict}
                            disabled={ form.rdistrict !== "" ? true : false }
                        >
                            <option value="">Select district</option>
                            { districts.map((district, index) => (
                                <option key={index} value={district.district_code}>{language === 'ta' ? district.district_lname : district.district_name}</option>
                            ))}
                        </select>
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
                            placeholder={t('alerts.select_district')}
                            options={policeDistricts.filter(d=>parseInt(d.revenue_district)===parseInt(form.rdistrict)).map((district) => { return { 
                                value:district.district_code, label: language === 'ta' ? district.district_lname : district.district_name
                            }})} 
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
                            placeholder={t('alerts.select_station')}
                            options={policeStations.filter(p=>parseInt(p.district_code)===parseInt(form.pdistrict)).map((station) => { return { 
                                value:station.cctns_code, label:language === 'ta' ? station.station_lname : station.station_name
                            }})} 
                            className={`${errors.police_station ? 'is-invalid' : null}`}
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
                    <Loading />
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