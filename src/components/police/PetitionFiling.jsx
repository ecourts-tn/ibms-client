import React, {useState, useContext, useEffect} from 'react'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form'
import { toast, ToastContainer } from 'react-toastify';
import api from 'api';
import * as Yup from 'yup'
import { PoliceStationContext } from 'contexts/PoliceStationContext';
import { EstablishmentContext } from 'contexts/EstablishmentContext';
import { RequiredField, formatDate } from 'utils';
import Loading from 'components/utils/Loading';
import { handleMobileChange, handleAadharChange, validateEmail, handleAgeChange, handleNameChange, handlePincodeChange } from 'components/validation/validations';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';
import { MasterContext } from 'contexts/MasterContext';
import PetitionList from './PetitionList';
import { AuthContext } from 'contexts/AuthContext';

const PetitionFiling = () => {

    const {policeStations} = useContext(PoliceStationContext)
    const {establishments} = useContext(EstablishmentContext)
    const {masters: {
        states,
        districts,
        taluks,
        relations,
        designations
    }} = useContext(MasterContext)
    const { user } = useContext(AuthContext)
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    const [searchForm, setSearchForm] = useState({
        filing_type: 9,
        search_type: 1,
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
    const[searchErrors, setSearchErrors] = useState([])
    const searchValidationSchema = Yup.object({
        search_type: Yup.string().required(),
        state: Yup.string().required(t('errors.state_required')),
        district: Yup.string().required(t('errors.district_required')),
        police_station: Yup.string()
            .nullable()
            .when('search_type', (search_type, schema) => {
                if(parseInt(search_type) === 1){
                    return schema.required('Police station is required')
                }
                return schema.notRequired()
            }),
        crime_number: Yup.string()
            .nullable()
            .when('search_type', (search_type, schema) => {
                if(parseInt(search_type) === 1){
                    return schema.required('Crime number is required')
                }
                return schema.notRequired()
            }),
        crime_year: Yup.string()
            .nullable()
            .when('search_type', (search_type, schema) => {
                if(parseInt(search_type) === 1){
                    return schema.required('Crime year is required')
                }
                return schema.notRequired()
            }),
        establishment: Yup.string()
            .nullable()
            .when('search_type', (search_type, schema) => {
                if(parseInt(search_type) === 2){
                    return schema.required('Establishment is required')
                }
                return schema.notRequired()
            }),
        case_type: Yup.string()
            .nullable()
            .when('search_type', (search_type, schema) => {
                if(parseInt(search_type) === 2){
                    return schema.required('Case type is required')
                }
                return schema.notRequired()
            }),
        case_number: Yup.string()
            .nullable()
            .when('search_type', (search_type, schema) => {
                if(parseInt(search_type) === 2){
                    return schema.required('Case number is required')
                }
                return schema.notRequired()
            }),
        case_year: Yup.string()
            .nullable()
            .when('search_type', (search_type, schema) => {
                if(parseInt(search_type) === 2){
                    return schema.required('Case year is required')
                }
                return schema.notRequired()
            })
    })
    const[selectedRespondent, setSelectedRespondent] = useState([])
    const[caseFound, setCaseFound] = useState(false)
    const[loading, setLoading] = useState(false)
    const[petitions, setPetitions] = useState([])
    const[efileNumber, setEfileNumber] = useState('')
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
        litigant_name: Yup.string().required('Litigant name is required'),
        designation: Yup.string().required('Designation is required'),
        gender: Yup.string().required('Gender is required'),
        age:Yup.string().required('Age is requried').matches(/^\d{1-2}$/, 'Age must be less than 99'),
        relation:Yup.string().required('Relation is required'),
        relation_name:Yup.string().required('Relation name is required'),
        state: Yup.string().required('State is required'),
        district: Yup.string().required('District is required'),
        taluk: Yup.string().required('Taluk is required'),
        address:Yup.string().required('Address is requried'),
        post_office:Yup.string().required('Post office is required'),
        pincode:Yup.string().required('Pincode is required').matches(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
        mobile_number:Yup.string().required('Mobile number is requried').matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
        email_address:Yup.string().email('Invalid email address').required('Email address is requried'),
        grounds: Yup.string().required()
    })
    
    const[errors, setErrors] = useState([])
    const[accused, setAccused] = useState([])

    useEffect(() => {
        if(user){
            setSearchForm({...searchForm,
                state: user.district?.state,
                district: user.district?.district_code,
                police_station: user.police_station?.cctns_code
            })
        }
    }, [user])

    const handleSearch = async(e) => {
        e.preventDefault()
        setLoading(true)
        setCaseFound(false)
        try{
            await searchValidationSchema.validate(searchForm, { abortEarly: false})
            const url = parseInt(searchForm.search_type) === 1 ? `police/search/crime/list/` : 'police/search/case/'
            const response = await api.post(url, searchForm)
            if(response.status === 200){
                if(Array.isArray(response.data) && response.data.length > 1){
                    console.log("array")
                    setPetitions(response.data)
                }else{
                    setCaseFound(true)
                    setPetition(response.data.petition)
                    const accused = response.data.litigants?.filter((accused) => {
                        return accused.litigant_type === 1
                    })
                    setAccused(accused)
                    setForm({...form, efile_no:response.data.crime.petition})
                }
            }
        }catch(error){
            if(error.inner){
                const newErrors = {}
                error.inner.forEach(err => {
                    newErrors[err.path] = err.message
                })
                setSearchErrors(newErrors)
            }
            if(error.response){
                switch(error.response.status){
                    case 404:
                        toast.error(error.response.data.message, {theme:"colored"});
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

    useEffect(() => {
        const fetchPetitionDetail = async() => {
            try{
                const response = await api.post(`police/petition/detail/`, {efile_no:efileNumber})
                if(response.status === 200){
                    setCaseFound(true)
                    setPetition(response.data.petition)
                    const accused = response.data.litigant?.filter((accused) => {
                        return accused.litigant_type === 1
                    })
                    setAccused(accused)
                    setForm({...form, efile_no:response.data.crime.petition})
                    setPetitions([])
                }
            }catch(error){
                console.log(error)
            }
        }
        if(efileNumber){
            fetchPetitionDetail()
        }
    }, [efileNumber])
        



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


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await validationSchema.validate(form, { abortEarly: false });
            const post_data = {
                accused: selectedRespondent,  
                petition: {
                    case_type: searchForm.filing_type,       
                    court: petition.court.court_code || null,     
                    establishment: petition.establishment.establishment_code || null,	    
                    district: petition.district.district_code,    
                    judiciary: petition.judiciary.id,               
                    seat: petition.seat || null,                 
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
            
    
            // Send the request with the structured data
            const response = await api.post("police/filing/petition/", post_data);
            
            if (response.status === 201) {
                toast.success("Petition filed successfully", { theme: "colored" });
            }
        } catch (error) {
            console.log(error.inner);
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
        <React.Fragment>
            <ToastContainer />
            { loading && (<Loading />)}
            <div className="row">
                <div className="col-sm-12">
                    <ol className="breadcrumb mt-2">
                        <li className="breadcrumb-item"><a href="#">Home</a></li>
                        <li className="breadcrumb-item"><a href="#">Police</a></li>
                        <li className="breadcrumb-item active"><a href="#">Petition Filing</a></li>
                    </ol>
                </div>
                <div className="col-md-12">
                    <div className="card card-outline card-primary" style={{minHeight:'700px'}}>
                        <div className="card-header">
                            <strong>Petiiton Filing</strong>
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
                                                        name="filing_type" 
                                                        id="filing_typeYes" 
                                                        checked={parseInt(searchForm.filing_type) === 9 }
                                                        onChange={(e) => setSearchForm({...searchForm, [e.target.name] : 9})} 
                                                    />
                                                    <label htmlFor="filing_typeYes">Bail Cancellation</label>
                                                    </div>
                                                    <div className="icheck-success d-inline mx-2">
                                                    <input 
                                                        type="radio" 
                                                        id="filing_typeNo" 
                                                        name="filing_type" 
                                                        value={searchForm.filing_type}
                                                        checked={ parseInt(searchForm.filing_type) === 10 } 
                                                        onChange={(e) => setSearchForm({...searchForm, [e.target.name] : 10})}
                                                    />
                                                    <label htmlFor="filing_typeNo">Request Custody</label>
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
                                                        name="search_type" 
                                                        id="searchTypeYes" 
                                                        checked={parseInt(searchForm.search_type) === 1 }
                                                        onChange={(e) => setSearchForm({...searchForm, search_type : 1})} 
                                                    />
                                                    <label htmlFor="searchTypeYes">Search by Crime Number</label>
                                                    </div>
                                                    <div className="icheck-primary d-inline mx-2">
                                                    <input 
                                                        type="radio" 
                                                        id="searchTypeNo" 
                                                        name="search_type" 
                                                        checked={ parseInt(searchForm.search_type) === 2 } 
                                                        onChange={(e) => setSearchForm({...searchForm, search_type : 2 })}
                                                    />
                                                    <label htmlFor="searchTypeNo">Search by Case Number</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-10 offset-1">
                                            <form action="">
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label htmlFor="state">State <RequiredField /></label>
                                                        <select 
                                                            name="state" 
                                                            id="state" 
                                                            className={ `form-control ${searchErrors.state ? 'is-invalid': ''}`}
                                                            value={searchForm.state}
                                                            disabled={searchForm.state ? true : false }
                                                            onChange={(e) => setSearchForm({...searchForm, [e.target.name]: e.target.value })}    
                                                        >
                                                        <option value="">Select state</option>
                                                        { states.map((item, index) => (
                                                            <option key={index} value={item.state_code }>{ item.state_name }</option>
                                                        ))}
                                                        </select>
                                                        <div className="invalid-feedback">
                                                            { searchErrors.state }
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group">
                                                            <label htmlFor="district">District<RequiredField /></label><br />
                                                            <select 
                                                                name="district" 
                                                                id="district" 
                                                                className={`form-control ${searchErrors.district ? 'is-invalid' : ''}`}
                                                                value={searchForm.district} 
                                                                disabled={ searchForm.district ? true : false }
                                                                onChange={(e) => setSearchForm({...searchForm, [e.target.name]: e.target.value })}
                                                            >
                                                                <option value="">Select district</option>
                                                                { districts.filter(d => parseInt(d.state) === parseInt(searchForm.state)).map((item, index) => (
                                                                <option key={index} value={item.district_code }>{ item.district_name }</option>
                                                                ))}
                                                            </select>
                                                            <div className="invalid-feedback">
                                                                { searchErrors.district }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    { parseInt(searchForm.search_type) === 1 && (
                                                        <React.Fragment>
                                                            <div className="col-md-5">
                                                                <div className="form-group">
                                                                <label htmlFor="police_station">Police Station Name<RequiredField /></label><br />
                                                                <select 
                                                                    name="police_station" 
                                                                    id="police_station" 
                                                                    className={`form-control ${searchErrors.police_station ? 'is-invalid' : ''}`}
                                                                    value={searchForm.police_station}
                                                                    disabled={searchForm.police_station ? true : false }
                                                                    onChange={(e)=> setSearchForm({...searchForm, [e.target.name]: e.target.value })}
                                                                >
                                                                    <option value="">Select station</option>
                                                                    { policeStations.filter(p=>parseInt(p.revenue_district) === parseInt(searchForm.district)).map((item, index) => (
                                                                        <option key={index} value={item.cctns_code}>{ item.station_name}</option>
                                                                    ))}
                                                                </select>
                                                                <div className="invalid-feedback">{ searchErrors.police_station }</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3 offset-md-3">
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
                                                        </React.Fragment>
                                                    )}
                                                    { parseInt(searchForm.search_type) === 2 && (
                                                        <React.Fragment>
                                                            <div className="col-md-5">
                                                                <div className="form-group">
                                                                    <label htmlFor="establishment">Establishment Name<RequiredField /></label>
                                                                    <select 
                                                                        name="establishment" 
                                                                        id="establishment" 
                                                                        className={`form-control ${searchErrors.establishment ? 'is-invalid' : null}`}
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
                                                                        { searchErrors.establishment }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4 offset-md-2">
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
                                                        </React.Fragment>
                                                    )}
                                                </div>
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
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            { Object.keys(petitions).length > 0 && (
                                <PetitionList 
                                    petitions={petitions}
                                    setEfileNumber={setEfileNumber}
                                />
                            )}
                            { !caseFound && (
                            <React.Fragment>
                                <div className="card card-info mt-3">
                                    <div className="card-header">
                                        Petitioner Details 
                                    </div>
                                    <div className="card-body">
                                        <div className="row">  
                                        <div className="col-md-3">
                                            <Form.Group className="mb-3">
                                                <Form.Label>Name of the Petitioner<RequiredField /></Form.Label>
                                                <Form.Control
                                                    name="litigant_name" 
                                                    className={`${errors.litigant_name ? 'is-invalid' : ''}`}
                                                    value={form.litigant_name} 
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                ></Form.Control>
                                                <div className="invalid-feedback">{ errors.litigant_name }</div>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-3">
                                        <Form.Group>
                                            <Form.Label>{t('designation')} <RequiredField /></Form.Label>
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
                                                <Form.Label>{t('gender')}<RequiredField /></Form.Label>
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
                                                <Form.Label>{t('age')} <RequiredField /></Form.Label>
                                                <Form.Control
                                                    name="age"
                                                    value={form.age}
                                                    className={`${errors.age ? 'is-invalid' : ''}`}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, '')
                                                        if(value.length <= 2){
                                                            setForm({...form, [e.target.name]: value})

                                                        }}
                                                    }
                                                ></Form.Control>
                                                <div className="invalid-feedback">{ errors.age }</div>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group mb-3">
                                                <label htmlFor="relation">{t('relationship_type')} <RequiredField /></label><br />
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
                                                <Form.Label>{t('relationship_name')} <RequiredField /></Form.Label>
                                                <Form.Control
                                                    name="relation_name"
                                                    value={form.relation_name}
                                                    className={`${errors.relation_name ? 'is-invalid' : ''}`}
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                ></Form.Control>
                                                <div className="invalid-feedback">{ errors.relation_name }</div>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="state">{t('state')} <RequiredField /></label>
                                                <select 
                                                    name="state" 
                                                    className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                                                    value={form.state}
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                >
                                                    <option value="">Select state</option>
                                                    { states.map((item, index) => (
                                                    <option value={item.state_code} key={index}>{item.state_name}</option>
                                                    ))}
                                                </select>
                                                <div className="invalid-feedback">{ errors.state }</div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="district">{t('district')} <RequiredField /></label>
                                                <select 
                                                    name="district" 
                                                    className={`form-control ${errors.district ? 'is-invalid' : ''}`}
                                                    value={form.district}
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                >
                                                    <option value="">Select District</option>
                                                    { districts.filter(d=>parseInt(d.state) === parseInt(form.state)).map((item, index) => (
                                                    <option value={item.district_code} key={index}>{item.district_name}</option>
                                                    ))}
                                                </select>
                                                <div className="invalid-feedback">{ errors.district }</div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="taluk">{t('taluk')} <RequiredField /></label>
                                                <select 
                                                    name="taluk" 
                                                    className={`form-control ${errors.district ? 'is-invalid' : ''}`}
                                                    value={form.taluk}
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                >
                                                    <option value="">Select Taluk</option>
                                                    { taluks.filter(t=>parseInt(t.district) === parseInt(form.district)).map((item, index) => (
                                                    <option value={item.taluk_code} key={index}>{ item.taluk_name }</option>
                                                    ))}
                                                </select>
                                                <div className="invalid-feedback">{ errors.taluk }</div>
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <Form.Group className="mb-3">
                                                <Form.Label>{t('address')} <RequiredField /></Form.Label>
                                                <Form.Control
                                                    name="address"
                                                    value={form.address}
                                                    className={`${errors.address ? 'is-invalid' : ''}`}
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                ></Form.Control>
                                                <div className="invalid-feedback">{ errors.address }</div>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-4">
                                            <Form.Group>
                                                <Form.Label>{t('post_office')} <RequiredField /></Form.Label>
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
                                                <Form.Label>{t('pincode')} <RequiredField /></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="pincode"
                                                    className={`${errors.pincode ? 'is-invalid' : ''}`}
                                                    value={form.pincode}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, '')
                                                        if(value.length <= 6){
                                                            setForm({...form, [e.target.name]: value})
                                                        }
                                                    }}
                                                ></Form.Control>
                                                <div className="invalid-feedback">{ errors.pincode }</div>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-3">
                                            <Form.Group>
                                                <Form.Label>{t('mobile_number')} <RequiredField /></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="mobile_number"
                                                    className={`${errors.mobile_number ? 'is-invalid' : ''}`}
                                                    value={form.mobile_number}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, '')
                                                        if(value.length <= 6){
                                                            setForm({...form, [e.target.name] :  value})
                                                        }
                                                    }}
                                                ></Form.Control>
                                                <div className="invalid-feedback">{ errors.mobile_number}</div>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-4">
                                            <Form.Group>
                                                <Form.Label>{t('email_address')} <RequiredField /></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="email_address"
                                                    value={form.email_address}
                                                    className={`${errors.email_address ? 'is-invalid' : ''}`}
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                ></Form.Control>
                                                <div className="invalid-feedback">{ errors.email_address }</div>
                                            </Form.Group>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <div className="card card-info">
                                    <div className="card-header">Accused/Respondent Details</div>
                                    <div className="card-body p-1">
                                        {accused.filter((l) => l.litigant_type === 1)
                                        .map((a, index) => (
                                        <div class="card mb-3 border-info" key={index}>
                                            <div class="row no-gutters">
                                                <div class="col-md-2 pt-2 text-center">
                                                    <img src={`${process.env.PUBLIC_URL}/images/profile.jpg`} alt="" style={{width:"120px", height:"120px"}}/> <br/>
                                                    <input
                                                        type="checkbox"
                                                        id={a.litigant_id}
                                                        checked={isRespondentSelected(a)}
                                                        onChange={() => handleRespondentCheckBoxChange(a)}
                                                    /> Select
                                                </div>
                                                <div class="col-md-10">
                                                    <div class="card-body">
                                                    <h5 class="card-title"><strong>{a.litigant_name}</strong>{` ${a.age}, ${a.gender}`}</h5>
                                                    <p class="card-text">{`${a.relation} Name: ${a.relation_name}`}</p>
                                                    <p class="card-text">{ a.address }</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        ))}
                                        {/* <div className="row">
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
                                        </div> */}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="">{t('ground')} <RequiredField /></label>
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
                            </React.Fragment>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default PetitionFiling