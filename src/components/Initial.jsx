import api from 'api';
import * as Yup from 'yup'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import React, { useEffect, useState, useContext } from 'react'
import FIRSearch from 'components/search/FIRSearch';
import CaseSearch from 'components/search/CaseSearch';
import { toast, ToastContainer } from 'react-toastify';
import { useLocalStorage } from "hooks/useLocalStorage";
import { RequiredField } from 'utils';
import { BaseContext } from 'contexts/BaseContext';
import { DistrictContext } from 'contexts/DistrictContext';
import { StateContext } from 'contexts/StateContext';
import { EstablishmentContext } from 'contexts/EstablishmentContext';
import { CourtContext } from 'contexts/CourtContext';
import { JudiciaryContext } from 'contexts/JudiciaryContext';
import { SeatContext } from 'contexts/SeatContext';
import { BailTypeContext } from 'contexts/BailTypeContext';
import { ComplaintTypeContext } from 'contexts/ComplaintTypeContext';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';
import { PoliceDistrictContext } from 'contexts/PoliceDistrictContext';
import { PoliceStationContext } from 'contexts/PoliceStationContext';
import Loading from 'components/common/Loading'
import Select from 'react-select'
import FIRDetails from 'components/search/FIRDetails'
import { StepContext } from 'contexts/StepContext';


