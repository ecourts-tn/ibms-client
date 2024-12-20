import React, { useState, useEffect, useRef } from 'react';
import 'bs-stepper/dist/css/bs-stepper.min.css';
import api from 'api';
import Button from '@mui/material/Button'
import { toast, ToastContainer } from 'react-toastify';
import Editor  from 'react-simple-wysiwyg';
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next';
import Document from './Document';


const Pleadings = () => {

    const[petition, setPetition] = useState({})
    const[petitioners, setPetitioners] = useState([])
    const[respondents, setRespondents] = useState([])
    const[advocates, setAdvocates]     = useState([])
    const[errors, setErrors] = useState({})
    const {t} = useTranslation()

    const initialState = {
        efile_no: '',
        case_no: '',
        court_type: '',
        bench_type:'',
        state: '',
        district:'',
        establishment: '',
        court:'',
        case_type: '',
        bail_type: '',
        complaint_type:'',
        crime_registered: '',
        crime_state: null,
        crime_district: null,
        police_station:null,
        crime_number: null,
        crime_year: null,
        case_state: null,
        case_district: null,
        case_establishment: null,
        case_court: null,
        case_case_type:  null,
        case_number: null,
        case_year: null,
        cnr_number: null,
        date_of_occurrence:'',
        fir_date_time:'',
        place_of_occurrence:'',
        investigation_officer:'',
        complaintant_name:'',
        gist_of_fir:'',
        gist_in_local:'',
        grounds:'',
        is_details_correct: true,
        remarks:'',
        is_previous_pending: false,
        advocate_name:'',
        enrolment_number: null,
        advocate_mobile: '',
        advocate_email:'',
        prev_case_number: '',
        prev_case_year: '',
        prev_case_status:'',
        prev_disposal_date:'',
        prev_proceedings:'',
        prev_is_correct:false,
        prev_remarks:'',
        prev_is_pending:false,
        vakalath: '',
        supporting_document:''
        
    }

    const[form, setForm] = useState(initialState);
    const[cases, setCases] = useState([])
    const[searchPetition, setSearchPetition] = useState(1)
    const[searchForm, setSearchForm] = useState({
        case_type:null,
        case_number: undefined,
        case_year: undefined
    })
    const searchSchema = Yup.object({
        case_type: Yup.string().required("Please select the case type"),
        case_number: Yup.number().required("Please enter case number"),
        case_year: Yup.number().required("Please enter the case year")
    })

    const[searchErrors, setSearchErrors] = useState({})

    // const stepperRef = useRef(null);

    // useEffect(() => {
    //     stepperRef.current = new Stepper(document.querySelector('#stepper1'), {
    //     linear: false,
    //     animation: true,
    //     });
    // }, []);

    const[otp, setOtp] = useState('')

    const[mobileOtp, setMobileOtp] = useState(false)
    const[mobileVerified, setMobileVerified] = useState(false)

    const sendMobileOTP = () => {
        // if(otp === ''){
        //     toast.error("Please enter valid mobile number",{
        //         theme:"colored"
        //     })
        // }else{
            // setMobileLoading(true)
        if(mobileOtp){
            toast.success("OTP already verified successfully.", {
                theme: "colored"
            })
            return
        }
            toast.success("OTP has been sent your mobile number",{
                theme:"colored"
            })
            setMobileOtp(true)
        // }
    }

    const verifyMobile = (otp) => {
        if(parseInt(otp) === 123456){
            toast.success("Mobile otp verified successfully",{
                theme:"colored"
            })
            setMobileVerified(true)
        }else{
            toast.error("Invalid OTP. Please enter valid OTP",{
                theme:"colored"
            })
            setMobileVerified(false)
            setMobileOtp(true)
        }
    }


    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get(`case/filing/submitted/`)
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
                const response = await api.get("case/filing/detail/", {params: {efile_no:form.efile_no}})
                if(response.status === 200){
                    console.log(response.data)
                    setPetition(response.data.petition)
                    setPetitioners(response.data.litigant.filter(l=>l.litigant_type===1))
                    setRespondents(response.data.litigant.filter(l=>l.litigant_type===2))
                    setAdvocates(response.data.advocate)
                }
            }catch(error){
                console.log(error)
            }
        }
        if(form.efile_no !== ''){
            fetchDetails()
        }
    },[form.efile_no])


    const handleSearch = async(e) => {
        e.preventDefault()
        try{
            // await searchSchema.validate(searchForm, { abortEarly:false})
            const response = await api.get("api/bail/petition/detail/", { params: searchForm})
            if(response.status === 200){
                setPetition(response.data.petition)
                setPetitioners(response.data.petitioner)
                setRespondents(response.data.respondent)
                setAdvocates(response.data.advocate)
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

    const petitionerOptions = petitioners.map((petitioner, index) => {
        return {
            value : petitioner.petitioner_id,
            label : petitioner.petitioner_name
        }
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        
    }

    return(
        <>
            <ToastContainer />
            <div className="container px-md-5" style={{minHeight:"500px"}}>
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb" className="mt-2 mb-1">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="#">{t('home')}</a></li>
                                <li className="breadcrumb-item"><a href="#">{t('filing')}</a></li>
                                <li className="breadcrumb-item active" aria-current="page">{t('pleadings')}</li>
                            </ol>
                        </nav>
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
                                        <label htmlFor="searchPetitionYes">Select from My Petitions</label>
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
                                        <label htmlFor="searchPetitionNo">Search Petition</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-8 offset-2">
                                { parseInt(searchPetition) === 1 && (
                                    <div className="form-group row">
                                        <div className="col-sm-12">
                                            <select 
                                                name="efile_no" 
                                                className="form-control"
                                                value={form.efile_no}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            >
                                                <option value="">Select petition</option>
                                                { cases.map((c, index) => (
                                                    <option value={c.petition.efile_number} key={index}><>{c.petition.efile_number}</> - { c.litigants.filter(l=>l.litigant_type===1).map((p, index) => (
                                                        <>{index+1}. {p.litigant_name}</>
                                                        ))}&nbsp;&nbsp;Vs&nbsp;&nbsp;
                                                        { c.litigants.filter(l=>l.litigant_type===2).map((res, index) => (
                                                        <>{res.litigant_name} {res.designation?.designation_name}</>
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
                                <form onSubmit={handleSearch}>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="case_type">Case Type</label>
                                                <select 
                                                    name="case_type" 
                                                    className={`form-control ${searchErrors.case_type ? 'is-invalid' : ''}`} 
                                                    value={searchForm.case_type}
                                                    onChange={(e) => setSearchForm({...searchForm, [e.target.name]: e.target.value })}
                                                >
                                                    <option value="">Select Case Type</option>
                                                    <option value="1">Bail Petition</option>
                                                </select>
                                                <div className="invalid-feedback">
                                                    { searchErrors.case_type }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="case_number">Case Number</label>
                                                <input 
                                                    type="text" 
                                                    className={`form-control ${searchErrors.case_number ? 'is-invalid' : ''}`} 
                                                    name="case_number"
                                                    value={searchForm.case_number}
                                                    onChange={(e) => setSearchForm({...searchForm, [e.target.name]: e.target.value })}
                                                />
                                                <div className="invalid-feedback">
                                                    { searchErrors.case_number }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="case_year">Year</label>
                                                <input 
                                                    type="text" 
                                                    className={`form-control ${searchErrors.case_year ? 'is-invalid' : ''}`}
                                                    name="case_year"
                                                    value={searchForm.case_year}
                                                    onChange={(e) => setSearchForm({...searchForm, [e.target.name]: e.target.value })}
                                                />
                                                <div className="invalid-feedback">
                                                    { searchErrors.case_year }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12 d-flex justify-content-center">
                                            { parseInt(searchPetition) === 2 && (
                                            <Button
                                                variant='contained'
                                                type="submit"
                                                color="success"
                                                onClick={handleSearch}
                                            >Search</Button>
                                            )}
                                        </div>
                                    </div>
                                </form>
                                )}
                            </div>
                            <div className="container-fluid mt-2">
                                { form.cino !== '' && (
                                    <>
                                    { Object.keys(petition).length > 0 && (
                                        <>  
                                            <div className="row">
                                                <div className="col-md-8 offset-md-2">
                                                    <p>Next Hearing : 19-09-2024</p>
                                                    <p>Purpose: </p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-8 offset-md-2">
                                                    <div className="card">
                                                        <div className="card-header bg-navy">
                                                            <strong>Pleading / Written Arguments</strong>
                                                        </div>
                                                        <div className="card-body p-1">
                                                            <Editor 
                                                                value={form.ground} 
                                                                onChange={(e) => setForm({...form, ground: e.target.value })} 
                                                            />
                                                            <div className="invalid-feedback">
                                                                { errors.ground }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-8 offset-md-2">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            {/* <Document /> */}
                                                        </div>
                                                        <div className="col-md-5"> 
                                                            <div className="form-group">
                                                                <label htmlFor="vakkalat">Document Name</label>
                                                                <input type="text" className="form-control" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label htmlFor="">Document</label>
                                                            <input type="file" className="form-control" />
                                                        </div>
                                                        <div className="col-md-3 pt-4 mt-2">
                                                            <Button
                                                                variant='contained'
                                                                color="primary"
                                                            >Add Document</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12 mb-3">
                                                    <div className="d-flex justify-content-center">
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            onClick={handleSubmit}
                                                        >
                                                            Submit
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Pleadings;