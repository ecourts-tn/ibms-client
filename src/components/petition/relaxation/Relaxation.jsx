import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button'
import api from 'api';
import Payment from 'components/pages/Payment';
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
import Form from 'react-bootstrap/Form';
import InitialInput from '../InitialInput';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import Document from 'components/Document';
import GroundsContainer from 'components/Ground';


const Relaxation = () => {

    const[petition, setPetition] = useState({})
    const[selectedCase, setSelectedCase] = useState('')
    const[isPetition, setIsPetition] = useState(false)
    const[petitioners, setPetitioners] = useState([])
    const[selectedPetitioner, setSelectedPetitioner] = useState([])
    const[respondents, setRespondents] = useState([])
    const[advocates, setAdvocates]     = useState([])
    const[errors, setErrors] = useState({})

    const deleteAdvocate = (advocate) => {
        const newAdvocate = advocates.filter((adv) => { return adv.id !== advocate.id})
        setAdvocates(newAdvocate)
    }

    const initialState = {
        court_type: '',
        bench_type:'',
        state: '',
        district:'',
        establishment: '',
        court:'',
        case_type: '',
        bail_type: '',
        complaint_type: '',
        crime_registered: '',
    }

    const [grounds, setGrounds] = useState('')
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

    const stepperRef = useRef(null);

    useEffect(() => {
        stepperRef.current = new Stepper(document.querySelector('#stepper1'), {
        linear: false,
        animation: true,
        });
    }, []);

    const handleCheckBoxChange = (petitioner) => {
        if (selectedPetitioner.includes(petitioner)) {
          // If already selected, remove the petitioner from the selected list
          setSelectedPetitioner(selectedPetitioner.filter(selected => selected.litigant_id !== petitioner.litigant_id));
        } else {
          // Otherwise, add the petitioner to the selected list
          setSelectedPetitioner([...selectedPetitioner, petitioner]);
        }
    };

    const isSelected = (petitioner) => selectedPetitioner.some(selected => selected.litigant_id === petitioner.litigant_id);
    
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
                const response = await api.get("case/filing/detail/", {params: {efile_no:selectedCase}})
                if(response.status === 200){
                    setIsPetition(true)
                    setPetition({...form, 
                        court_type: response.data.petition.court_type,
                        bench_type: response.data.petition.bench_type,
                        state: response.data.petition.state,
                        district: response.data.petition.district,
                        establishment: response.data.petition.establishment,
                        court: response.data.petition.court,
                        case_type: 3,
                        bail_type: null,
                        complaint_type: response.data.petition.complaint_type,
                        crime_registered: response.data.petition.crime_registered,
                    })
                    setPetitioners(response.data.litigant.filter(l=>l.litigant_type===1))
                    setRespondents(response.data.litigant.filter(l=>l.litigant_type===2))
                    setAdvocates(response.data.advocate)
                }
            }catch(error){
                console.log(error)
            }
        }
        if(selectedCase !== ''){
            fetchDetails()
        }else{
            setIsPetition(false)
            setPetition({})
            setPetitioners([])
            setRespondents([])
            setAdvocates([])
        }
    },[selectedCase])


    const handleSearch = async(e) => {
        e.preventDefault()
        try{
            // await searchSchema.validate(searchForm, { abortEarly:false})
            const response = await api.get("case/bail/approved/single/", { params: searchForm})

            if(response.status === 200){
                setPetition({...form, 
                    court_type: response.data.petition.court_type,
                    bench_type: response.data.petition.bench_type,
                    state: response.data.petition.state,
                    district: response.data.petition.district,
                    establishment: response.data.petition.establishment,
                    court: response.data.petition.court,
                    case_type: 3,
                    bail_type: null,
                    complaint_type: response.data.petition.complaint_type,
                    crime_registered: response.data.petition.crime_registered,
                })
                setPetitioners(response.data.litigant.filter(l=>l.litigant_type===1))
                setRespondents(response.data.litigant.filter(l=>l.litigant_type===2))
                setAdvocates(response.data.advocate)
                setForm({...form, efile_no:response.data.petition.efile_number})
            }

        }catch(error){
            if(error.response){
                if(error.response.status === 404){
                    setPetition({})
                    setPetitioners([])
                    setRespondents([])
                    setAdvocates([])
                    toast.error(error.response.data.message, {
                        theme:"colored"
                    })
                }
            }
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

    const handleInitialSubmit = async() => {
        const post_data = {
            petition: form,
            petitioner:selectedPetitioner,
            respondents,
        }
        const response = await api.post("case/filing/relaxation/", post_data)
        if(response.status === 201){
            toast.success("Condition Relaxation petition submitted successfully",{
                theme: "colored"
            })
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
                                        <div className="step" data-target="#ground">
                                            <button className="step-trigger">
                                            <span className="bs-stepper-circle">2</span>
                                            <span className="bs-stepper-label">Ground</span>
                                            </button>
                                        </div>
                                        <div className="line"></div>
                                        <div className="step" data-target="#documents">
                                            <button className="step-trigger">
                                            <span className="bs-stepper-circle">3</span>
                                            <span className="bs-stepper-label">Documents</span>
                                            </button>
                                        </div>
                                        <div className="line"></div>
                                        <div className="step" data-target="#payment">
                                            <button className="step-trigger">
                                            <span className="bs-stepper-circle">4</span>
                                            <span className="bs-stepper-label">Payment</span>
                                            </button>
                                        </div>
                                        <div className="line"></div>
                                        <div className="step" data-target="#efile">
                                            <button className="step-trigger">
                                            <span className="bs-stepper-circle">5</span>
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
                                                                    value={selectedCase}
                                                                    onChange={(e) => setSelectedCase(e.target.value)}
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
                                                    { isPetition && (
                                                        <>
                                                            <InitialInput petition={petition} />
                                                            <table className="table table-bordered table-striped table-sm">
                                                                <thead>
                                                                    <tr className="bg-navy">
                                                                        <td colSpan={7}><strong>Petitioner Details</strong></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>Select</th>
                                                                        <th>Petitioner Name</th>
                                                                        <th>Father/Husband/Guardian Name</th>
                                                                        <th>Age</th>
                                                                        <th>Rank</th>
                                                                        <th>Act</th>
                                                                        <th>Section</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    { petitioners.map((petitioner, index) => (
                                                                    <tr key={index}>
                                                                        <td>
                                                                            <div className="icheck-success">
                                                                                <input 
                                                                                    type="checkbox" 
                                                                                    id={`checkboxSuccess${petitioner.litigant_id}`} 
                                                                                    checked={isSelected(petitioner)}
                                                                                    onChange={() => handleCheckBoxChange(petitioner)}
                                                                                />
                                                                                <label htmlFor={`checkboxSuccess${petitioner.litigant_id}`}></label>
                                                                            </div>                                                                            </td>
                                                                        <td>
                                                                            <input 
                                                                                type="text" 
                                                                                className="form-control" 
                                                                                value={petitioner.litigant_name}
                                                                                readOnly={true}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input 
                                                                                type="text" 
                                                                                className="form-control" 
                                                                                value={petitioner.relation_name}
                                                                                readOnly={true}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input 
                                                                                type="text" 
                                                                                className="form-control" 
                                                                                value={petitioner.age}
                                                                                readOnly={true}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input 
                                                                                type="text" 
                                                                                className="form-control" 
                                                                                value={petitioner.rank}
                                                                                readOnly={true}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input 
                                                                                type="text" 
                                                                                className="form-control" 
                                                                                value={ petitioner.act}
                                                                                readOnly={true}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <input 
                                                                                type="text" 
                                                                                className="form-control" 
                                                                                value={petitioner.section}
                                                                                readOnly={true}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                            <table className="table table-bordered table-striped table-sm">
                                                                <thead>
                                                                    <tr className='bg-navy'>
                                                                        <td colSpan={4}><strong>Condition Details</strong></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>Bail Order Date</th>
                                                                        <th>Released Date</th>
                                                                        <th>No. of Days Present</th>
                                                                        <th>No. of Days Absent</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td><input type="text" className='form-control' readOnly={true} /></td>
                                                                        <td><input type="text" className='form-control' readOnly={true} /></td>
                                                                        <td><input type="text" className='form-control' readOnly={true} /></td>
                                                                        <td><input type="text" className='form-control' readOnly={true} /></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <table className="table table-bordered table-striped table-sm">
                                                                <thead>
                                                                    <tr className="bg-navy">
                                                                        <td colSpan={6}><strong>Respondent Details</strong></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>Respondent Name</th>
                                                                        <th>Designation</th>
                                                                        <th>Police Station</th>
                                                                        <th>District</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    { respondents.map((res, index) => (
                                                                        <tr key={index}>
                                                                            <td>
                                                                                <input 
                                                                                    type="text" 
                                                                                    className="form-control" 
                                                                                    value={res.litigant_name}
                                                                                    readOnly={true}
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <input 
                                                                                    type="text" 
                                                                                    className="form-control" 
                                                                                    value={res.designation}
                                                                                    readOnly={true}
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <input 
                                                                                    type="text" 
                                                                                    className="form-control" 
                                                                                    value={res.address}
                                                                                    readOnly={true}
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <input 
                                                                                    type="text" 
                                                                                    className="form-control" 
                                                                                    value={res.district.district_name}
                                                                                    readOnly={true}
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                            <table className="table table-bordered table-striped table-sm">
                                                                <thead>
                                                                    <tr className="bg-navy">
                                                                        <td colSpan={6}><strong>Advocate Details</strong>
                                                                            <div className="float-right">
                                                                                <button className="btn btn-success btn-sm"><i className="fa fa-plus mr-2"></i>Add New</button>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>Advocate Name</th>
                                                                        <th>Enrolment Number</th>
                                                                        <th>Mobile Number</th>
                                                                        <th>Email Address</th>
                                                                        <th width={120}>Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    { advocates.map((advocate, index) => (
                                                                        <tr key={index}>
                                                                            <td>
                                                                                <input 
                                                                                    type="text" 
                                                                                    className="form-control" 
                                                                                    value={advocate.advocate_name}
                                                                                    readOnly={true}
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <input 
                                                                                    type="text" 
                                                                                    className="form-control" 
                                                                                    value={advocate.enrolment_number}
                                                                                    readOnly={true}
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <input 
                                                                                    type="text" 
                                                                                    className="form-control" 
                                                                                    value={advocate.advocate_mobile}
                                                                                    readOnly={true}
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <input 
                                                                                    type="text" 
                                                                                    className="form-control" 
                                                                                    value={advocate.advocate_email}
                                                                                    readOnly={true}
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                { !advocate.is_primary && (
                                                                                    <>
                                                                                        <IconButton aria-label="delete" disabled color="primary">
                                                                                            <EditIcon color='info'/>
                                                                                        </IconButton>
                                                                                        <IconButton aria-label="delete">
                                                                                            <DeleteIcon color='error' onClick={() => deleteAdvocate(advocate)} />
                                                                                        </IconButton>
                                                                                    
                                                                                    </>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </>
                                                    )}
                                                    <div className="d-flex justify-content-center">
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            onClick={handleInitialSubmit}
                                                        >
                                                            Submit
                                                        </Button>
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
                                        <div id="ground" className="content text-center">
                                            <GroundsContainer />
                                            {/* <div className="row">
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <Editor 
                                                            value={form.grounds} 
                                                            onChange={(e) => setForm({...form, grounds: e.target.value })} 
                                                        />
                                                        <div className="invalid-feedback">
                                                            { errors.ground }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                        <div id="documents" className="content text-center">
                                            <Document />
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