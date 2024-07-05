import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button'
import SearchBail from './IntervenePetition/SearchBail';
import TextField from '@mui/material/TextField';
import api from '../api';
import Payment from './pages/Payment';
import 'bs-stepper/dist/css/bs-stepper.min.css';
import Stepper from 'bs-stepper';
import ArrowForward from '@mui/icons-material/ArrowForward'
import ArrowBack  from '@mui/icons-material/ArrowBack';
import { toast, ToastContainer } from 'react-toastify';

const Surety = () => {

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
        business_taluk: '',
        business_district: '',
        business_state: '',
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

    const [form, setForm] = useState(initialState);
    const[cases, setCases] = useState([])
    const[searchForm, setSerachForm] = useState({
        cino: null,
        case_type:null,
        crime_number: null,
        crime_year: null
    })
    const[searchSubmitted, setSearchSubmitted] = useState(false)
    const[searchErrors, setSearchErrors] = useState({})

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

    const handleChange = (e) => {
            const {name, value} = e.target
            setForm({...form, [name]:value})
    }

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

    const handleSearch = async(e) => {
        e.preventDefault()
        setSearchSubmitted(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await api.post("api/bail/surety/create/", form)
            if(response.status === 201){
                toast.success("Petition submitted successfully", {
                    theme:'colored'
                })
            }
        }catch(error){
            console.log(error)
        }
    }

    return(
        <>
            <ToastContainer />
            <div className="container px-md-5">
                <div className="row">
                    <div className="col-md-12">
                    <nav aria-label="breadcrumb" className="mt-2 mb-1">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="#">Home</a></li>
                        <li className="breadcrumb-item"><a href="#">Filing</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Surety Petition</li>
                    </ol>
                    </nav>
                    <div className="card">
                        <div className="card-body p-1" style={{minHeight:'500px'}}>
                            <div id="stepper1" className="bs-stepper">
                                <div className="bs-stepper-header mb-3" style={{backgroundColor:'#ebf5fb'}}>
                                    <div className="step" data-target="#initial-input">
                                        <button className="step-trigger">
                                        <span className="bs-stepper-circle">1</span>
                                        <span className="bs-stepper-label">Surety Details</span>
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
                                        <form action="" className="mb-5">
                                            <div className="row">
                                                <div className="col-md-8 offset-2">
                                                    <div className="form-group row">
                                                        <label htmlFor="" className="col-md-2 float-right">Select case</label>
                                                        <div className="col-sm-10">
                                                            <select 
                                                                name="cino" 
                                                                className="form-control"
                                                                value={searchForm.cino}
                                                                onChange={(e) => setSerachForm({...searchForm, [e.target.name]: e.target.value})}
                                                            >
                                                                <option value="">Select cases</option>
                                                                { cases.map((c, index) => (
                                                                <option value={c.petition.cino}>{c.petition.cino}- { c.petitioner.map((p, index) => (
                                                                    <span className="text ml-2">{index+1}. {p.petitioner_name}</span>
                                                                ))}
                                                                <span className="text text-danger text-center mx-3"><strong>Vs</strong></span>
                                                                { c.respondent.map((res, index) => (
                                                                    <span className="text">{res.respondent_name} rep by {res.designation}</span>
                                                                ))} </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12 d-flex justify-content-center">
                                                        <span className="text-danger"><strong>OR</strong></span>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label htmlFor="case_type">Case Type</label>
                                                                <select 
                                                                    name="case_type" 
                                                                    className={`form-control ${searchErrors.case_type ? 'is-invalid' : ''}`} 
                                                                    value={form.case_type}
                                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value })}
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
                                                                    value={form.case_number}
                                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value })}
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
                                                                    value={form.case_year}
                                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value })}
                                                                />
                                                                <div className="invalid-feedback">
                                                                    { searchErrors.case_year }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-12 d-flex justify-content-center">
                                                            <Button
                                                                variant='contained'
                                                                type="submit"
                                                                color="success"
                                                                onClick={handleSearch}
                                                            >Search</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        { searchSubmitted && (
                                                                                <form onSubmit={handleSubmit}>
                                                                                <div className="row">
                                                                                    <div className="col-md-4">
                                                                                        <div className="form-group">
                                                                                            <label>Name of Surety</label>
                                                                                            <input 
                                                                                                type="text" 
                                                                                                name="surety_name" 
                                                                                                value={form.surety_name} 
                                                                                                onChange={handleChange}
                                                                                                className="form-control"
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-2">
                                                                                        <div className="form-group">
                                                                                            <label htmlFor="">Relation</label>
                                                                                            <select 
                                                                                                name="relation" 
                                                                                                className="form-control"
                                                                                                value={form.relation}
                                                                                                onChange={handleChange}
                                                                                            >
                                                                                                <option value="">Select relation</option>
                                                                                            </select>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-3">
                                                                                        <div className="form-group">
                                                                                            <label>Relative Name of Surety</label>
                                                                                            <input 
                                                                                                type="text" 
                                                                                                name="relative_name" 
                                                                                                value={form.relative_name} 
                                                                                                onChange={handleChange}
                                                                                                className="form-control" 
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-3">
                                                                                        <div className="form-group">
                                                                                            <label>Aadhar Number</label>
                                                                                            <input 
                                                                                                type="text" 
                                                                                                name="aadhar_number" 
                                                                                                value={form.aadhar_number} 
                                                                                                onChange={handleChange} 
                                                                                                className="form-control"
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-4">
                                                                                        <div className="form-group">
                                                                                            <label>Address</label>
                                                                                            <input 
                                                                                                type="text" 
                                                                                                name="address" 
                                                                                                value={form.address} 
                                                                                                onChange={handleChange} 
                                                                                                className="form-control"
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-2">
                                                                                        <div className="form-group">
                                                                                            <label htmlFor="">State</label>
                                                                                            <select 
                                                                                                name="state" 
                                                                                                className="form-control"
                                                                                                value={form.state}
                                                                                                onChange={handleChange}
                                                                                            >
                                                                                                <option value="">Select state</option>
                                                                                                <option value="33">Tamil Nadu</option>
                                                                                                <option value="34">Pudhucherry</option>
                                                                                            </select>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-3">
                                                                                        <div className="form-group">
                                                                                            <label htmlFor="">District</label>
                                                                                            <select 
                                                                                                name="district"
                                                                                                className="form-control"
                                                                                                value={form.district}
                                                                                                onChange={handleChange}
                                                                                            >
                                                                                                <option value="">Select district</option>
                                                                                            </select>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-3">
                                                                                        <div className="form-group">
                                                                                            <label htmlFor="">Taluk</label>
                                                                                            <select 
                                                                                                name="taluk"
                                                                                                className="form-control"
                                                                                                value={form.taluk}
                                                                                                onChange={handleChange}
                                                                                            >
                                                                                                <option value="">Select taluk</option>
                                                                                            </select>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-2">
                                                                                        <div className="form-group">
                                                                                            <label htmlFor="">Pincode</label>
                                                                                            <input 
                                                                                                type="text"
                                                                                                name="pincode"
                                                                                                className="form-control"
                                                                                                value={form.pincode}
                                                                                                onChange={handleChange}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-2">
                                                                                        <div className="form-group">
                                                                                            <label htmlFor="">Phone Number</label>
                                                                                            <input 
                                                                                                type="text"
                                                                                                name="phone_number"
                                                                                                className="form-control"
                                                                                                value={form.phone_number}
                                                                                                onChange={handleChange}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-3">
                                                                                        <div className="form-group">
                                                                                            <label htmlFor="">E-Mail Address</label>
                                                                                            <input 
                                                                                                type="text"
                                                                                                name="email_address"
                                                                                                className="form-control"
                                                                                                value={form.email_address}
                                                                                                onChange={handleChange}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-2">
                                                                                        <div className="form-group">
                                                                                            <label htmlFor="">Residing Since (Years)</label>
                                                                                            <input 
                                                                                                type="text"
                                                                                                name="residing_years"
                                                                                                className="form-control"
                                                                                                value={form.residing_years}
                                                                                                onChange={handleChange}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-3">
                                                                                        <div className="form-group">
                                                                                            <label>Property Type</label>
                                                                                            <select 
                                                                                                name="property_type" 
                                                                                                value={form.property_type} 
                                                                                                onChange={handleChange}
                                                                                                className="form-control"
                                                                                            >
                                                                                                <option value="">Select type</option>
                                                                                                <option value="1">Own</option>
                                                                                                <option value="2">Rental</option>
                                                                                            </select>
                                                                                        </div>
                                                                                    </div>
                                                                                    { parseInt(form.property_type) === 1 && (
                                                                                    <>
                                                                                    <div className="col-md-2">
                                                                                        <div className="form-group">
                                                                                            <label htmlFor="">Survey Number</label>
                                                                                            <input 
                                                                                                type="text"
                                                                                                name="survey_number"
                                                                                                value={form.survey_number}
                                                                                                onChange={handleChange} 
                                                                                                className="form-control" 
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-3">
                                                                                        <div className="form-group">
                                                                                            <label htmlFor="">Location</label>
                                                                                            <input 
                                                                                                type="text"
                                                                                                name="site_location"
                                                                                                value={form.site_location}
                                                                                                onChange={handleChange}  
                                                                                                className="form-control"
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-2">
                                                                                        <div className="form-group">
                                                                                            <label htmlFor="">Area in cent(s)</label>
                                                                                            <input 
                                                                                                type="text"
                                                                                                name="site_area"
                                                                                                value={form.site_area}
                                                                                                onChange={handleChange}
                                                                                                className="form-control"  
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-2">
                                                                                        <div className="form-group">
                                                                                            <label htmlFor="">Valuation</label>
                                                                                            <input 
                                                                                                type="text"
                                                                                                name="site_valuation"
                                                                                                value={form.site_valuation}
                                                                                                onChange={handleChange}
                                                                                                className="form-control"  
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    </>   
                                                                                    )}
                                                                                    { parseInt(form.property_type) === 2 && (
                                                                                    <div className="col-md-3">
                                                                                        <div className="form-group">
                                                                                            <label>Rent Bill in the name of Surety</label><br />
                                                                                            <div>
                                                                                                <div className="icheck-success d-inline mx-2">
                                                                                                <input 
                                                                                                    type="radio" 
                                                                                                    name="rent_bill_surety_name" 
                                                                                                    id="isRelatedYes" 
                                                                                                    value={form.rent_bill_surety_name}
                                                                                                    checked={ form.rent_bill_surety_name }
                                                                                                    onChange={(e) => setForm({...form, rent_bill_surety_name: true})} 
                                                                                                />
                                                                                                <label htmlFor="isRelatedYes">Yes</label>
                                                                                                </div>
                                                                                                <div className="icheck-danger d-inline mx-2">
                                                                                                <input 
                                                                                                    type="radio" 
                                                                                                    id="custodyNo" 
                                                                                                    name="rent_bill_surety_name" 
                                                                                                    value={form.rent_bill_surety_name}
                                                                                                    checked={ !form.rent_bill_surety_name } 
                                                                                                    onChange={(e) => setForm({...form, rent_bill_surety_name: false})}
                                                                                                />
                                                                                                <label htmlFor="custodyNo">No</label>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    )}
                                                                                
                                                                                    <div className="col-md-6">
                                                                                        <div className="form-group">
                                                                                            <label htmlFor="">{parseInt(form.property_type) === 1 ? 'Upload patta/chitta' : 'Upload rental agreement/receipt'}</label>
                                                                                            <input 
                                                                                                type="file" 
                                                                                                className="form-control" 
                                                                                                name="property_document"
                                                                                                value={form.property_document}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                
                                                                                    <div className="col-md-3">
                                                                                        <div className="form-group">
                                                                                            <label>Type of Employment</label>
                                                                                            <select 
                                                                                                name="employment_type" 
                                                                                                value={ form.employment_type } 
                                                                                                onChange={handleChange}
                                                                                                className="form-control"
                                                                                            >
                                                                                                <option value="">Select type</option>
                                                                                                <option value="1">Employed</option>
                                                                                                <option value="2">Business</option>
                                                                                                <option value="3">Unemployed</option>
                                                                                            </select>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                { parseInt(form.employment_type) === 1 && (
                                                                                <div className="card">
                                                                                    <div className="card-body">
                                                                                        <div className="row">
                                                                                            <div className="col-md-3">
                                                                                                <div className="form-group">
                                                                                                    <label>Employer Name</label>
                                                                                                    <input type="text" 
                                                                                                        name="employer_name" 
                                                                                                        value={form.employer_name} 
                                                                                                        onChange={handleChange} 
                                                                                                        className="form-control"
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-md-3">
                                                                                                <div className="form-group">
                                                                                                    <label>Designation</label>
                                                                                                    <input type="text" 
                                                                                                        name="designation" 
                                                                                                        value={form.designation} 
                                                                                                        onChange={handleChange} 
                                                                                                        className="form-control"
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-md-4">
                                                                                                <div className="form-group">
                                                                                                    <label>Employer Address</label>
                                                                                                    <input type="text" 
                                                                                                        name="employer_address" 
                                                                                                        value={form.employer_address} 
                                                                                                        onChange={handleChange} 
                                                                                                        className="form-control"
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-md-2">
                                                                                                <div className="form-group">
                                                                                                    <label htmlFor="">State</label>
                                                                                                    <select 
                                                                                                        name="employer_state" 
                                                                                                        className="form-control"
                                                                                                        value={form.employer_state}
                                                                                                        onChange={handleChange}
                                                                                                    >
                                                                                                        <option value="">Select state</option>
                                                                                                        <option value="33">Tamil Nadu</option>
                                                                                                        <option value="34">Pudhucherry</option>
                                                                                                    </select>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-md-3">
                                                                                                <div className="form-group">
                                                                                                    <label htmlFor="">District</label>
                                                                                                    <select 
                                                                                                        name="employer_district"
                                                                                                        className="form-control"
                                                                                                        value={form.employer_district}
                                                                                                        onChange={handleChange}
                                                                                                    >
                                                                                                        <option value="">Select district</option>
                                                                                                    </select>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-md-3">
                                                                                                <div className="form-group">
                                                                                                    <label htmlFor="">Taluk</label>
                                                                                                    <select 
                                                                                                        name="employer_taluk"
                                                                                                        className="form-control"
                                                                                                        value={form.employer_taluk}
                                                                                                        onChange={handleChange}
                                                                                                    >
                                                                                                        <option value="">Select taluk</option>
                                                                                                    </select>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-md-3">
                                                                                                <div className="form-group">
                                                                                                    <label>Length of Service with Employer</label>
                                                                                                    <input 
                                                                                                        type="text" 
                                                                                                        name="service_length" 
                                                                                                        value={form.service_length} 
                                                                                                        onChange={handleChange} 
                                                                                                        className="form-control"
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-md-3">
                                                                                                <div className="form-group">
                                                                                                    <label>Amount of Provident Fund</label>
                                                                                                    <input 
                                                                                                        type="text" 
                                                                                                        name="pf_amount" 
                                                                                                        value={form.pf_amount} 
                                                                                                        onChange={handleChange}
                                                                                                        className="form-control" 
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-md-3">
                                                                                                <div className="form-group">
                                                                                                    <label>House Property Details</label>
                                                                                                    <textarea 
                                                                                                        name="property_details" 
                                                                                                        value={form.property_details} 
                                                                                                        onChange={handleChange} 
                                                                                                        className='form-control'
                                                                                                        rows={1}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-md-3">
                                                                                                <div className="form-group">
                                                                                                    <label>Income Tax Paid (Last 3 Years)</label>
                                                                                                    <input 
                                                                                                        type="text"
                                                                                                        name="income_tax_paid" 
                                                                                                        value={form.income_tax_paid} 
                                                                                                        onChange={handleChange} 
                                                                                                        className="form-control"
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="row">
                                                                                            <div className="col-md-6">
                                                                                                <label htmlFor="">Upload Document</label>
                                                                                                <input 
                                                                                                    type="file" 
                                                                                                    className="form-control" 
                                                                                                    name="employment_document"
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                )}
                                                                                { parseInt(form.employment_type) === 2 && (
                                                                                <div className="card">
                                                                                    <div className="card-body">
                                                                                        <div className="row">
                                                                                            <div className="col-md-3">
                                                                                                <div className="form-group">
                                                                                                    <label>Business Address</label>
                                                                                                    <input 
                                                                                                        type="text" 
                                                                                                        name="business_address" 
                                                                                                        value={form.business_address} 
                                                                                                        onChange={handleChange} 
                                                                                                        className='form-control'
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-md-3">
                                                                                                <div className="form-group">
                                                                                                    <label htmlFor="">State</label>
                                                                                                    <select 
                                                                                                        name="business_state" 
                                                                                                        className="form-control"
                                                                                                        value={form.business_state}
                                                                                                        onChange={handleChange}
                                                                                                    >
                                                                                                        <option value="">Select state</option>
                                                                                                        <option value="33">Tamil Nadu</option>
                                                                                                        <option value="34">Pudhucherry</option>
                                                                                                    </select>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-md-3">
                                                                                                <div className="form-group">
                                                                                                    <label htmlFor="">District</label>
                                                                                                    <select 
                                                                                                        name="business_district"
                                                                                                        className="form-control"
                                                                                                        value={form.business_district}
                                                                                                        onChange={handleChange}
                                                                                                    >
                                                                                                        <option value="">Select district</option>
                                                                                                    </select>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-md-3">
                                                                                                <div className="form-group">
                                                                                                    <label htmlFor="">Taluk</label>
                                                                                                    <select 
                                                                                                        name="business_taluk"
                                                                                                        className="form-control"
                                                                                                        value={form.business_taluk}
                                                                                                        onChange={handleChange}
                                                                                                    >
                                                                                                        <option value="">Select taluk</option>
                                                                                                    </select>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-md-3">
                                                                                                <div className="form-group">
                                                                                                    <label>Nature and Extent of Business</label>
                                                                                                    <input 
                                                                                                        type="text" 
                                                                                                        name="business_nature" 
                                                                                                        value={form.business_nature} 
                                                                                                        onChange={handleChange} 
                                                                                                        className="form-control"
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-md-3">
                                                                                                <div className="form-group">
                                                                                                    <label>Rent Paid for Place of Business</label>
                                                                                                    <input 
                                                                                                        type="text" 
                                                                                                        name="business_rent_paid" 
                                                                                                        value={form.business_rent_paid} 
                                                                                                        onChange={handleChange} 
                                                                                                        className="form-control"
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-md-5">
                                                                                                <div className="form-group">
                                                                                                    <label>Rent Bill of Place of Business in name of Surety</label>
                                                                                                    <div>
                                                                                                        <div className="icheck-success d-inline mx-2">
                                                                                                        <input 
                                                                                                            type="radio" 
                                                                                                            name="is_rent_bill_name" 
                                                                                                            id="isRentBillYes" 
                                                                                                            value={ form.is_rent_bill_name }
                                                                                                            checked={ form.is_rent_bill_name }
                                                                                                            onChange={(e) => setForm({...form, is_rent_bill_name: true})} 
                                                                                                        />
                                                                                                        <label htmlFor="isRentBillYes">Yes</label>
                                                                                                        </div>
                                                                                                        <div className="icheck-danger d-inline mx-2">
                                                                                                        <input 
                                                                                                            type="radio" 
                                                                                                            id="isRentBillNo" 
                                                                                                            name="is_rent_bill_name" 
                                                                                                            value={form.is_rent_bill_name}
                                                                                                            checked={ !form.is_rent_bill_name } 
                                                                                                            onChange={(e) => setForm({...form, is_rent_bill_name: false})}
                                                                                                        />
                                                                                                        <label htmlFor="isRentBillNo">No</label>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="row">
                                                                                            <div className="col-md-6">
                                                                                                <label htmlFor="">Upload Document</label>
                                                                                                <input 
                                                                                                    type="file" 
                                                                                                    className="form-control" 
                                                                                                    name="business_document"
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                )}
                                                                                <div className="card">
                                                                                    <div className="card-body">
                                                                                        <div className="row">
                                                                                            <div className="col-md-12">
                                                                                                <label>Bank Accounts</label>
                                                                                                <div className="row">
                                                                                                    <div className="col-md-3">
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            name="bank_name"
                                                                                                            placeholder="Bank Name"
                                                                                                            value={form.bank_name}
                                                                                                            onChange={(e) => handleBankAccountChange(e)}
                                                                                                            className="form-control"
                                                                                                        />
                                                                                                    </div> 
                                                                                                    <div className="col-md-3">
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            name="branch_name"
                                                                                                            placeholder="Branch Name"
                                                                                                            value={form.branch_name}
                                                                                                            onChange={(e) => handleBankAccountChange(e)}
                                                                                                            className="form-control"
                                                                                                        />
                                                                                                    </div>
                                                                                                    <div className="col-md-2">
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            name="account_number"
                                                                                                            placeholder="Account Number"
                                                                                                            value={form.account_number}
                                                                                                            onChange={(e) => handleBankAccountChange(e)}
                                                                                                            className="form-control"
                                                                                                        />
                                                                                                    </div> 
                                                                                                    <div className="col-md-2">
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            name="amount"
                                                                                                            placeholder="Amount"
                                                                                                            value={form.amount}
                                                                                                            onChange={(e) => handleBankAccountChange(e)}
                                                                                                            className="form-control"
                                                                                                        />
                                                                                                    </div> 
                                                                                                </div>
                                                                                                <div className="row mt-3">
                                                                                                    <div className="col-md-2">
                                                                                                        <Button
                                                                                                            variant='contained'
                                                                                                            color='primary'
                                                                                                        >Add</Button>
                                                                                                        <Button
                                                                                                            variant='contained'
                                                                                                            color='error'
                                                                                                            className="ml-1"
                                                                                                        >Delete</Button>
                                                                                                    </div>  
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="card">
                                                                                    <div className="card-body">
                                                                                        <div className="row">
                                                                                            <div className="col-md-3">
                                                                                                <div className="form-group">
                                                                                                    <label>Known Accused Duration</label>
                                                                                                    <div className="input-group">
                                                                                                        <div className="input-group-prepend">
                                                                                                            <input
                                                                                                                type="text"
                                                                                                                name="accused_duration"
                                                                                                                placeholder="Years"
                                                                                                                value={form.accused_duration_year}
                                                                                                                onChange={handleChange}
                                                                                                                className="form-control"
                                                                                                            />
                                                                                                        </div>
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            name="months"
                                                                                                            placeholder="Months"
                                                                                                            value={form.accused_duration_month}
                                                                                                            onChange={handleChange}
                                                                                                            className="form-control"
                                                                                                        />
                                                                                                    </div>  
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-md-3">
                                                                                                <div className="form-group">
                                                                                                    <label>Related to Accused</label>
                                                                                                    <div>
                                                                                                        <div className="icheck-success d-inline mx-2">
                                                                                                        <input 
                                                                                                            type="radio" 
                                                                                                            name="is_related" 
                                                                                                            id="isRelatedYes" 
                                                                                                            value={form.is_related}
                                                                                                            checked={ form.is_related }
                                                                                                            onChange={(e) => setForm({...form, is_related: true})} 
                                                                                                        />
                                                                                                        <label htmlFor="isRelatedYes">Yes</label>
                                                                                                        </div>
                                                                                                        <div className="icheck-danger d-inline mx-2">
                                                                                                        <input 
                                                                                                            type="radio" 
                                                                                                            id="isRelatedNo" 
                                                                                                            name="is_related" 
                                                                                                            value={form.is_related}
                                                                                                            checked={ !form.is_related } 
                                                                                                            onChange={(e) => setForm({...form, is_related: false})}
                                                                                                        />
                                                                                                        <label htmlFor="isRelatedNo">No</label>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-md-3">
                                                                                                <div className="form-group">
                                                                                                    <label>Relation Details</label>
                                                                                                    <input 
                                                                                                        type="text" 
                                                                                                        name="relation_details" 
                                                                                                        value={form.relation_details} 
                                                                                                        onChange={handleChange} 
                                                                                                        className="form-control"
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-md-6">
                                                                                                <div className="form-group">
                                                                                                    <label>Surety for Others</label>
                                                                                                    <textarea 
                                                                                                        name="others_surety" 
                                                                                                        value={form.others_surety} 
                                                                                                        onChange={handleChange} 
                                                                                                        className="form-control"
                                                                                                        rows={1}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-md-6">
                                                                                                <div className="form-group">
                                                                                                    <label>Litigation Details</label>
                                                                                                    <textarea 
                                                                                                        name="litigation_details" 
                                                                                                        value={form.litigation_details} 
                                                                                                        onChange={handleChange} 
                                                                                                        className="form-control"
                                                                                                        rows={1}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-md-6">
                                                                                                <div className="form-group">
                                                                                                    <label>Other Particulars</label>
                                                                                                    <textarea 
                                                                                                        name="other_particulars" 
                                                                                                        value={form.other_particulars} 
                                                                                                        onChange={handleChange} 
                                                                                                        className="form-control"
                                                                                                        rows={1}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-md-2">
                                                                                                <div className="form-group">
                                                                                                    <label>Surety Amount</label>
                                                                                                    <input 
                                                                                                        type="text" 
                                                                                                        name="surety_amount" 
                                                                                                        value={form.surety_amount} 
                                                                                                        onChange={handleChange} 
                                                                                                        className="form-control"
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="row">
                                                                                            <div className="col-md-6">
                                                                                                <div className="form-group">
                                                                                                    <label>Upload Photo</label>
                                                                                                    <input 
                                                                                                        type="file" 
                                                                                                        name="photo"
                                                                                                        className="form-control"
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="row">
                                                                                            <div className="col-md-6">
                                                                                                <div className="form-group">
                                                                                                    <label>Upload Signature</label>
                                                                                                    <input 
                                                                                                        type="file" 
                                                                                                        name="signature"
                                                                                                        className="form-control"
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="row">
                                                                                            <div className="col-md-6">
                                                                                                <div className="form-group">
                                                                                                    <label>Upload Identity Proof</label>
                                                                                                    <input 
                                                                                                        type="file" 
                                                                                                        name="identity_proof"
                                                                                                        className="form-control"
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="row">
                                                                                            <div className="col-md-12 d-flex justify-content-center">
                                                                                                <Button
                                                                                                    variant="contained"
                                                                                                    color="success"
                                                                                                    type='submit'
                                                                                                >Save</Button>
                                                                                                <Button
                                                                                                    variant="contained"
                                                                                                    color="warning"
                                                                                                    className="ml-2"
                                                                                                >Reset</Button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="d-flex justify-content-end">
                                                                                <Button
                                                                                    variant='contained'
                                                                                    color='info'
                                                                                    onClick={() => stepperRef.current.next()}
                                                                                    endIcon={<ArrowForward />}
                                                                                >Next</Button>
                                                                                </div>
                                                                            </form>
                                        )}
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

        </>
    )
}

export default Surety;