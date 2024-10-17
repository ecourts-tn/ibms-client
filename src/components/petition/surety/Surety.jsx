import React, { useState, useEffect, useRef, useContext } from 'react';
import Button from '@mui/material/Button'
import api from 'api';
import Payment from 'components/pages/Payment';
import 'bs-stepper/dist/css/bs-stepper.min.css';
import Stepper from 'bs-stepper';
import ArrowForward from '@mui/icons-material/ArrowForward'
import ArrowBack  from '@mui/icons-material/ArrowBack';
import { toast, ToastContainer } from 'react-toastify';
import * as Yup from 'yup'
import { RequiredField } from 'utils';
import SearchIcon from '@mui/icons-material/Search'
import { StateContext } from 'contexts/StateContext';
import { DistrictContext } from 'contexts/DistrictContext';
import { TalukContext } from 'contexts/TalukContext';
import { BenchTypeContext } from 'contexts/BenchTypeContext';
import { EstablishmentContext } from 'contexts/EstablishmentContext';
import InitialInput from 'components/petition/InitialInput';
import SuretyForm from './SuretyForm';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useTranslation } from 'react-i18next';


const Surety = () => {
    const {states} = useContext(StateContext)
    const {districts} = useContext(DistrictContext)
    const {taluks}  = useContext(TalukContext)
    const {benchtypes} = useContext(BenchTypeContext)
    const {establishments} = useContext(EstablishmentContext)
    const[searchForm, setSearchForm] = useState({
        court_type:1,
        bench_type:'',
        state:'',
        district:'',
        establishment:'',
        case_type: '',
        reg_number: '',
        reg_year: ''
    })
    const initialState = {
        cino: '',
        surety_name: '',
        relation: '',
        relative_name:'',
        aadhar_number: '',
        address: '',
        state: '',
        district: '',
        taluk: '',
        pincode: '',
        phone_number: '',
        email_address: '',
        residing_years: '',
        property_type: '',
        survey_number: '',
        site_location:'',
        site_area:'',
        site_valuation:'',
        rent_bill_surety_name: false,
        property_document:'',
        employment_type: '',
        business_address: '',
        business_state: '',
        business_district: '',
        business_taluk: '',
        business_nature: '',
        business_rent_paid: '',
        is_rent_bill_name: false,
        business_document:'',
        employer_name: '',
        designation: '',
        employer_address: '',
        employer_state: '',
        employer_district: '',
        employer_taluk: '',
        service_length: '',
        pf_amount: '',
        property_details: '',
        income_tax_paid: '',
        employment_document: '',
        bank_accounts: [],
        accused_duration_year: '',
        accused_duration_month: '',
        is_related: false,
        relation_details: '',
        others_surety:'',
        litigation_details: '',
        other_particulars: '',
        surety_amount: '',
        photo: '',
        signature:'',
        identity_proof:''
    }
    const {t} = useTranslation()
    const[form, setForm] = useState(initialState);
    const[errors, setErrors] = useState({})
    const[bail, setBail] = useState({})
    const[cases, setCases] = useState([])
    const[searchPetition, setSearchPetition] = useState(1)
    const[eFileNumber, seteFileNumber] = useState('')
    const[isPetition, setIsPetition] = useState(false)
    const[petition, setPetition] = useState({
        court_type: '',
        bench_type: '',
        state: '',
        district:'',
        establishment: '',
        court: '',
        case_type: 6,
        bail_type: '',
        complaint_type: 2,
        crime_registered: 2,
    })
    const validationSchema = Yup.object({
        case_type: Yup.string().required("Please select the case type"),
        case_number: Yup.number().required("Please enter case number"),
        case_year: Yup.number().required("Please enter the case year")
    })

    const[searchErrors, setSearchErrors]            = useState({})
    const [user, setUser] = useLocalStorage("user", null)

    const stepperRef = useRef(null);

    useEffect(() => {
        stepperRef.current = new Stepper(document.querySelector('#stepper1'), {
        linear: false,
        animation: true,
        });
    }, []);

    const addBankAccount = () => {}

    const handleBankAccountChange = () =>{}

    const removeBankAccount = () => {}

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get(`case/filing/submitted-list/`)
                if(response.status === 200){
                    setCases(response.data)
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchData();
    },[])

    useEffect(() => {
        const fetchDetails = async() => {
            try{
                const response = await api.get("case/filing/detail/", {params: {efile_no:eFileNumber}})
                if(response.status === 200){
                    const {petition:pet} = response.data
                    setIsPetition(true)
                    setBail(pet)
                    setPetition({...petition,
                        court_type: pet.court_type.id,
                        bench_type: pet.bench_type ? pet.bench_type.bench_code : null,
                        state: pet.state ? pet.state.state_code : null,
                        district:pet.district ? pet.district.district_code : null,
                        establishment: pet.establishment ? pet.establishment.establishment_code : null,
                        court: pet.court ? pet.court.court_code : null,
                        case_type: 6,
                        reg_type: pet.reg_type.id,
                        reg_number: pet.reg_number,
                        reg_year: pet.reg_year,
                        registration_date: pet.registration_date
                    })
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchDetails();
    },[eFileNumber])


    const handleSearch = async(e) => {
        e.preventDefault()
        try{
            // await searchSchema.validate(searchForm, { abortEarly:false})
            const response = await api.get("bail/petition/detail/", { params: searchForm})
            if(response.status === 200){
                setForm({...form, cino:response.data.petition.cino})
            }
            if(response.status === 404){
                toast.error("Petition details not found",{
                    theme:"colored"
                })
            }
        }catch(error){
            const newError = {}
            if(error.inner){
                error.inner.forEach((err) => {
                    newError[err.path] = err.message
                });
                setSearchErrors(newError)
            }
            if(error){
                toast.error(error.response.message,{
                    theme:"colored"
                })
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            // await validationSchema.validate(petition, { abortEarly:false})
            const response = await api.post("case/filing/surety/create/", petition)
            if(response.status === 201){
                sessionStorage.setItem("efile_no", response.data.efile_number)
                toast.success(`${response.data.efile_number} details submitted successfully`, {
                    theme:"colored"
                }) 
            }
            console.log(response.data)
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

    return(
        <>
            <ToastContainer />
            <div className="container-fluid px-md-5">
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb" className="mt-2 mb-1">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="#">{t('home')}</a></li>
                                <li className="breadcrumb-item"><a href="#">{t('filing')}</a></li>
                                <li className="breadcrumb-item active" aria-current="page">{t('surety')}</li>
                            </ol>
                        </nav>
                        <div className="card">
                            <div className="card-body p-1" style={{minHeight:'500px'}}>
                                <div id="stepper1" className="bs-stepper">
                                    <div className="bs-stepper-header mb-3" style={{backgroundColor:'#ebf5fb'}}>
                                        <div className="step" data-target="#initial-input">
                                            <button className="step-trigger">
                                            <span className="bs-stepper-circle">1</span>
                                            <span className="bs-stepper-label">{t('basic_details')}</span>
                                            </button>
                                        </div>
                                        <div className="line"></div>
                                        <div className="step" data-target="#surety-details">
                                            <button className="step-trigger">
                                            <span className="bs-stepper-circle">2</span>
                                            <span className="bs-stepper-label">{t('surety_details')}</span>
                                            </button>
                                        </div>
                                        <div className="line"></div>
                                        <div className="step" data-target="#payment">
                                            <button className="step-trigger">
                                            <span className="bs-stepper-circle">3</span>
                                            <span className="bs-stepper-label">{t('payment_details')}</span>
                                            </button>
                                        </div>
                                        <div className="line"></div>
                                        <div className="step" data-target="#efile">
                                            <button className="step-trigger">
                                            <span className="bs-stepper-circle">4</span>
                                            <span className="bs-stepper-label">{t('efile')}</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bs-stepper-content">
                                        <div id="initial-input" className="content">
                                            <div className="row">
                                                <div className="col-md-12 text-center">
                                                    <div className="form-group">
                                                        <div>
                                                            <div className="icheck-primary d-inline mx-2">
                                                            <input 
                                                                type="radio" 
                                                                name="search_petition" 
                                                                id="searchPetitionYes" 
                                                                value={searchPetition}
                                                                checked={ parseInt(searchPetition) === 1 ? true : false}
                                                                onChange={(e) => setSearchPetition(1)} 
                                                            />
                                                            <label htmlFor="searchPetitionYes">{t('select_petition')}</label>
                                                            </div>
                                                            <div className="icheck-primary d-inline mx-2">
                                                            <input 
                                                                type="radio" 
                                                                id="searchPetitionNo" 
                                                                name="search_petition" 
                                                                value={searchPetition}
                                                                checked={ parseInt(searchPetition) === 2 ? true : false } 
                                                                onChange={(e) => setSearchPetition(2)}
                                                            />
                                                            <label htmlFor="searchPetitionNo">{t('search_petition')}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 offset-3">
                                                    { parseInt(searchPetition) === 1 && (
                                                        <div className="form-group row">
                                                            <div className="col-sm-12">
                                                                <select 
                                                                    name="eFileNumber" 
                                                                    className="form-control"
                                                                    value={eFileNumber}
                                                                    onChange={(e) => seteFileNumber(e.target.value)}
                                                                >
                                                                    <option value="">Select petition</option>
                                                                    { cases.map((c, index) => (
                                                                        <option value={c.petition.efile_number} key={index}><>{c.petition.efile_number}</> - { c.litigant.filter(l=>l.litigant_type===1).map((p, index) => (
                                                                            <>{index+1}. {p.litigant_name}</>
                                                                            ))}&nbsp;&nbsp;Vs&nbsp;&nbsp;
                                                                            { c.litigant.filter(l=>l.litigant_type===2).map((res, index) => (
                                                                            <>{res.litigant_name} {res.designation}</>
                                                                            ))} 
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-md-8 offset-2">
                                                { parseInt(searchPetition) === 2 && (
                                                    <form>
                                                        <div className="row">
                                                            <div className="col-md-12 d-flex justify-content-center">
                                                                <div className="form-group">
                                                                    <div className="icheck-success d-inline mx-2">
                                                                        <input 
                                                                            type="radio" 
                                                                            name="court_type" 
                                                                            id="court_type_hc" 
                                                                            value={ searchForm.court_type }
                                                                            checked={parseInt(searchForm.court_type) === 1 ? true : false }
                                                                            onChange={(e) => setSearchForm({...searchForm, [e.target.name]: 1, state:'', district:'', establishment:''})} 
                                                                        />
                                                                        <label htmlFor="court_type_hc">{t('high_court')}</label>
                                                                    </div>
                                                                    <div className="icheck-success d-inline mx-2">
                                                                        <input 
                                                                            type="radio" 
                                                                            id="court_type_dc" 
                                                                            name="court_type" 
                                                                            value={searchForm.court_type}
                                                                            checked={parseInt(searchForm.court_type) === 2 ? true : false } 
                                                                            onChange={(e) => setSearchForm({...searchForm, [e.target.name]: 2, bench_type:''})}
                                                                        />
                                                                        <label htmlFor="court_type_dc">{t('district_court')}</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 offset-md-3">
                                                                { parseInt(searchForm.court_type) === 2 && (
                                                                    <div className="row">
                                                                        <div className="col-md-6">
                                                                            <div className="form-group">
                                                                                <label htmlFor="">{t('state')}</label>
                                                                                <select 
                                                                                    name="state" 
                                                                                    className={`form-control ${errors.state ? 'is-invalid': ''}`}
                                                                                    onChange={(e) => setSearchForm({...searchForm, [e.target.name]: e.target.value})}
                                                                                >
                                                                                    <option value="">Select state</option>
                                                                                    { states.map((state, index) => (
                                                                                    <option value={state.state_code} key={index}>{state.state_name}</option>
                                                                                    ))}
                                                                                </select>
                                                                                <div className="invalid-feedback">
                                                                                    { searchErrors.state }
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <div className="form-group">
                                                                                <label htmlFor="">{t('district')}</label>
                                                                                <select 
                                                                                    name="district" 
                                                                                    className={`form-control ${errors.district ? 'is-invalid': ''}`}
                                                                                    onChange={(e) => setSearchForm({...searchForm, [e.target.name]: e.target.value})}
                                                                                >
                                                                                    <option value="">Select district</option>
                                                                                    { districts.filter(district => parseInt(district.state) === parseInt(searchForm.state)).map((district, index) => (
                                                                                        <option value={district.district_code} key={index}>{district.district_name}</option>
                                                                                    ))}
                                                                                </select>
                                                                                <div className="invalid-feedback">
                                                                                    { searchErrors.district }
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div className="row">
                                                                    { parseInt(searchForm.court_type) === 2 && (
                                                                    <div className="col-md-8">
                                                                        <div className="form-group">
                                                                            <label htmlFor="">{t('est_name')}</label>
                                                                            <select 
                                                                                name="establishment" 
                                                                                className={`form-control ${errors.establishment ? 'is-invalid': ''}`}
                                                                                onChange={(e) => setSearchForm({...searchForm, [e.target.name]: e.target.value})}
                                                                            >
                                                                                <option value="">Select establishment</option>
                                                                                {establishments.filter(est=>parseInt(est.district) === parseInt(searchForm.district)).map((estd, index)=>(
                                                                                    <option key={index} value={estd.establishment_code}>{estd.establishment_name}</option>
                                                                                ))}
                                                                            </select>
                                                                            <div className="invalid-feedback">
                                                                                { searchErrors.establishment }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    )}
                                                                    { parseInt(searchForm.court_type) === 1 && (
                                                                    <div className="col-md-8">
                                                                        <div className="form-group">
                                                                            <label htmlFor="">{t('hc_bench')}</label>
                                                                            <select 
                                                                                name="bench_type" 
                                                                                className={`form-control ${searchErrors.bench_type ? 'is-invalid': ''}`}
                                                                                onChange={(e) => setSearchForm({...searchForm, [e.target.name]: e.target.value})}
                                                                            >
                                                                                <option value="">Select bench</option>
                                                                                {benchtypes.map((b, index)=>(
                                                                                    <option key={index} value={b.bench_code}>{b.bench_type}</option>
                                                                                ))}
                                                                            </select>
                                                                            <div className="invalid-feedback">
                                                                                { searchErrors.bench_type }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    )}
                                                                    <div className="col-md-4">
                                                                        <label htmlFor="case_type">{t('case_type')}</label>
                                                                        <select 
                                                                            name="case_type" 
                                                                            id="case_type" 
                                                                            className={`form-control ${searchErrors.case_type ? 'is-invalid' : null}`}
                                                                            onChange={(e)=> setSearchForm({...searchForm, [e.target.name]: e.target.value})}
                                                                        >
                                                                            <option value="">Select case type</option>
                                                                            <option value="1">Bail Application</option>
                                                                        </select>
                                                                        <div className="invalid-feedback">
                                                                            { searchErrors.case_type }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-md-10 offset-md-1">
                                                                        <div className="row">
                                                                            <div className="col-md-5">
                                                                                <div className="form-group">
                                                                                    <input 
                                                                                        type="text" 
                                                                                        className={`form-control ${searchErrors.reg_number ? 'is-invalid': ''}`}
                                                                                        name="reg_number"
                                                                                        value={searchForm.reg_number}
                                                                                        onChange={(e)=> setSearchForm({...searchForm, [e.target.name]: e.target.value })}
                                                                                        placeholder={t('case_number')}
                                                                                    />
                                                                                    <div className="invalid-feedback">
                                                                                        { searchErrors.reg_number }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-4">
                                                                                <div className="form-group">
                                                                                    <input 
                                                                                        type="text" 
                                                                                        className={`form-control ${searchErrors.reg_year ? 'is-invalid': ''}`}
                                                                                        name="reg_year"
                                                                                        value={searchForm.reg_year}
                                                                                        onChange={(e)=> setSearchForm({...searchForm, [e.target.name]: e.target.value })}
                                                                                        placeholder={t('case_year')}
                                                                                    />
                                                                                    <div className="invalid-feedback">
                                                                                        { searchErrors.reg_year }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-3">
                                                                                <Button 
                                                                                    variant='contained'
                                                                                    color="primary"
                                                                                    endIcon={<SearchIcon />}
                                                                                    onClick={handleSearch}
                                                                                >
                                                                                    {t('search')}
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                    )}
                                                </div>
                                                <div className="col-md-8 offset-md-2">
                                                { isPetition && (
                                                    <>
                                                        <InitialInput petition={bail} />
                                                        <div className="d-flex justify-content-center">
                                                            <Button
                                                                variant='contained'
                                                                color="success"
                                                                onClick={handleSubmit}
                                                            >
                                                                Submit
                                                            </Button>
                                                        </div>
                                                    </>
                                                )}
                                                </div>
                                            </div>
                                        </div>
                                        <div id="surety-details" className="content">
                                            <div className="container-fluid mt-5 px-5">
                                                <div className="row">                                    
                                                    <SuretyForm />
                                                </div>
                                            </div>
                                        </div>
                                        <div id="payment" className="content">
                                            <Payment />
                                            <div className="d-flex justify-content-between mt-5">
                                                <Button
                                                    variant='contained'
                                                    color='info'
                                                    onClick={() => stepperRef.current.previous()}
                                                    startIcon={<ArrowBack />}
                                                >{t('previous')}</Button>
                                                <Button
                                                    variant="contained"
                                                    color="info"
                                                    onClick={() => stepperRef.current.next()}
                                                    endIcon={<ArrowForward />}
                                                >{t('next')}</Button>
                                            </div>
                                        </div>
                                        <div id="efile" className="content text-center">
                                            <Button
                                                variant='contained'
                                                color='success'
                                                className="mt-4"
                                            >{t('final_submit')}</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Surety;