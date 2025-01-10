import React, {useState, useContext, useEffect} from 'react'
import Button from '@mui/material/Button'
import Form from 'react-bootstrap/Form'
import { toast, ToastContainer } from 'react-toastify';
import api from '../../api';
import * as Yup from 'yup'
import { nanoid } from '@reduxjs/toolkit';
import { StateContext } from 'contexts/StateContext';
import { DistrictContext } from 'contexts/DistrictContext';
import { TalukContext } from 'contexts/TalukContext';
import { RelationContext } from 'contexts/RelationContext';
import { PoliceStationContext } from 'contexts/PoliceStationContext';
import { EstablishmentContext } from 'contexts/EstablishmentContext';
import { RequiredField } from 'utils';
import Loading from 'components/common/Loading';
import { handleMobileChange, handleAadharChange, validateEmail, handleAgeChange, handleNameChange, handlePincodeChange } from 'components/commonvalidation/validations';
import { DesignationContext } from 'contexts/DesignationContext'
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';

const PetitionFiling = () => {

    const {states} = useContext(StateContext)
    const {districts} = useContext(DistrictContext)
    const {taluks}  = useContext(TalukContext)
    const {relations} = useContext(RelationContext)
    const {policeStations} = useContext(PoliceStationContext)
    const {establishments} = useContext(EstablishmentContext)
    const {designations} = useContext(DesignationContext)
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)

    const[searchForm, setSearchForm] = useState({
        search: "1",
        state:'',
        district:'',
        police_station:'',
        crime_number:'',
        crime_year:'',
        establishment:'',
        case_type:'',
        case_number:'',
        case_year:''
    })
    const[selectFiling, setSelectFiling] = useState({
        searchfiling: "9",
    })
    const[searchErrors, setSearchErrors] = useState([])
    const searchValidationSchema = Yup.object({
        search: Yup.string().required(),
        state: Yup.string().required()
    })
    const[selectedRespondent, setSelectedRespondent] = useState([])
    const[caseFound, setCaseFound] = useState(false)
    const[loading, setLoading] = useState(false)
    const[form, setForm] = useState({
        litigant_name:'',
        litigant_type:1,
        litigant_number:1,
        designation:'',
        gender:'',
        age:'',
        relation:'',
        relation_name:'',
        state:'',
        district:'',
        taluk:'',
        address:'',
        post_office:'',
        pincode:'',
        mobile_number:'',
        email_address:'',
        grounds:'',
    })

    const [petition,setPetition] = useState({
        court_code: '',
        establishment_code: '',
        efile_number: '',
        crime_registered: '',	
    })

    const validationSchema = Yup.object({
        // efile_no: Yup.string().required(),
        litigant_name: Yup.string().required(),
        designation: Yup.string().required(),
        gender: Yup.string().required(),
        age:Yup.string().required(),
        relation:Yup.string().required(),
        relation_name:Yup.string().required(),
        state:'',
        district:'',
        taluk:'',
        address:Yup.string().required(),
        // post_office:Yup.string().required(),
        // pincode:Yup.string().required(),
        mobile_number:Yup.string().required(),
        // email_address:Yup.string().required(),
        grounds: Yup.string().required()
    })
    
    const[errors, setErrors] = useState([])
    

    const[accused, setAccused] = useState([])

    const handleChange = (e) => {
        const { name, value } = e.target;
  
        // Update form state
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,  // Dynamically update the field
        }));
  
        // Validate the field and update errors
        const errorMessage = validateEmail(name, value);  // Validate the email field
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMessage,  // Set the error message for the specific field
        }));
    };

    const handleSearch = async(e) => {
        e.preventDefault()
        setLoading(true)
        try{
            const response = await api.post('police/search/crime/', searchForm)
            if(response.status === 200){
                setCaseFound(true)
                setPetition(response.data.petition)
                const accused = response.data.litigant.filter((accused) => {
                    return accused.litigant_type === 1
                })
                setAccused(accused)
                setForm({...form, efile_no:response.data.crime.petition})
            }
        }catch(error){
            if(error.response){
                switch(error.response.status){
                    case 404:
                        toast.error("Petition details not found", {theme:"colored"});
                        break;
                    case 400:
                        toast.error("Bad request. Please check your input.", { theme: "colored" });
                        break;
                    case 401:
                        toast.error("Unauthorized access. Please log in.", { theme: "colored" });
                        break;
                    case 403:
                        toast.error("You do not have permission to perform this action.", { theme: "colored" });
                        break;
                    case 500:
                        toast.error("Server error. Please try again later.", { theme: "colored" });
                        break;
                    default:
                        toast.error(`Unexpected error: ${error.response.statusText}`, { theme: "colored" });
                }
                setCaseFound(false);
            }
        }finally{
            setLoading(false)
        }
    }
    const isRespondentSelected = (respondent) => selectedRespondent.includes(respondent.litigant_id);

    const handleRespondentCheckBoxChange = (respondent) => {
        const isSelected = isRespondentSelected(respondent);
        if (isSelected) {
            // Remove from selected if already selected
            setSelectedRespondent(selectedRespondent.filter(r => r !== respondent.litigant_id));
        } else {
            // Add to selected if not already selected
            setSelectedRespondent([...selectedRespondent,respondent.litigant_id]);
        }
    };

    const handleSubmit1 = async(e) => {
        e.preventDefault()
        try{
            const post_data = {
                petitioner: form,
                accused: selectedRespondent,
                petition: petition,
              
            }
            // const merged = {...form,...grounds}
            await validationSchema.validate(form, {abortEarly:false})
            const response = await api.post("police/filing/cancellation/bail/", post_data)
            if(response.status === 201){
                toast.success("Bail cancellation petition submitted successfully", {theme:"colored"})
            }
        }catch(error){
            console.log(error.inner)
            if(error.inner){
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
            }
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const bail_type = petition.bail_type.id ? petition.bail_type.id : null;
            const seat = petition.seat ? petition.seat: null;
            const case_type = selectFiling.searchfiling === "9" ? 9 : 10;
            const post_data = {
                accused: selectedRespondent,  
                petition: {
                    bail_type: bail_type,             
                    case_type: case_type,  
                    complaint_type: petition.id,          
                    court: petition.court.court_code || null,     
                    establishment: petition.establishment.establishment_code || null,	    
                    crime_registered: petition.crime_registered, 
                    district: petition.district.district_code,    
                    judiciary: petition.judiciary.id,               
                    seat: seat,                 
                    state: petition.state.state_code,
                    main_efile_number: petition.efile_number,             
                },
                petitioner: {
                    address: form.address,
                    age: form.age,
                    designation: form.designation,
                    district: form.district,
                    email_address: form.email_address,
                    gender: form.gender,
                    litigant_name: form.litigant_name,
                    litigant_number: form.litigant_number,
                    litigant_type: form.litigant_type,
                    mobile_number: form.mobile_number,
                    pincode: form.pincode,
                    post_office: form.post_office,
                    relation: form.relation,
                    relation_name: form.relation_name,
                    state: form.state,
                    taluk: form.taluk,
                },
                grounds:{ 
                    description: form.grounds,  // If grounds are dynamic, ensure it's set correctly
                },    
            };
    
            // Validate form using Yup schema
            await validationSchema.validate(form, { abortEarly: false });
    
            // Send the request with the structured data
            const response = await api.post("police/filing/petition/", post_data);
            
            if (response.status === 201) {
                toast.success("Bail cancellation petition submitted successfully", { theme: "colored" });
            }
        } catch (error) {
            // console.log(error.inner);
            if (error.inner) {
                const newErrors = {};
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message;
                });
                setErrors(newErrors);
            }
        }
    };
    

    return (
        <>
            <ToastContainer />
            <div className="content-wrapper">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <ol className="breadcrumb mt-2">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item"><a href="#">Police</a></li>
                                <li className="breadcrumb-item"><a href="#">Bail</a></li>
                                <li className="breadcrumb-item active">Cancellation</li>
                            </ol>
                        </div>
                        <div className="col-md-12">
                            <div className="card card-outline card-primary" style={{minHeight:'700px'}}>
                                <div className="card-header">
                                    <strong>Cancellation of Bail</strong>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-10 offset-md-1">
                                            <div className="row">
                                                <div className="col-md-12 text-center">
                                                    <div className="form-group">
                                                        <div>
                                                            <div className="icheck-success d-inline mx-2">
                                                            <input 
                                                                type="radio" 
                                                                name="searchfiling" 
                                                                id="searchfilingYes" 
                                                                value="9"
                                                                checked={selectFiling.searchfiling === "9"}
                                                                onChange={(e) => setSelectFiling({...selectFiling, [e.target.name] : e.target.value})} 
                                                            />
                                                            <label htmlFor="searchfilingYes">Bail Cancellation</label>
                                                            </div>
                                                            <div className="icheck-success d-inline mx-2">
                                                            <input 
                                                                type="radio" 
                                                                id="searchfilingNo" 
                                                                name="searchfiling" 
                                                                value="10"
                                                                checked={ selectFiling.searchfiling === "10" } 
                                                                onChange={(e) => setSelectFiling({...selectFiling, [e.target.name] : e.target.value})}
                                                            />
                                                            <label htmlFor="searchfilingNo">Request Custody</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-12 text-center">
                                                    <div className="form-group">
                                                        <div>
                                                            <div className="icheck-primary d-inline mx-2">
                                                            <input 
                                                                type="radio" 
                                                                name="search" 
                                                                id="searchYes" 
                                                                value="1"
                                                                checked={searchForm.search === "1"}
                                                                onChange={(e) => setSearchForm({...searchForm, [e.target.name] : e.target.value})} 
                                                            />
                                                            <label htmlFor="searchYes">Search by Crime Number</label>
                                                            </div>
                                                            <div className="icheck-primary d-inline mx-2">
                                                            <input 
                                                                type="radio" 
                                                                id="searchNo" 
                                                                name="search" 
                                                                value="2"
                                                                checked={ searchForm.search === "2" } 
                                                                onChange={(e) => setSearchForm({...searchForm, [e.target.name] : e.target.value})}
                                                            />
                                                            <label htmlFor="searchNo">Search by Case Number</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-10 offset-1">
                                                    <form action="">
                                                        { parseInt(searchForm.search) === 1 && (
                                                        <div className="row">
                                                            <div className="col-md-3">
                                                                <label htmlFor="state">State <RequiredField /></label>
                                                                <select 
                                                                    name="state" 
                                                                    id="state" 
                                                                    className={ `form-control ${errors.state ? 'is-invalid': ''}`}
                                                                    value={searchForm.state}
                                                                    onChange={(e) => setSearchForm({...searchForm, [e.target.name]: e.target.value })}    
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
                                                            <div className="col-md-4">
                                                                <div className="form-group">
                                                                    <label htmlFor="district">District<RequiredField /></label><br />
                                                                    <select 
                                                                        name="district" 
                                                                        id="district" 
                                                                        className={`form-control ${errors.district ? 'is-invalid' : ''}`}
                                                                        value={searchForm.district} 
                                                                        onChange={(e) => setSearchForm({...searchForm, [e.target.name]: e.target.value })}
                                                                    >
                                                                        <option value="">Select district</option>
                                                                        { districts.filter(d => parseInt(d.state) === parseInt(searchForm.state)).map((item, index) => (
                                                                        <option key={index} value={item.district_code }>{ item.district_name }</option>
                                                                        ))}
                                                                    </select>
                                                                    <div className="invalid-feedback">
                                                                        { errors.district }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-5">
                                                            <div className="form-group">
                                                                <label htmlFor="police_station">Police Station Name<RequiredField /></label><br />
                                                                <select 
                                                                    name="police_station" 
                                                                    id="police_station" 
                                                                    className={`form-control ${errors.police_station ? 'is-invalid' : ''}`}
                                                                    value={searchForm.police_station}
                                                                    onChange={(e)=> setSearchForm({...searchForm, [e.target.name]: e.target.value })}
                                                                >
                                                                    <option value="">Select station</option>
                                                                    { policeStations.filter(p=>parseInt(p.revenue_district) === parseInt(searchForm.district)).map((item, index) => (
                                                                        <option key={index} value={item.cctns_code}>{ item.station_name}</option>
                                                                    ))}
                                                                </select>
                                                                <div className="invalid-feedback">{ errors.police_station }</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2 offset-md-4">
                                                                <div className="form-group">
                                                                    <label htmlFor="case_number">Crime Number<RequiredField /></label>
                                                                    <input 
                                                                        type="text" 
                                                                        className={`form-control ${searchErrors.crime_number ? 'is-invalid' : ''}`} 
                                                                        name="crime_number"
                                                                        value={searchForm.crime_number}
                                                                        onChange={(e) => setSearchForm({...searchForm, [e.target.name]: e.target.value })}
                                                                    />
                                                                    <div className="invalid-feedback">
                                                                        { searchErrors.crime_number }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="form-group">
                                                                    <label htmlFor="crime_year">Crime Year<RequiredField /></label>
                                                                    <input 
                                                                        type="text" 
                                                                        className={`form-control ${searchErrors.crime_year ? 'is-invalid' : ''}`}
                                                                        name="crime_year"
                                                                        value={searchForm.crime_year}
                                                                        onChange={(e) => setSearchForm({...searchForm, [e.target.name]: e.target.value })}
                                                                    />
                                                                    <div className="invalid-feedback">
                                                                        { searchErrors.crime_year }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        )}
                                                        { parseInt(searchForm.search) === 2 && (
                                                        <div className="row">
                                                            <div className="col-md-3">
                                                                <label htmlFor="state">State<RequiredField /></label>
                                                                <select 
                                                                    name="state" 
                                                                    id="state" 
                                                                    className={ `form-control ${errors.state ? 'is-invalid': ''}`}
                                                                    value={searchForm.state}
                                                                    onChange={(e) => setSearchForm({...searchForm, [e.target.name]: e.target.value })}    
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
                                                            <div className="col-md-4">
                                                                <div className="form-group">
                                                                    <label htmlFor="district">District<RequiredField /></label><br />
                                                                    <select 
                                                                        name="district" 
                                                                        id="district" 
                                                                        className={`form-control ${errors.district ? 'is-invalid' : ''}`}
                                                                        value={searchForm.district} 
                                                                        onChange={(e) => setSearchForm({...searchForm, [e.target.name]: e.target.value })}
                                                                    >
                                                                        <option value="">Select district</option>
                                                                        { districts.filter(d=>parseInt(d.state)===parseInt(searchForm.state)).map((item, index) => (
                                                                        <option key={index} value={item.district_code }>{ item.district_name }</option>
                                                                        ))}
                                                                    </select>
                                                                    <div className="invalid-feedback">
                                                                        { errors.district }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-5">
                                                                <div className="form-group">
                                                                    <label htmlFor="establishment">Establishment Name<RequiredField /></label>
                                                                    <select 
                                                                        name="establishment" 
                                                                        id="establishment" 
                                                                        className={`form-control ${errors.establishment ? 'is-invalid' : null}`}
                                                                        value={searchForm.establishment}
                                                                        onChange={(e) => setSearchForm({...searchForm, [e.target.name]:e.target.value})}
                                                                    >
                                                                        <option value="">Select Establishment</option>
                                                                        {
                                                                            establishments.filter(e=>parseInt(e.district) === parseInt(searchForm.district)).map((item, index) => (
                                                                                <option value={item.establishment_code} key={index}>{item.establishment_name}</option>
                                                                            ))
                                                                        }
                                                                    </select>
                                                                    <div className="invalid-feedback">
                                                                        { errors.establishment }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3 offset-md-3">
                                                                <div className="form-group">
                                                                    <label htmlFor="case_type">Case Type<RequiredField /></label>
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
                                                            <div className="col-md-2">
                                                                <div className="form-group">
                                                                    <label htmlFor="case_number">Case Number<RequiredField /></label>
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
                                                            <div className="col-md-2">
                                                                <div className="form-group">
                                                                    <label htmlFor="case_year">Year<RequiredField /></label>
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
                                                        </div>
                                                        )}
                                                        <div className="row">
                                                            <div className="col-md-12 d-flex justify-content-center">
                                                                <Button
                                                                    variant='contained'
                                                                    type="submit"
                                                                    color="primary"
                                                                    onClick={handleSearch}
                                                                >Search</Button>
                                                            </div>
                                                        </div>
                                                        {/* { loading && (
                                                            <Loading />
                                                        )} */}
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    { caseFound && (
                                    <>
                                    <div className="card card-light mt-3">
                                        <div className="card-header">Petitioner Details </div>
                                        <div className="card-body">
                                            <div className="row">  
                                            <div className="col-md-3">
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Name of the Petitioner<RequiredField /></Form.Label>
                                                    <Form.Control
                                                        name="litigant_name" 
                                                        className={`${errors.litigant_name ? 'is-invalid' : ''}`}
                                                        value={form.litigant_name} 
                                                        onChange={(e) => handleNameChange(e, setForm, form, 'litigant_name')}
                                                    ></Form.Control>
                                                    <div className="invalid-feedback">{ errors.litigant_name }</div>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                            <Form.Group>
                                                <Form.Label>{t('designation')}</Form.Label>
                                                <select 
                                                    name="designation" 
                                                    className={`form-control ${errors.designation ? 'is-invalid' : ''}` }
                                                    value={form.designation}
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                >
                                                    <option value="">{t('alerts.select_designation')}</option>
                                                    { designations.map((d, index) => (
                                                        <option key={index} value={d.id}>{language === 'ta' ? d.designation_lname : d.designation_name }</option>
                                                    ))}
                                                </select>
                                                <div className="invalid-feedback">{ errors.designation }</div>
                                            </Form.Group>
                                            </div>
                                            <div className="col-md-2">
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Gender<RequiredField /></Form.Label>
                                                    <select 
                                                        name="gender" 
                                                        value={form.gender} 
                                                        className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    >
                                                        <option value="Select">Select</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                    <div className="invalid-feedback">{ errors.gender }</div>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-2">
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Age</Form.Label>
                                                    <Form.Control
                                                        name="age"
                                                        value={form.age}
                                                        className={`${errors.age ? 'is-invalid' : ''}`}
                                                        onChange={(e) => handleAgeChange(e, setForm, form)}
                                                        //onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    ></Form.Control>
                                                    <div className="invalid-feedback">{ errors.age }</div>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-2">
                                                <div className="form-group mb-3">
                                                    <label htmlFor="relation">Relation</label><br />
                                                    <select 
                                                    name="relation" 
                                                    id="relation" 
                                                    className={`form-control ${errors.relation ? 'is-invalid' : ''}`}
                                                    value={form.relation}
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    >
                                                    <option value="">Select relation</option>
                                                    { relations.map((item, index) => (
                                                        <option key={index} value={item.relation_name}>{ item.relation_name }</option>
                                                    )) }
                                                    </select>
                                                    <div className="invalid-feedback">{ errors.relation }</div>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Relation Name</Form.Label>
                                                    <Form.Control
                                                        name="relation_name"
                                                        value={form.relation_name}
                                                        className={`${errors.relation_name ? 'is-invalid' : ''}`}
                                                        onChange={(e) => handleNameChange(e, setForm, form, 'relation_name')}
                                                    ></Form.Control>
                                                    <div className="invalid-feedback">{ errors.relation_name }</div>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="state">State</label><br />
                                                    <select 
                                                        name="state" 
                                                        id="state" 
                                                        className="form-control"
                                                        value={form.state}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    >
                                                        <option value="">Select state</option>
                                                        { states.map((item, index) => (
                                                        <option value={item.state_code} key={index}>{item.state_name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="district">District</label><br />
                                                    <select 
                                                        name="district" 
                                                        id="district" 
                                                        className="form-control"
                                                        value={form.district}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    >
                                                        <option value="">Select District</option>
                                                        { districts.filter(d=>parseInt(d.state) === parseInt(form.state)).map((item, index) => (
                                                        <option value={item.district_code} key={index}>{item.district_name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="taluk">Taluk</label><br />
                                                    <select 
                                                        name="taluk" 
                                                        id="taluk" 
                                                        className="form-control"
                                                        value={form.taluk}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    >
                                                        <option value="">Select Taluk</option>
                                                        { taluks.filter(t=>parseInt(t.district) === parseInt(form.district)).map((item, index) => (
                                                        <option value={item.taluk_code} key={index}>{ item.taluk_name }</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Address</Form.Label>
                                                    <Form.Control
                                                        name="address"
                                                        value={form.address}
                                                        className={`${errors.address ? 'is-invalid' : ''}`}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    ></Form.Control>
                                                    <div className="invalid-feedback">{ errors.address }</div>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-2">
                                                <Form.Group>
                                                    <Form.Label>Post Office</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="post_office"
                                                        value={form.post_office}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    ></Form.Control>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-2">
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Pincode</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="pincode"
                                                        value={form.pincode}
                                                        onChange={(e) => handlePincodeChange(e, setForm, form, 'pincode')}
                                                    ></Form.Control>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-2">
                                                <Form.Group>
                                                    <Form.Label>Mobile Number</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="mobile_number"
                                                        className={`${errors.mobile_number ? 'is-invalid' : ''}`}
                                                        value={form.mobile_number}
                                                        onChange={(e) => handleMobileChange(e, setForm, form, 'mobile_number')}
                                                    ></Form.Control>
                                                    <div className="invalid-feedback">
                                                    { errors.mobile_number}
                                                    </div>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-2">
                                                <Form.Group>
                                                    <Form.Label>Email Address</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="email_address"
                                                        value={form.email_address}
                                                        className={`${errors.email_address ? 'is-invalid' : ''}`}
                                                        onChange={handleChange}
                                                    ></Form.Control>
                                                    <div className="invalid-feedback">{ errors.email_address }</div>
                                                </Form.Group>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    <div className="card card-light">
                                        <div className="card-header">Accused/Respondent Details</div>
                                        <div className="card-body p-1">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    { Object.keys(accused).length > 0 && (
                                                        <table className="table table-bordered">
                                                            <thead className="bg-secondary">
                                                                <tr>
                                                                    <th>Select</th>
                                                                    <th>Accused Name</th>
                                                                    <th>Gender</th>
                                                                    <th>Act</th>
                                                                    <th>Section</th>
                                                                    <th>Age</th>
                                                                    <th>Address</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {accused.filter(a=>a.litigant_type===1).map((a, index)=>(
                                                                    <tr key={index}>
                                                                        <td>
                                                                            <input
                                                                                type="checkbox"
                                                                                id={a.litigant_id}
                                                                                checked={isRespondentSelected(a)}
                                                                                onChange={() => handleRespondentCheckBoxChange(a)}
                                                                            />
                                                                        </td>
                                                                        <td>{a.litigant_name}</td>
                                                                        <td>{a.gender}</td>
                                                                        <td>{a.act}</td>
                                                                        <td>{a.section}</td>
                                                                        <td>{a.age}</td>
                                                                        <td>{a.address}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="">Grounds</label>
                                                <textarea 
                                                    name="grounds" 
                                                    cols="30" 
                                                    rows="10" 
                                                    className={`form-control ${errors.grounds ? 'is-invalid' : null }`}
                                                    value={form.grounds}
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                ></textarea>
                                                <div className="invalid-feedback">{ errors.grounds }</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <Button
                                                variant='contained'
                                                color='success'
                                                onClick={handleSubmit}
                                            >Submit</Button>
                                        </div>
                                    </div>
                                    </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PetitionFiling