const Initial = () => {
    const {states}          = useContext(StateContext)
    const {districts}       = useContext(DistrictContext)
    const {establishments}  = useContext(EstablishmentContext)
    const {courts}          = useContext(CourtContext)
    const {judiciaries}     = useContext(JudiciaryContext)
    const {seats}           = useContext(SeatContext)
    const {bailtypes}       = useContext(BailTypeContext)
    const {complainttypes}  = useContext(ComplaintTypeContext)
    const {policeDistricts} = useContext(PoliceDistrictContext)
    const {policeStations}  = useContext(PoliceStationContext)
    const {language}        = useContext(LanguageContext)
    const {fir, setFir, setAccused, setFirId} = useContext(BaseContext)
    const {updateStep} = useContext(StepContext)

    const { t } = useTranslation()

    const initialState = {
        judiciary: 1,
        seat: '',
        state: '',
        district:'',
        pdistrict:'',
        police_station:'',
        fir_number:'',
        fir_year:'',
        search_type: '',
        cnr_number:'',
        investigation_agency:'',
        crime_number:'',
        crime_year:'',
        establishment: '',
        court:'',
        case_type: 1,
        cis_case_type:'',
        case_number:'',
        case_year:'',
        bail_type: '',
        complaint_type:'',
        crime_registered: 3,
    }
    const[petition, setPetition] = useState(initialState)
    const[jurisdicationCourts, setJurisdictionCourts] = useState([])
    const[magistrateCourt, setMagistrateCourt] = useState(null)
    const[isSubmitted, setIsSubmitted] = useState(false)
    const[loading, setLoading] = useState(false)
    const[viewFIR, setViewFIR] = useState(false)
    const[pending, setPending] = useState([])
    const [notFound, setNotFound] = useState('')
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSearch = () =>{

    }
    
    useEffect(() => {
        const efile_no = sessionStorage.getItem("efile_no")
        const fetchData = async() => {
            try{
                const response = await api.get(`case/filing/detail/`, {params:{efile_no}})
                if(response.status === 200){
                    const petition = response.data.petition
                    setPetition({...petition, 
                        judiciary: petition.judiciary?.id,
                        seat: petition.seat?.seat_code,
                        state: petition.state?.state_code,
                        district: petition.district?.district_code,
                        pdistrict: petition.district?.district_code,
                        police_station: petition.police_station?.cctns_code,
                        establishment: petition.establishment?.establishment_code,
                        court: petition.court?.court_code,
                        case_type:petition.case_type?.id,
                        bail_type: petition.bail_type?.id,
                        complaint_type: petition.complaint_type?.id
                    })
                }else{
                    setPetition(initialState)
                }
            }catch(error){
                console.error(error)
                setPetition(initialState)
            }
        }
        if(efile_no){
            fetchData()
        }else{
            setPetition(initialState)
        }
    },[])

    useEffect(() => {
        const fetchCourtDetail = async() => {
            try{
                const response = await api.get(`base/court/detail/`, {params:{id:magistrateCourt}})
                if(response.status === 200){
                    console.log(response.data)
                    setPetition({
                        ...petition,
                        court: response.data.court_code,
                        establishment: response.data.establishment,
                    })
                }
            }catch(error){
                console.error(error)
            }
        }
        if(magistrateCourt)
        fetchCourtDetail();
    }, [magistrateCourt])

    const[errors, setErrors] = useState({})
    const [user, setUser] = useLocalStorage("user", null)


    let validationSchema = Yup.object({
        judiciary: Yup.string().required("Please select court type"),
        seat: Yup.string().when("judiciary",(judiciary, schema) => {
            if(parseInt(judiciary) === 1){
                return schema.required(t('errors.bench_required'))
            }
        }),
        state: Yup.string().when("judiciary", (judiciary, schema) => {
            if(parseInt(judiciary) === 2){
                return schema.required(t('errors.state_required'))
            }
        }),
        district: Yup.string().when("judiciary", (judiciary, schema) => {
            if(parseInt(judiciary) === 2){
                return schema.required(t('errors.district_required'))
            }
        }),
        establishment: Yup.string().when("judiciary", (judiciary, schema) => {
            if(parseInt(judiciary) === 2){
                return schema.required(t('errors.est_required'))
            }
        }),
        court: Yup.string().when("judiciary", (judiciary, schema) => {
            if(parseInt(judiciary) === 2){
                return schema.required(t('errors.court_required'))
            }
        }),
        bail_type: Yup.string().required(t('errors.bail_required')),
        complaint_type: Yup.string().required(t('errors.complaint_required')),
    })

    const FirValidationSchema = Yup.object({
        state: Yup.string().required(t('errors.state_required')),
        district: Yup.string().required(t('errors.district_required')),
        pdistrict: Yup.string().required(t('errors.police_district_required')),
        police_station: Yup.string().required(t('errors.police_station_required')),
        fir_number: Yup.string().required(t('errors.fir_number_required')),
        fir_year: Yup.string().required(t('errors.fir_year_required')),
    })

    const handleCheckPending = async(e) => {
        e.preventDefault()
        const data = {
            state: petition.state,
            district: petition.district,
            pdistrict: petition.pdistrict,
            police_station : petition.police_station,
            crime_number: petition.fir_number,
            year:petition.fir_year
        }
        try {
            const response = await api.post(`/external/police/check-fir/`, data);
            if (response.status === 200) {
                if(response.data.exist){
                    setShow(true)
                    setPending(response.data.petition)
                }
            } else {
                console.log("FIR not found locally. Fetching from external API...");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleFirSearch = async(e) => {
        e.preventDefault()
        try{
            await FirValidationSchema.validate(petition, {abortEarly:false})
            const crime = {
                state: petition.state,
                district: petition.district,
                pdistrict: petition.pdistrict,
                police_station: petition.police_station,
                fir_number: petition.fir_number,
                fir_year: petition.fir_year
            }
            setLoading(true)
            setViewFIR(false)
            const response = await api.post("external/police/tamilnadu/search-fir/", crime);
            if (response.status === 200) {
                const data = typeof response.data.fir === 'string' ? JSON.parse(JSON.stringify(response.data.fir)) : response.data.fir;
                setFirId(response.data.id)
                setViewFIR(true);
                setNotFound("");
                const response2 = await api.post(`base/jurisdiction-courts/`, {station:petition.police_station})
                if(response.status === 200){
                   setJurisdictionCourts(response2.data)
                }
            } else {
                setNotFound(t('errors.fir_not_found'));
                setViewFIR(false);
                setPetition(initialState);
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

    const handleCaseSearch = async() => {
        try{
            setLoading(true)
            const response = await api.get(`external/ecourt/case-detail`, {params:
                {
                    establishment:petition.establishment,
                    cino:petition.cnr_number,
                    case_type:petition.cis_case_type,
                    case_number:petition.case_number,
                    case_year:petition.case_year
                }
            });
            console.log(response.data)
            if(response.status === 200){
                const accused  = [
                    response.data.res_name, // Add res_name
                    ...Object.values(response.data.res_extra_party) // Spread the values of res_extra_party
                ];
                setAccused(accused)
            }
        }catch(error){
            if(error.response){
                if(error.response.status === 500){
                    toast.error("Internal server error", {
                        theme:"colored"
                    })
                }
            }
        }finally{
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            await validationSchema.validate(petition, { abortEarly:false})
            const response = await api.post("case/filing/create/", {petition, fir})
            if(response.status === 201){
                const efile_no = response.data.efile_number
                sessionStorage.setItem("efile_no", efile_no)
                toast.success(t('alerts.submit_success').replace('{efile_no}', efile_no), {
                    theme:"colored"
                })
                setIsSubmitted(true); 
                updateStep(efile_no, 2)
            }
          }catch(error){
            if (error.inner){
                const newErrors = {};
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message;
                });
                setErrors(newErrors);
            }
        }
    }

 
 
    return (
        <div className="container-fluid mt-5">
            { loading && <Loading />}
            <ToastContainer />
            <form method='post' id="initial-input">
                <div className="row form-group mb-4">
                    <label htmlFor="" className="col-sm-2 col-form-label">{t('complaint_type')}<RequiredField /></label>
                    <div className="col-md-4">
                        <select 
                            name="complaint_type" 
                            id="complaint_type"
                            className={`form-control ${errors.complaint_type ? 'is-invalid' : null}`}   
                            value={petition.complaint_type }
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}           
                        >
                            <option value="">{t('alerts.select_complaint_type')}</option>
                            { complainttypes.map((item, index) => (
                                <option key={index} value={item.id}>{language === 'ta' ? item.type_lname : item.type_name }</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">
                            { errors.complaint_type }
                        </div>    
                    </div>
                    <label htmlFor="" className="col-sm-2">{t('crime_registered')}<RequiredField /></label>
                    <div className="col-sm-4">
                        <div className="icheck-success d-inline mx-2">
                            <input 
                                type="radio" 
                                id="radioPrimary1" 
                                name="crime_registered" 
                                onClick={(e) => setPetition({...petition, [e.target.name]:1})} 
                                checked={parseInt(petition.crime_registered) === 1 ? true : false }
                            />
                            <label htmlFor="radioPrimary1">{t('yes')}</label>
                        </div>
                        <div className="icheck-danger d-inline mx-2">
                            <input 
                                type="radio" 
                                id="radioPrimary2" 
                                name="crime_registered" 
                                onClick={(e) => setPetition({...petition, [e.target.name]:2})}
                                checked={parseInt(petition.crime_registered) === 2 ? true : false }
                            />
                            <label htmlFor="radioPrimary2">{t('no')}</label>
                        </div>
                        <div className="icheck-primary d-inline mx-2">
                            <input 
                                type="radio" 
                                id="radioPrimary3" 
                                name="crime_registered" 
                                onClick={(e) => setPetition({...petition, [e.target.name]:3})}
                                checked={parseInt(petition.crime_registered) === 3 ? true : false }
                            />
                            <label htmlFor="radioPrimary3">{t('not_known')}</label>
                        </div>
                    </div>
                </div>
                { parseInt(petition.complaint_type) === 1 && parseInt(petition.crime_registered) === 1 && (
                <React.Fragment>
                <div className="form-group row mb-4">
                    <label htmlFor="state" className='col-sm-2 col-form-label'>{t('state')}<RequiredField/></label>
                    <div className="col-md-4">
                        <select 
                            name="state" 
                            id="state" 
                            className={ `form-control ${errors.state ? 'is-invalid': ''}`}
                            value={petition.state}
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value })}    
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
                    <label htmlFor="rdistrict" className="col-sm-2 col-form-label">{t('revenue_district')}<RequiredField/></label>
                    <div className="col-md-4">
                        <select 
                            name="district" 
                            className={`form-control ${errors.district ? 'is-invalid' : ''}`}
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                            value={petition.district}
                        >
                            <option value="">Select district</option>
                            { districts.filter(d=>parseInt(d.state) === parseInt(petition.state)).map((district, index) => (
                                <option key={index} value={district.district_code}>{language === 'ta' ? district.district_lname : district.district_name}</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">
                            { errors.district }
                        </div>
                    </div>
                </div>
                <div className="form-group row mb-4">
                    <label htmlFor="pdistrict" className="col-sm-2 col-form-label">{t('police_district')}<RequiredField/></label>
                    <div className="col-md-4">
                        <select 
                            name="pdistrict" 
                            className={`form-control ${errors.district ? 'is-invalid' : ''}`}
                            placeholder={t('alerts.select_district')}
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                            value={petition.pdistrict}
                        >
                            <option value="">Select district</option>
                            { policeDistricts.filter(d=>parseInt(d.revenue_district)===parseInt(petition.district)).map((district, index) => (
                                <option key={index} value={district.district_code}>{language === 'ta' ? district.district_lname : district.district_name}</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">
                            { errors.pdistrict }
                        </div>
                    </div>
                    <label htmlFor="police_station" className='col-sm-2 col-form-label'>{t('police_station')}<RequiredField/></label>
                    <div className="col-md-4">
                        <select 
                            name="police_station" 
                            className={`form-control ${errors.district ? 'is-invalid' : ''}`}
                            placeholder={t('alerts.select_station')}
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                            value={petition.police_station}
                        >
                            <option value="">Select station</option>
                            { policeStations.filter(p=>parseInt(p.district_code)===parseInt(petition.pdistrict)).map((s, index) => (
                                <option key={index} value={s.cctns_code}>{language === 'ta' ? s.station_lname : s.station_name}</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">{ errors.police_station }</div>
                    </div>
                </div>
                <div className="form-group row mb-4">
                    <label htmlFor="" className="col-sm-2 col-form-label">{t('fir_number')}<RequiredField/></label>
                    <div className="col-md-2">
                        <Form.Control 
                            type="text"
                            name="fir_number"
                            className={`${errors.fir_number ? 'is-invalid': ''}`}
                            value={petition.fir_number}
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                            placeholder='Crime Number'
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.fir_number }</div>
                    </div>
                    {/* <label htmlFor="" className="col-sm-1 col-form-label text-left">{t('fir_year')}<RequiredField/></label> */}
                    <div className="col-md-2">
                        <Form.Control 
                            type="text"
                            name="fir_year"
                            className={`${errors.fir_year ? 'is-invalid' : ''}`}
                            value={petition.fir_year}
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                            placeholder='Year'
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.fir_year }</div>
                    </div>
                    <div className="col-md-4">
                        <Button 
                            variant="info"
                            onClick={ handleFirSearch }
                        ><i className="fa fa-search mr-2"></i>Search FIR</Button>
                        { viewFIR && (<FIRDetails/>)}
                    </div>
                </div>
                </React.Fragment>
                )}
                { parseInt(petition.complaint_type) === 3 && (
                <div className="form-group row mb-4">
                    <label htmlFor="" className="col-sm-2 col-form-label">Search Type</label>
                    <div className="col-md-4">
                        <div className="icheck-success d-inline mx-2">
                            <input 
                                type="radio" 
                                name="search_type" 
                                id="case_search_basic" 
                                onClick={(e) => setPetition({...petition, [e.target.name]: 1})} 
                                checked={ parseInt(petition.search_type) === 1 }
                            />
                            <label htmlFor="case_search_basic">{t('basic_search')}</label>
                        </div>
                        <div className="icheck-success d-inline mx-2">
                            <input 
                                type="radio" 
                                name="search_type" 
                                id="case_search_advanced" 
                                onClick={(e) => setPetition({...petition, [e.target.name]: 2})}
                                checked={ parseInt(petition.search_type) === 2 }
                            />
                            <label htmlFor="case_search_advanced">{t('advance_search')}</label>
                        </div>
                    </div>
                </div>
                )}
                { parseInt(petition.search_type) === 1 && (
                <div className="form-group row mb-4">
                    <label className="col-sm-2">{t('cnr_number')}</label>     
                    <div className="col-md-4">
                        <Form.Control
                            name="cnr_number"
                            value={petition.cnr_number}
                            className={`${errors.cnr_number ? 'is-invalid' : ''}`}
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                            placeholder='CNR Number'
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.cnr_number }</div>
                    </div> 
                    <div className="col-md-2">
                        <Button 
                            variant="info"
                            onClick={ handleSearch }
                        ><i className="fa fa-search mr-2"></i>{t('search')}</Button>
                    </div>
                </div>
                )}
                { parseInt(petition.complaint_type) === 2 && (
                <div className="form-group row mb-4">
                    <label htmlFor="" className="col-sm-2 col-form-label">Investigation Agency</label>
                    <div className="col-md-6">
                        <input 
                            type="text" 
                            name="" 
                            className="form-control" 
                            placeholder='Investigation Agency Name'
                        />
                    </div>
                    <div className="col-md-2">
                            <input 
                            type="text" 
                            name="" 
                            className="form-control" 
                            placeholder='Crime Number'
                        />
                    </div>
                    <div className="col-md-2">
                        <input 
                            type="text" 
                            name=""
                            className="form-control" 
                            placeholder='Crime year'
                        />
                    </div>
                </div>
                )}
                { parseInt(petition.search_type) === 2 && (
                <React.Fragment>    
                <div className="form-group row mb-4">
                    <label htmlFor="state" className='col-sm-2 col-form-label'>{t('state')}</label>
                    <div className="col-md-4">
                        <select 
                            name="state" 
                            id="state" 
                            className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                            value={ petition.state} 
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value })}
                        >
                            <option value="">{t('alerts.select_state')}</option>
                            { states.map( (item, index) => (
                                <option key={index} value={item.state_code}>{language === 'ta' ? item.state_lname : item.state_name}</option>)
                            )}
                        </select>
                        <div className="invalid-feedback">{t('errors.state_required')}</div>
                    </div>
                    <label htmlFor="district" className='col-sm-2 col-form-label'>{t('district')}</label>
                    <div className="col-md-4">
                        <Select 
                            name="district"
                            placeholder={t('alerts.select_district')}
                            options={districts.filter(district=>parseInt(district.state)===parseInt(petition.state)).map((district) => { return { 
                                value:district.district_code, label: language === 'ta' ? district.district_lname : district.district_name
                            }})} 
                            className={`${errors.district ? 'is-invalid' : null}`}
                            onChange={(e) => setPetition({...petition, district:e.value})}
                            disabled={ petition.district !== "" ? true : false }
                        />
                        <div className="invalid-feedback">{t('errors.district_required')}</div>
                    </div>
                </div>
                <div className="form-group row mb-4">
                    <label htmlFor="establishment" className='col-sm-2 col-form-label'>{t('est_name')}</label>
                    <div className="col-md-4">
                        <Select 
                            name="establishment"
                            placeholder={t('alerts.select_establishment')}
                            options={establishments.filter(e=>parseInt(e.district)=== parseInt(petition.district)).map((est) => { return { 
                                value:est.establishment_code, label: language === 'ta' ? est.establishment_lname : est.establishment_name
                            }})} 
                            className={`${errors.establishment ? 'is-invalid' : null}`}
                            onChange={(e) => setPetition({...petition, establishment:e.value})}
                        />
                        <div className="invalid-feedback">{t('errors.est_required')}</div>
                    </div>
                    <label htmlFor="court" className='col-sm-2 col-form-label'>{t('court')}</label>
                    <div className="col-md-4">
                        <Select 
                            name="court"
                            placeholder={t('alerts.select_court')}
                            options={courts.filter(c=>c.establishment===petition.establishment).map((est) => { return { 
                                value:est.court_code, label: language === 'ta' ? est.court_lname : est.court_name
                            }})} 
                            className={`${errors.court ? 'is-invalid' : null}`}
                            onChange={(e) => setPetition({...petition, court:e.value})}
                        />
                        <div className="invalid-feedback">{t('errors.court_required')}</div>
                    </div>
                </div>
                <div className="form-group row mb-4">
                    <label className='col-sm-2 col-form-label'>{t('case_number')}</label>
                    <div className="col-md-4">
                        <select 
                            name="cis_case_type" 
                            className={`form-control ${errors.cis_case_type ? 'is-invalid' : ''}`}
                            value={petition.cis_case_type}
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}    
                        >
                            <option value="">{t('alerts.select_case_type')}</option>
                            <option value="321">SC</option>
                        </select>
                        <div className="invalid-feedback">{t('errors.case_type_required')}</div>
                    </div>
                    <div className="col-md-2">
                        <Form.Control
                            name="case_number"
                            value={petition.case_number}
                            className={`${errors.case_number ? 'is-invalid' : ''}`}
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value })}
                            placeholder='Case Number'
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.case_number }</div>
                    </div>
                    <div className="col-md-2">
                        <Form.Control
                            name="case_year"
                            value={petition.case_year}
                            className={`${errors.case_year ? 'is-invalid' : ''}`}
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                            placeholder='Year'
                        ></Form.Control>
                        <div className="invalid-feedback">{ errors.case_year }</div>   
                    </div>
                    <div className="col-md-2">
                        <Button 
                            variant="info"
                            onClick={handleCaseSearch}
                        ><i className="fa fa-search mr-2"></i>{t('search')}</Button>
                    </div>
                </div>
                </React.Fragment> 
                )}
                <div className="form-group row mb-4">
                    <label htmlFor="" className="col-sm-2 col-form-label">{t('jurisdiction')}</label>
                    <div className="col-md-4">
                        <select 
                            name="judiciary" 
                            className='form-control'
                            value={petition.judiciary}
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                        >
                            <option value="">Select jurisdiction</option>
                            { judiciaries.map((j, index) => (
                                <option key={index} value={j.id}>{language === 'ta' ? j.judiciary_lname : j.judiciary_name}</option>
                            ))}
                        </select>
                    </div>
                    { parseInt(petition.judiciary) === 1 && (
                    <React.Fragment>
                        <label htmlFor="seat" className='col-sm-2 col-form-label'>{t('hc_bench')}<RequiredField /></label>
                        <div className="col-md-4">
                            <select 
                                name="seat" 
                                className={`form-control ${errors.seat ? 'is-invalid' : ''} `}
                                value={petition.seat}
                                onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                            >
                                <option value="">{t('alerts.select_bench_type')}</option>
                                { seats.map((s, index) => (
                                    <option key={index} value={s.seat_code}>{language === 'ta' ? s.seat_lname :s.seat_name}</option>
                                ))}
                            </select>
                            <div className="invalid-feedback">
                                { errors.seat }
                            </div>
                        </div>
                    </React.Fragment>
                    )}
                </div>
                { parseInt(petition.judiciary) === 3 && (
                <div className="form-group row mb-4">
                    <label htmlFor="" className="col-sm-2 col-form-label">{t('alerts.select_magistrate_court')}</label>
                    <div className="col-md-4">
                        <select 
                            name="jurisdiction_court" 
                            className='form-control'
                            value={magistrateCourt}
                            onChange={(e) => setMagistrateCourt(e.target.value)}
                        >
                            <option value="">Select Court</option>
                            { jurisdicationCourts.map((c, index) => (
                                <option key={index} value={c.court.court_code}>{language === 'ta' ? c.court.court_lname : c.court.court_name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                )}
                { parseInt(petition.judiciary) === 2 && (
                <React.Fragment>
                <div className="form-group row mb-4">
                    <label htmlFor="state" className='col-sm-2 col-form-label'>{t('state')}<RequiredField /></label>
                    <div className="col-md-4">
                        <select 
                            name="state" 
                            className={`form-control ${errors.state ? 'is-invalid': null }`}
                            value={petition.state } 
                            onChange={(e)=>setPetition({...petition, [e.target.name]: e.target.value})}
                            disabled={ petition.state && parseInt(petition.judiciary) !== 1}
                        >
                            <option value="">{t('alerts.select_state')}</option>
                            { states.map( (item, index) => (
                                <option key={index} value={item.state_code}>{language==='ta' ? item.state_lname : item.state_name}</option>)
                            )}
                        </select>
                        <div className="invalid-feedback">
                            { errors.state }
                        </div>
                    </div>
                    <label htmlFor="district" className='col-sm-2 col-form-label'>{t('district')}<RequiredField /></label>
                    <div className="col-md-4">
                        <select 
                            id="basic_district"
                            name="district" 
                            className={`form-control ${errors.district ? 'is-invalid' : null}`}
                            value={petition.district }
                            onChange={(e) => setPetition({...petition, [e.target.name]:e.target.value})}
                            disabled={ petition.district && parseInt(petition.judiciary) !== 1}
                        >
                            <option value="">{t('alerts.select_district')}</option>
                            { districts.filter(district=>parseInt(district.state)===parseInt(petition.state)).map( (d, index) => (
                                <option key={index} value={d.district_code}>{language==='ta' ? d.district_lname : d.district_name}</option>)
                            )}
                        </select>
                        <div className="invalid-feedback">
                            { errors.district }
                        </div>
                    </div>
                </div>
                <div className="form-group row mb-4">
                    <label htmlFor="establishment" className='col-sm-2 col-form-label'>{t('est_name')}<RequiredField /></label>
                    <div className="col-md-4">
                        <select 
                            name="establishment" 
                            id="establishment" 
                            className={`form-control ${errors.establishment ? 'is-invalid' : null}`}
                            value={petition.establishment }
                            onChange={(e) => setPetition({...petition, [e.target.name]:e.target.value})}
                        >
                            <option value="">{t('alerts.select_establishment')}</option>
                            {  establishments.filter(e=>parseInt(e.district)=== parseInt(petition.district) && e.bail_filing).map((item, index) => (
                                    <option value={item.establishment_code} key={index}>{language === 'ta' ? item.establishment_lname : item.establishment_name}</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">
                            { errors.establishment }
                        </div>
                    </div>
                    <label htmlFor="court" className='col-sm-2 col-form-label'>{t('court')}<RequiredField /></label>
                    <div className="col-md-4">
                        <select 
                            name="court" 
                            id="court" 
                            className={`form-control ${errors.court ? 'is-invalid' : null }`}
                            value={ petition.court }
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                        >
                            <option value="">{t('alerts.select_court')}</option>
                            {   courts.filter(c=>c.establishment===petition.establishment && c.bail_filing)
                                .map((item, index) => (
                                    <option key={index} value={item.court_code}>{ language === 'ta' ? item.court_lname : item.court_name }</option>
                                ))
                            }
                        </select>
                        <div className="invalid-feedback">
                            { errors.court }
                        </div>
                    </div>
                </div>  
                </React.Fragment>    
                )}
                <div className="form-group row mb-4">
                    <label htmlFor="bail_type" className='col-sm-2 col-form-label'>{t('bail_type')}<RequiredField /></label>
                    <div className="col-md-4">
                        <select 
                            name="bail_type" 
                            id="bail_type" 
                            className={`form-control ${errors.bail_type ? 'is-invalid' : null}`}
                            value={petition.bail_type }
                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                        >
                            <option value="">{t('alerts.select_bail_type')}</option>
                            { bailtypes.map((b, index) => (
                            <option key={index} value={b.id}>{ language === 'ta' ? b.type_lname : b.type_name }</option>
                            ))}
                        </select>
                        <div className="invalid-feedback">
                            { errors.bail_type}
                        </div>
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-md-12 text-center">
                        <Button
                            variant="success"
                            color="success"
                            onClick={handleSubmit}
                        >
                            {t('submit')}
                        </Button>
                    </div>
                </div>
                <Modal 
                    show={show} 
                    onHide={handleClose} 
                    backdrop="static"
                    keyboard={false}
                    size="lg"
                >
                    <Modal.Header className="bg-warning">
                        <strong>Warning</strong>
                        <button 
                            type="button" 
                            class="close" 
                            data-dismiss="modal"
                            onClick={handleClose}
                        >&times;</button>
                    </Modal.Header>
                    <Modal.Body>
                        <ol>
                            { pending.map((p, index) => (
                                <li key={index} className='mb-2 text-secondary'><strong>The petition <strong className='text-primary'>{p.efile_number}</strong> is filed with the same FIR details is pending before with {p.court?.court_name} {p.district.distrct_name}</strong></li>
                            ))}
                        </ol>           
                    </Modal.Body>
                    <Modal.Footer>
                        <p className='text-dark text-left'><strong>Are you sure want to proceed?</strong></p>
                        <div className="d-flex justify-content-between">
                            <Button 
                                variant="danger" 
                                onClick={handleClose}
                                className="px-3"
                            >
                                {t('no')}
                            </Button>
                            <Button 
                                variant="success" 
                                onClick={handleClose}
                                className="px-3 ml-2"
                            >
                                {t('yes')}
                            </Button>

                        </div>
                    </Modal.Footer>
                </Modal>
            </form>
        </div>
    )
}

export default Initial
