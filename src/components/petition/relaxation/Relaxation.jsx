import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button'
import api from '../../../api';
import Payment from '../../pages/Payment';
import 'bs-stepper/dist/css/bs-stepper.min.css';
import Stepper from 'bs-stepper';
import ArrowForward from '@mui/icons-material/ArrowForward'
import ArrowBack  from '@mui/icons-material/ArrowBack';
import { toast, ToastContainer } from 'react-toastify';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Editor  from 'react-simple-wysiwyg';
import Select from 'react-select'
import * as Yup from 'yup'


const Relaxation = () => {

    const[petition, setPetition] = useState({})
    const[petitioners, setPetitioners] = useState([])
    const[respondents, setRespondents] = useState([])
    const[advocates, setAdvocates]     = useState([])
    const[errors, setErrors] = useState({})

    const deleteAdvocate = (advocate) => {
        const newAdvocate = advocates.filter((adv) => { return adv.id !== advocate.id})
        setAdvocates(newAdvocate)
    }

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

    const[searchErrors, setSearchErrors]            = useState({})

    const stepperRef = useRef(null);

    useEffect(() => {
        stepperRef.current = new Stepper(document.querySelector('#stepper1'), {
        linear: false,
        animation: true,
        });
    }, []);

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
                const response = await api.get("case/filing/detail/", {params: {efile_no:form.efile_no}})
                if(response.status === 200){
                    setPetition(response.data.petition)
                    setPetitioners(response.data.litigant.filter(l=>l.titigant_type===1))
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
            <div className="container-fluid px-md-5">
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb" className="mt-2 mb-1">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item"><a href="#">Filing</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Condition Relaxation</li>
                            </ol>
                        </nav>
                        <div className="card">
                            <div className="card-body p-1" style={{minHeight:'500px'}}>
                                <div id="stepper1" className="bs-stepper">
                                    <div className="bs-stepper-header mb-3" style={{backgroundColor:'#ebf5fb'}}>
                                        <div className="step" data-target="#initial-input">
                                            <button className="step-trigger">
                                            <span className="bs-stepper-circle">1</span>
                                            <span className="bs-stepper-label">Petition Details</span>
                                            </button>
                                        </div>
                                        <div className="line"></div>
                                        <div className="step" data-target="#payment">
                                            <button className="step-trigger">
                                            <span className="bs-stepper-circle">2</span>
                                            <span className="bs-stepper-label">Payment</span>
                                            </button>
                                        </div>
                                        <div className="line"></div>
                                        <div className="step" data-target="#efile">
                                            <button className="step-trigger">
                                            <span className="bs-stepper-circle">3</span>
                                            <span className="bs-stepper-label">E-File</span>
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
                                                <div className="container-fluid mt-5 px-5">
                                                    <div className="row">
                                                        { form.cino !== '' && (
                                                            <>
                                                            { Object.keys(petition).length > 0 && (
                                                                <table className="table table-bordered table-striped table-sm">
                                                                    { petition && (
                                                                    <>
                                                                        <tr>
                                                                            <td colSpan={4} className="bg-secondary"><strong>Basic Details</strong></td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>Court Type</td>
                                                                            <td>{ petition.court_type.court_type }</td>
                                                                            <td>Bench Type</td>
                                                                            <td>{ petition.bench_type ? petition.bench_type.bench_type : '-'}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>State</td>
                                                                            <td>{ petition.state.state_name }</td>
                                                                            <td>District</td>
                                                                            <td>{ petition.district.district_name }</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>Establishment</td>
                                                                            <td>{ petition.establishment.establishment_name }</td>
                                                                            <td>Court</td>
                                                                            <td>{ petition.court.court_name }</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>Case Type</td>
                                                                            <td>{ petition.case_type.type_name }</td>
                                                                            <td>Bail Type</td>
                                                                            <td>{ petition.bail_type.type_name }</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>Crime Registered</td>
                                                                            <td>{ petition.crime_registered === 1 ? 'Yes' : 'No' }</td>
                                                                            <td>Compliant Type</td>
                                                                            <td>{ petition.complaint_type.type_name }</td>
                                                                        </tr>
                                                                    </>
                                                                    )}
                                                                </table>
                                                            )}
                                                            { Object.keys(petitioners).length > 0 && (
                                                                <table className="table table-bordered table-striped table-sm">
                                                                    <thead>
                                                                        <tr className="bg-secondary">
                                                                            <td colSpan={6}>Petitioner Details</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th>S.No</th>
                                                                            <th>Petitioner Name</th>
                                                                            <th>Age</th>
                                                                            <th>Rank</th>
                                                                            <th>Relation</th>
                                                                            <th>Relation Name</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        { petitioners.map((petitioner, index) => (
                                                                        <tr>
                                                                            <td>{ index+1 }</td>
                                                                            <td>{ petitioner.petitioner_name }</td>
                                                                            <td>{ petitioner.age }</td>
                                                                            <td>{ petitioner.rank }</td>
                                                                            <td>{ petitioner.relation }</td>
                                                                            <td>{ petitioner.relation_name }</td>
                                                                        </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            )}
                                                            { Object.keys(respondents).length > 0 && (
                                                                <table className=" table table-bordered table-striped table-sm">
                                                                    <thead>
                                                                        <tr className="bg-secondary">
                                                                            <td colSpan={6}><strong>Respondent Details</strong></td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th>S.No.</th>
                                                                            <th>Respondent Name</th>
                                                                            <th>Designation</th>
                                                                            <th>Police Station</th>
                                                                            <th>District</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        { respondents.map((respondent, index) => (
                                                                            <tr>
                                                                                <td>{index+1}</td>
                                                                                <td>{respondent.litigant_name}</td>
                                                                                <td>{respondent.designation}</td>
                                                                                <td>{respondent.address}</td>
                                                                                <td>{respondent.district}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            )}
                                                            { Object.keys(advocates).length > 0 && (
                                                            <table className=" table table-bordered table-striped table-sm">
                                                                <thead>
                                                                    <tr className="bg-secondary">
                                                                        <td colSpan={6}><strong>Advocate Details</strong>
                                                                            <div className="float-right">
                                                                                <button className="btn btn-success btn-sm"><i className="fa fa-plus mr-2"></i>Add New</button>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>S.No.</th>
                                                                        <th>Advocate Name</th>
                                                                        <th>Enrolment Number</th>
                                                                        <th>Mobile Number</th>
                                                                        <th>Email Address</th>
                                                                        <th width={120}>Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    { advocates.map((advocate, index) => (
                                                                        <tr>
                                                                            <td>{index+1}</td>
                                                                            <td>{advocate.advocate_name}</td>
                                                                            <td>{advocate.enrolment_number}</td>
                                                                            <td>{advocate.advocate_mobile}</td>
                                                                            <td>{advocate.advocate_email}</td>
                                                                            <td>
                                                                                <i 
                                                                                    className="fa fa-pencil-alt text-primary"
                                                                                    
                                                                                ></i>
                                                                                <i 
                                                                                    className="fa fa-trash-alt text-danger ml-3"
                                                                                    onClick={() => deleteAdvocate(advocate)}
                                                                                ></i>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                            )}
                                                            {/* <>
                                                                <Select
                                                                    isMulti={true}
                                                                    name="district"
                                                                    options={petitionerOptions}
                                                                    className={`${errors.district ? 'is-invalid' : null}`}
                                                                    onChange={(e) => {}}
                                                                ></Select>
                                                            </> */}
                                                            { Object.keys(petition).length > 0 && (
                                                                <>  
                                                                    <div className="form-group">
                                                                        <label htmlFor="">Grounds</label>
                                                                        <Editor 
                                                                            value={form.ground} 
                                                                            onChange={(e) => setForm({...form, ground: e.target.value })} 
                                                                        />
                                                                        <div className="invalid-feedback">
                                                                            { errors.ground }
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        { parseInt(searchPetition) === 1 && (
                                                                        <div className="col-md-12 mt-4"> 
                                                                            <div className="form-group">
                                                                            <label htmlFor="vakkalat">Upload Vakkalat / Memo of Appearance</label>
                                                                            <input 
                                                                                type="file" 
                                                                                name="vakalath"
                                                                                className="form-control"
                                                                                // value={petition.vakalath}
                                                                                onChange={(e) => setForm({[e.target.name]:e.target.files[0]})}
                                                                            />
                                                                            </div>
                                                                        </div>
                                                                        )}
                                                                        <div className="col-md-12 mt-4"> 
                                                                            <div className="form-group">
                                                                            <label htmlFor="document">Supporting Documents</label>
                                                                            <input 
                                                                                type="file" 
                                                                                name="supporting_document" 
                                                                                className="form-control"
                                                                                // value={petition.supporting_document}
                                                                                onChange={(e) => setForm({[e.target.name]:e.target.files[0]})}
                                                                            />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-4">
                                                                            <div className="form-group">
                                                                                <label htmlFor="">Enrolment Number</label>
                                                                                <div className="row">
                                                                                    <div className="col-md-4">
                                                                                        <input 
                                                                                            type="text" 
                                                                                            className="form-control" 
                                                                                            placeholder='MS'
                                                                                        />
                                                                                    </div>
                                                                                    <div className="col-md-4">
                                                                                        <input 
                                                                                            type="text" 
                                                                                            className="form-control" 
                                                                                            placeholder='Reg. No.'
                                                                                        />
                                                                                    </div>
                                                                                    <div className="col-md-4">
                                                                                        <input 
                                                                                            type="text" 
                                                                                            className="form-control" 
                                                                                            placeholder='Reg. Year'
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    <div className="col-md-2 mt-4 pt-2">
                                                                        <Button 
                                                                            variant="contained"
                                                                            color="primary"
                                                                            onClick={sendMobileOTP}
                                                                            endIcon={<SendIcon />}
                                                                        >Sworn Affidavit</Button>
                                                                    </div>
                            
                                                                    {/* { !mobileVerified && (
                                                                        <div className="col-sm-2">
                                                                        <Button 
                                                                            variant="contained"
                                                                            color="primary" 
                                                                            onClick={sendMobileOTP}
                                                                        >
                                                                            Send OTP</Button>
                                                                    </div>
                                                                    )} */}
                                                                    { mobileOtp && !mobileVerified && (
                                                                    <>
                                                                        <div className="col-md-1 mt-3 pt-2">
                                                                            <input 
                                                                                type="password" 
                                                                                className="form-control mt-2" 
                                                                                placeholder="OTP" 
                                                                                value={otp}
                                                                                onChange={(e) => setOtp(e.target.value)}
                                                                            />
                                                                        </div>
                                                                        <div className="col-md-2 mt-3 pt-2">
                                                                            <button 
                                                                                type="button" 
                                                                                className="btn btn-success px-5 mt-2"
                                                                                onClick={() => verifyMobile(otp)}
                                                                            >Verify</button>
                                                                        </div>
                                                                    </>
                                                                    )}
                                                                        { mobileVerified && (
                                                                            <p className="mt-4 pt-3">
                                                                                <CheckCircleRoundedIcon color="success"/>
                                                                                <span className="text-success ml-1"><strong>Verified</strong></span>
                                                                            </p>
                                                                        )}
                                                                        <div className="col-md-12">
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
                                        <div id="payment" className="content">
                                            <Payment />
                                            <div className="d-flex justify-content-between mt-5">
                                                <Button
                                                    variant='contained'
                                                    color='info'
                                                    onClick={() => stepperRef.current.previous()}
                                                    startIcon={<ArrowBack />}
                                                >Previous</Button>
                                                <Button
                                                    variant="contained"
                                                    color="info"
                                                    onClick={() => stepperRef.current.next()}
                                                    endIcon={<ArrowForward />}
                                                >Next</Button>
                                            </div>
                                        </div>
                                        <div id="efile" className="content text-center">
                                            <Button
                                                variant='contained'
                                                color='success'
                                                className="mt-4"
                                            >Final Submit</Button>
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

export default Relaxation;