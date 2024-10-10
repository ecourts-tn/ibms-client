import React, { useEffect, useState, useContext } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import Form from 'react-bootstrap/Form'
import Button from '@mui/material/Button'
import { toast, ToastContainer } from 'react-toastify';
import * as Yup from 'yup'
import api from 'api';
import Select from 'react-select'
import { useLocalStorage } from "hooks/useLocalStorage";
import { RequiredField } from 'utils';
import FIRSearch from 'components/search/FIRSearch';
import CaseSearch from 'components/search/CaseSearch';
import { BaseContext } from 'contexts/BaseContext';
import { useLocation } from 'react-router-dom';
import { DistrictContext } from 'contexts/DistrictContext';
import { StateContext } from 'contexts/StateContext';
import { EstablishmentContext } from 'contexts/EstablishmentContext';
import { CourtContext } from 'contexts/CourtContext';
import { CourtTypeContext } from 'contexts/CourtTypeContext';
import { BenchTypeContext } from 'contexts/BenchTypeContext';
import { BailTypeContext } from 'contexts/BailTypeContext';
import { ComplaintTypeContext } from 'contexts/ComplaintTypeContext';
import { useTranslation } from 'react-i18next';


const InitialInput = () => {

    const location = useLocation();
    const currentPath = location.pathname;
    const {efile_no, setEfileNo, fir} = useContext(BaseContext)
    const {states}          = useContext(StateContext)
    const {districts}       = useContext(DistrictContext)
    const {establishments}  = useContext(EstablishmentContext)
    const {courts}          = useContext(CourtContext)
    const {courttypes}      = useContext(CourtTypeContext)
    const {benchtypes}      = useContext(BenchTypeContext)
    const {bailtypes}       = useContext(BailTypeContext)
    const {complainttypes}  = useContext(ComplaintTypeContext)
    const { t } = useTranslation()

    const initialState = {
        court_type: 1,
        bench_type: '',
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
    
    useEffect(() => {
        const fetchData = async() => {
            try{
                const efile_no = "ATN20240000001F2024000001" //sessionStorage.getItem("efile_no")
                const response = await api.get(`case/filing/detail/`, {params:{efile_no}})
                if(response.status === 200){
                    setPetition({...petition, bench_type: response.data.petition.bench_type})
                    
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchData()
    },[])
    const[errors, setErrors] = useState({})
    const [user, setUser] = useLocalStorage("user", null)

    useEffect(() => {
        if(currentPath == "petition/anticipatory/bail"){
            console.log("true")
            setPetition({...petition, bail_type:2})
        }
    }, [])


    let validationSchema = Yup.object({
        court_type: Yup.string().required("Please select court type"),
        // bench_type: Yup.string().when("court_type",(court_type, schema) => {
        //     if(parseInt(court_type) === 1){
        //         return schema.required("Please select the bench type")
        //     }
        // }),
        state: Yup.string().when("court_type", (court_type, schema) => {
            if(parseInt(court_type) === 2){
                return schema.required("Please select the state")
            }
        }),
        district: Yup.string().when("court_type", (court_type, schema) => {
            if(parseInt(court_type) === 2){
                return schema.required("Please select the district")
            }
        }),
        establishment: Yup.string().when("court_type", (court_type, schema) => {
            if(parseInt(court_type) === 2){
                return schema.required("Please select the establishment")
            }
        }),
        court: Yup.string().when("court_type", (court_type, schema) => {
            if(parseInt(court_type) === 2){
                return schema.required("Please select the court")
            }
        }),
        bail_type: Yup.string().required("Please select the bail type"),
        complaint_type: Yup.string().required("Please select the complaint type"),
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            await validationSchema.validate(petition, { abortEarly:false})
            // setPetition({...petition, adv_code:user.user.userlogin})
            const response = await api.post("case/filing/create/", petition)
            if(response.status === 201){
                sessionStorage.setItem("efile_no", response.data.efile_number)
                toast.success(`${response.data.efile_number} details submitted successfully`, {
                    theme:"colored"
                })
                const efile_no = sessionStorage.getItem("efile_no")
                if(efile_no){
                    if(Object.keys(fir).length > 0){
                        const response2 = await api.post(`case/crime/details/create/`, fir, {params:{efile_no}})
                        if(response2.status === 201){
                            console.log(response2.message)
                        }
                    }
                    if(parseInt(user.user.user_type) === 1){
                        const advocate = {
                            advocate_name: user.user.username,
                            advocate_email: user.user.email,
                            advocate_mobile: user.user.mobile,
                            enrolment_number: user.user.bar_code.concat("/",user.user.reg_number, "/", user.user.reg_year),
                            is_primary: true
                        }
                        const response3 = await api.post(`advocate/create/`, advocate, {params: {efile_no}})
                        if(response3.status === 200){
                            console.log(response3.message)
                        }
                    }        
                }
               
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
        <>
            <ToastContainer />
            {/* <Steps /> */}
            <div className="row">
                <div className="col-md-12">
                    <div className="row mt-4">
                        <div className="col-md-8 offset-md-2">
                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>{t('court_type')}<RequiredField /></Form.Label>
                                        <select 
                                            name="court_type" 
                                            id="court_type" 
                                            className="form-control" 
                                            value={petition.court_type} 
                                            onChange={(e) => setPetition({...petition, [e.target.name]:e.target.value})}
                                        >
                                            { courttypes.map((type, index) => (
                                                <option key={index} value={type.id}>{type.court_type}</option>
                                            ))}
                                        </select>
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label htmlFor="bench_type">{t('hc_bench')}<RequiredField /></label>
                                        <select 
                                            name="bench_type" 
                                            className={`form-control ${errors.bench_type ? 'is-invalid' : ''} `}
                                            value={petition.bench_type}
                                            disabled={ parseInt(petition.court_type) === 2 ? true : false}
                                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                                        >
                                            <option value="">Select bench</option>
                                            { benchtypes.map((bench, index) => (
                                                <option key={index} value={bench.bench_code}>{ bench.bench_type}</option>
                                            ))}
                                        </select>
                                        <div className="invalid-feedback">
                                            { errors.bench_type }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            { petition.court_type == 2 && (
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="state">{t('state')}<RequiredField /></label>
                                        <select 
                                            name="state" 
                                            className={`form-control ${errors.state ? 'is-invalid': null }`}
                                            value={petition.state} onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}>
                                            <option value="">Select state</option>
                                            { states.map( (item, index) => (
                                                <option key={index} value={item.state_code}>{item.state_name}</option>)
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
                                        {/* <select 
                                            id="basic_district"
                                            name="district" 
                                            className={`form-control ${errors.district ? 'is-invalid' : null}`}
                                            value={petition.district}
                                            onChange={(e) => setPetition({...petition, [e.target.name]:e.target.value})}
                                        >
                                            <option value="">Select district</option>
                                            { districts.map( (item, index) => (
                                                <option key={index} value={item.district_code}>{item.district_name}</option>)
                                            )}
                                        </select> */}
                                        <Select 
                                            name="district"
                                            options={districts.filter(district=>parseInt(district.state)===parseInt(petition.state)).map((district) => { return { value:district.district_code, label:district.district_name}})} 
                                            className={`${errors.district ? 'is-invalid' : null}`}
                                            onChange={(e) => setPetition({...petition, district:e.value})}
                                        />
                                        <div className="invalid-feedback">
                                            { errors.district }
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="establishment">{t('est_name')}<RequiredField /></label>
                                        <Select 
                                            name="establishment"
                                            options={establishments.filter(e=>parseInt(e.district)=== parseInt(petition.district)).map((est) => { return { value:est.establishment_code, label:est.establishment_name}})} 
                                            className={`${errors.establishment ? 'is-invalid' : null}`}
                                            onChange={(e) => setPetition({...petition, establishment:e.value})}
                                        />
                                        {/* <select 
                                            name="establishment" 
                                            id="establishment" 
                                            className={`form-control ${errors.establishment ? 'is-invalid' : null}`}
                                            value={petition.establishment}
                                            onChange={(e) => setPetition({...petition, [e.target.name]:e.target.value})}
                                        >
                                            <option value="">Select Establishment</option>
                                            {
                                                establishments.filter((establishment) => {
                                                    return establishment.bail_filing && establishment.display
                                                })
                                                .map((item, index) => (
                                                    <option value={item.establishment_code} key={index}>{item.establishment_name}</option>
                                                ))
                                            }
                                        </select> */}
                                        <div className="invalid-feedback">
                                            { errors.establishment }
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="court">{t('court')}<RequiredField /></label>
                                        <Select 
                                            name="court"
                                            options={courts.filter(c=>c.establishment===petition.establishment).map((est) => { return { value:est.court_code, label:est.court_name}})} 
                                            className={`${errors.court ? 'is-invalid' : null}`}
                                            onChange={(e) => setPetition({...petition, court:e.value})}
                                        />
                                        {/* <select 
                                            name="court" 
                                            id="court" 
                                            className={`form-control ${errors.court ? 'is-invalid' : null }`}
                                            value={petition.court}
                                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                                        >
                                            <option value="">Select court</option>
                                            {   courts.filter((court) => {
                                                    return court.bail_filing && court.display
                                                })
                                                .map((item, index) => (
                                                    <option key={index} value={item.court_code}>{ item.court_name}</option>
                                                ))
                                            }
                                        </select> */}
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
                                            value={petition.bail_type}
                                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}
                                        >
                                            <option value="">Select type</option>
                                            { bailtypes.map((item, index) => (
                                            <option key={index} value={item.id}>{ item.type_name }</option>
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
                                            value={petition.complaint_type}
                                            onChange={(e) => setPetition({...petition, [e.target.name]: e.target.value})}           
                                        >
                                            <option value="">Select type</option>
                                            { complainttypes.map((item, index) => (
                                                <option key={index} value={item.id}>{ item.type_name }</option>
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
                                                <input type="radio" id="radioPrimary1" name="crime_registered" onClick={(e) => setPetition({...petition, [e.target.name]:1})} />
                                                <label htmlFor="radioPrimary1">{t('yes')}</label>
                                            </div>
                                            <div className="icheck-danger d-inline mx-2">
                                                <input type="radio" id="radioPrimary2" name="crime_registered" onClick={(e) => setPetition({...petition, [e.target.name]:2})}/>
                                                <label htmlFor="radioPrimary2">{t('no')}</label>
                                            </div>
                                            <div className="icheck-primary d-inline mx-2">
                                                <input type="radio" id="radioPrimary3" name="crime_registered" onClick={(e) => setPetition({...petition, [e.target.name]:3})}/>
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
                    </div>
                </div>
            </div>
        </>
    )
}

export default InitialInput
