import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button'
import api from '../../../api';
import Payment from '../../pages/Payment';
import 'bs-stepper/dist/css/bs-stepper.min.css';
import Stepper from 'bs-stepper';
import ArrowForward from '@mui/icons-material/ArrowForward'
import ArrowBack  from '@mui/icons-material/ArrowBack';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import GroundsContainer from '../../grounds/GroundsContainer';
import DocumentContainer from '../../documents/DocumentContainer';
import Editor from 'react-simple-wysiwyg';
import * as Yup from 'yup'


const Extension = () => {

    const[grounds, setGrounds] = useState([])
    const[petition, setPetition] = useState({})
    const[petitioners, setPetitioners] = useState([])
    const[respondents, setRespondents] = useState([])
    const[advocates, setAdvocates]     = useState([])
    const[errors, setErrors] = useState({})

    const deleteAdvocate = (advocate) => {
        const newAdvocate = advocates.filter((adv) => { return adv.id !== advocate.id})
        setAdvocates(newAdvocate)
    }

    const deleteRespondent = (respondent) => {
        const newRespondent = respondents.filter((res) => { return res.id !== respondent.id })
        setRespondents(newRespondent)
    }


    const initialState = {
        cino: '',
        ground: ''
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


    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get(`api/bail/petition/submitted/list/`)
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
        async function fetchDetails(){
            try{
                const response = await api.get("api/bail/petition/detail/", {params: {cino:form.cino}})
                if(response.status === 200){
                    setPetition(response.data.petition)
                    setPetitioners(response.data.petitioner)
                    setRespondents(response.data.respondent)
                    setAdvocates(response.data.advocate)
                }
            }catch(error){
                console.log(error)
            }
        }
        if(form.cino!== ''){
            fetchDetails()
        }
    },[form.cino])

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await api.post("api/bail/surety/create/", form, {
                headers: {
                    'content-type': 'multipart/form-data',
                    // 'X-CSRFTOKEN': CSRF_TOKEN
                  }
            })
            if(response.status === 201){
                toast.success("Petition submitted successfully", {
                    theme:'colored'
                })
                setForm(initialState)
            }
        }catch(error){
            console.log(error)
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
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item"><a href="#">Filing</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Extension Petition</li>
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
                                                                    name="cino" 
                                                                    className="form-control"
                                                                    value={form.cino}
                                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                                >
                                                                    <option value="">Select petition</option>
                                                                    { cases.map((c, index) => (
                                                                        <option value={c.petition.cino} key={index}><>{c.petition.cino}</> - { c.petitioner.map((p, index) => (
                                                                            <>{index+1}. {p.petitioner_name}</>
                                                                            ))}&nbsp;&nbsp;Vs&nbsp;&nbsp;
                                                                            { c.respondent.map((res, index) => (
                                                                            <>{res.respondent_name} rep by {res.designation}</>
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
                                                                <table className="table table-bordered table-striped">
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
                                                                <table className="table table-bordered table-striped">
                                                                    <thead>
                                                                        <tr className="bg-secondary">
                                                                            <td colSpan={6}>Petitioner Details</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th>S.No</th>
                                                                            <th>Petitioner Name</th>
                                                                            <th>Age</th>
                                                                            <th>Relation</th>
                                                                            <th>Relation Name</th>
                                                                            <th>Select</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        { petitioners.map((petitioner, index) => (
                                                                        <tr>
                                                                            <td>{ index+1 }</td>
                                                                            <td>{ petitioner.petitioner_name }</td>
                                                                            <td>{ petitioner.age }</td>
                                                                            <td>{ petitioner.relation }</td>
                                                                            <td>{ petitioner.relation_name }</td>
                                                                            <td>
                                                                                <input type="checkbox" />
                                                                            </td>
                                                                        </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            )}
                                                            { Object.keys(respondents).length > 0 && (
                                                                <table className=" table table-bordered table-striped">
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
                                                                                <td>{respondent.respondent_name}</td>
                                                                                <td>{respondent.designation}</td>
                                                                                <td>{respondent.address}</td>
                                                                                <td>{respondent.district}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            )}
                                                            { Object.keys(advocates).length > 0 && (
                                                            <table className=" table table-bordered table-striped">
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
                                                            { Object.keys(petition).length > 0 && (
                                                                <>  
                                                                    <div className="form-group">
                                                                        <Editor 
                                                                            value={form.ground} 
                                                                            onChange={(e) => setForm({...form, description: e.target.value })} 
                                                                            style={{ minHeight:'300px'}}
                                                                        />
                                                                        <div className="invalid-feedback">
                                                                            { errors.description }
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    {/* <GroundsContainer grounds={grounds}/> */}
                                                                    <DocumentContainer />
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

export default Extension;