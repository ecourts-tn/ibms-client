import api from 'api';
import * as Yup from 'yup'
import 'react-toastify/dist/ReactToastify.css';
import Form from 'react-bootstrap/Form'
import Button from '@mui/material/Button'
import React, { useEffect, useState, useContext } from 'react'
import StepperButton from './filing/bail/StepperButton';
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
import { bailRoutes } from 'routes/filingRoutes';


const InitialInput = () => {
    const {fir} = useContext(BaseContext)
    const {states}          = useContext(StateContext)
    const {districts}       = useContext(DistrictContext)
    const {establishments}  = useContext(EstablishmentContext)
    const {courts}          = useContext(CourtContext)
    const {judiciaries}     = useContext(JudiciaryContext)
    const {seats}           = useContext(SeatContext)
    const {bailtypes}       = useContext(BailTypeContext)
    const {complainttypes}  = useContext(ComplaintTypeContext)
    const {language}        = useContext(LanguageContext)
    const { t } = useTranslation()

    const initialState = {
        judiciary: 1,
        seat: '',
        state: '',
        district:'',
        establishment: '',
        court:'',
        case_type: 1,
        bail_type: '',
        complaint_type:'',
        crime_registered: '',
    }
    const[petition, setPetition] = useState(initialState)
    const[isSubmitted, setIsSubmitted] = useState(false)
    
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

    const[errors, setErrors] = useState({})
    const [user, setUser] = useLocalStorage("user", null)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPetition((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


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

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            await validationSchema.validate(petition, { abortEarly:false})
            // setPetition({...petition, adv_code:user.user.userlogin})
            const response = await api.post("case/filing/create/", petition)
            if(response.status === 201){
                const efile_no = response.data.efile_number
                sessionStorage.setItem("efile_no", efile_no)
                const requests = []
                if(Object.keys(fir).length > 0){
                    fir.efile_no = efile_no
                    const crime_reqeust = await api.post(`case/crime/details/create/`, fir);
                    requests.push(crime_reqeust)
                }
                if(parseInt(user.user_type) === 1){
                    const advocate = {
                        petition: efile_no,
                        advocate: user.userlogin,
                        is_primary: true
                    }
                    const advocate_request = await api.post(`case/advocate/`, advocate);
                    requests.push(advocate_request)
                }        
                if(requests.length > 0){
                    const responses = await Promise.all(requests);
                    responses.forEach((res, index) => {
                        if (res.status === 201 || res.status === 200) {
                            console.log(`Response ${index + 1} success:`, res.data.message);
                          }
                    })
                }
                toast.success(t('alerts.submit_success').replace('{efile_no}', efile_no), {
                    theme:"colored"
                })
                setIsSubmitted(true); 
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
        <div className="container">
            <ToastContainer />
            <div className="row">
                <div className="col-md-12">
                    <div className="row mt-4">
                        <div className="col-md-12">
                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>{t('court_type')}<RequiredField /></Form.Label>
                                        <select 
                                            name="judiciary" 
                                            id="judiciary" 
                                            className="form-control" 
                                            value={petition.judiciary } 
                                            onChange={handleChange}
                                        >
                                            { judiciaries.map((j, index) => (
                                                <option key={index} value={j.id}>{language === 'ta' ? j.judiciary_lname : j.judiciary_name}</option>
                                            ))}
                                        </select>
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label htmlFor="seat">{t('hc_bench')}<RequiredField /></label>
                                        <select 
                                            name="seat" 
                                            className={`form-control ${errors.seat ? 'is-invalid' : ''} `}
                                            value={petition.seat}
                                            disabled={ parseInt(petition.judiciary) === 2 ? true : false}
                                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                                        >
                                            <option value="" disabled>{t('alerts.select_bench_type')}</option>
                                            { seats.map((s, index) => (
                                                <option key={index} value={s.seat_code}>{language === 'ta' ? s.seat_lname :s.seat_name}</option>
                                            ))}
                                        </select>
                                        <div className="invalid-feedback">
                                            { errors.seat }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            { parseInt(petition.judiciary) === 2 && (
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="state">{t('state')}<RequiredField /></label>
                                        <select 
                                            name="state" 
                                            className={`form-control ${errors.state ? 'is-invalid': null }`}
                                            value={petition.state } 
                                            onChange={(e)=>setPetition({...petition, [e.target.name]: e.target.value})}
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
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="district">{t('district')}<RequiredField /></label>
                                        <select 
                                            id="basic_district"
                                            name="district" 
                                            className={`form-control ${errors.district ? 'is-invalid' : null}`}
                                            value={petition.district }
                                            onChange={(e) => setPetition({...petition, [e.target.name]:e.target.value})}
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
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="establishment">{t('est_name')}<RequiredField /></label>
                                        <select 
                                            name="establishment" 
                                            id="establishment" 
                                            className={`form-control ${errors.establishment ? 'is-invalid' : null}`}
                                            value={petition.establishment }
                                            onChange={(e) => setPetition({...petition, [e.target.name]:e.target.value})}
                                        >
                                            <option value="">{t('alerts.select_establishment')}</option>
                                            {  establishments.filter(e=>parseInt(e.district)=== parseInt(petition.district)).map((item, index) => (
                                                    <option value={item.establishment_code} key={index}>{language === 'ta' ? item.establishment_lname : item.establishment_name}</option>
                                            ))}
                                        </select>
                                        <div className="invalid-feedback">
                                            { errors.establishment }
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="court">{t('court')}<RequiredField /></label>
                                        <select 
                                            name="court" 
                                            id="court" 
                                            className={`form-control ${errors.court ? 'is-invalid' : null }`}
                                            value={ petition.court }
                                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                                        >
                                            <option value="">{t('alerts.select_court')}</option>
                                            {   courts.filter(c=>c.establishment===petition.establishment)
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
                            </div>
                            )}
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="bail_type">{t('bail_type')}<RequiredField /></label>
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
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label htmlFor="complaint_type">{t('complaint_type')}<RequiredField /></label>
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
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">                            
                                { parseInt(petition.complaint_type) === 1 && (
                                    <div className="form-group row my-2">
                                        <label htmlFor="" className="col-sm-3">{t('crime_registered')}<RequiredField /></label>
                                        <div className="col-sm-9">
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
                                )}
                                </div>
                            </div> 
                            { parseInt(petition.complaint_type) === 1 && parseInt(petition.crime_registered) === 1 && (<FIRSearch />)}
                            { parseInt(petition.complaint_type) === 3 && <CaseSearch />}
                            { parseInt(petition.complaint_type) === 2 && (
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="">Investigation Agency Name</label>
                                            <input 
                                                type="text" 
                                                name="" 
                                                className="form-control" 
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="">Number</label>
                                            <input 
                                                type="text" 
                                                name="" 
                                                className="form-control" 
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="">Year</label>
                                            <input 
                                                type="text" 
                                                name=""
                                                className="form-control" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>                       
                        <div className="col-md-12 d-flex justify-content-center mt-2">
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleSubmit}
                            >
                                {t('submit')}
                            </Button>
                        </div>
                        {/* <StepperButton steps={bailRoutes} isCurrentStepSubmitted={isSubmitted} /> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InitialInput
