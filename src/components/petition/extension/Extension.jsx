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
import InitialInput from '../InitialInput';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import SearchIcon from '@mui/icons-material/Search'
import Document from 'components/Document';
import GroundsContainer from 'components/Ground';
import { StateContext } from 'contexts/StateContext';
import { DistrictContext } from 'contexts/DistrictContext';
import { EstablishmentContext } from 'contexts/EstablishmentContext';
import { BenchTypeContext } from 'contexts/BenchTypeContext';


const Extension = () => {

    const {states} = useContext(StateContext)
    const {districts} = useContext(DistrictContext)
    const {establishments} = useContext(EstablishmentContext)
    const {benchtypes} = useContext(BenchTypeContext)
    const[bail, setBail] = useState({})
    const[eFileNumber, seteFileNumber] = useState('')
    const[isPetition, setIsPetition] = useState(false)
    const[petitioners, setPetitioners] = useState([])
    const[selectedPetitioner, setSelectedPetitioner] = useState([])
    const[selectedRespondent, setSelectedRespondent] = useState([])
    const[respondents, setRespondents] = useState([])
    const[advocates, setAdvocates]     = useState([])
    const[errors, setErrors] = useState({})
    const [grounds, setGrounds] = useState('')
    const[cases, setCases] = useState([])
    const[searchPetition, setSearchPetition] = useState(1)
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
    const[petition, setPetition] = useState({})
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

    const handlePetitionerCheckBoxChange = (petitioner) => {
        if (selectedPetitioner.includes(petitioner)) {
          // If already selected, remove the petitioner from the selected list
          setSelectedPetitioner(selectedPetitioner.filter(selected => selected.litigant_id !== petitioner.litigant_id));
        } else {
          // Otherwise, add the petitioner to the selected list
          setSelectedPetitioner([...selectedPetitioner, {
            litigant_name :petitioner.litigant_name,
            litigant_type :1, 
            rank: petitioner.rank,
            gender: petitioner.gender,
            act: petitioner.act,
            section: petitioner.section,
            relation: petitioner.relation,
            relation_name: petitioner.relation_name,
            age: petitioner.age,
            address: petitioner.address,
            mobile_number: petitioner.mobile_number,
            email_address: petitioner.email_address,
            nationality: petitioner.nationality,
          }]);
        }
    };

    const handleRespondentCheckBoxChange = (respondent) => {
        if (selectedRespondent.includes(respondent)) {
          // If already selected, remove the respondent from the selected list
          setSelectedRespondent(selectedRespondent.filter(selected => selected.litigant_id !== respondent.litigant_id));
        } else {
          // Otherwise, add the respondent to the selected list
          setSelectedRespondent([...selectedRespondent, {
            litigant_name: respondent.litigant_name,
            litigant_type: 2, 
            designation: respondent.designation,
            state: respondent.state.state_code,
            district: respondent.district.district_code,
            police_station: respondent.police_station.cctns_code,
            address: respondent.address,
          }]);
        }
    };

    const isPetitionerSelected = (petitioner) => selectedPetitioner.some(selected => selected.litigant_name === petitioner.litigant_name);
    const isRespondentSelected = (respondent) => selectedRespondent.some(selected => selected.litigant_name === respondent.litigant_name);
    
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
                    const {petition:pet, litigant, advocate} = response.data
                    setIsPetition(true)
                    setBail(pet)
                    setPetitioners(litigant.filter(l=>l.litigant_type===1))
                    setRespondents(litigant.filter(l=>l.litigant_type===2))
                    setAdvocates(advocate)
                    setPetition({...petition,
                        court_type: pet.court_type.id,
                        bench_type: pet.bench_type ? pet.bench_type.bench_code : null,
                        state: pet.state ? pet.state.state_code : null,
                        district:pet.district ? pet.district.district_code : null,
                        establishment: pet.establishment ? pet.establishment.establishment_code : null,
                        court: pet.court ? pet.court.court_code : null,
                        case_type: 3,
                        bail_type: pet.bail_type ? pet.bail_type.type_code: null,
                        complaint_type: pet.complaint_type.id,
                        crime_registered: pet.crime_registered,
                    })
                }
            }catch(error){
                console.log(error)
            }
        }
        if(eFileNumber !== ''){
            fetchDetails()
        }else{
            resetPage()
        }
    },[eFileNumber])


    const handleSearch = async(e) => {
        e.preventDefault()
        try{
            // await searchSchema.validate(searchForm, { abortEarly:false})
            const response = await api.get("case/bail/approved/single/", { params: searchForm})
            console.log(response.data)
            if(response.status === 200){
                setIsPetition(true)
                setPetition(response.data.petition)
                setPetitioners(response.data.litigant.filter(l=>l.litigant_type===1))
                setRespondents(response.data.litigant.filter(l=>l.litigant_type===2))
                setAdvocates(response.data.advocate)
            }

        }catch(error){
            if(error.response){
                if(error.response.status === 404){
                    resetPage()
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
            petition: petition,
            petitioner:selectedPetitioner,
            respondent: selectedRespondent,
        }
        if (Object.keys(selectedPetitioner).length === 0){
            alert("Please select atleast one petitioner")
            return
        }
        const response = await api.post("case/filing/relaxation/", post_data)
        if(response.status === 201){
            resetPage()
            setSelectedPetitioner([])
            setSelectedRespondent([])
            sessionStorage.setItem("efile_no", response.data.efile_number)
            toast.success(`${response.data.efile_number} details submitted successfully`,{
                theme: "colored"
            })
        }
    }

    const resetPage = () => {
        setSearchForm({...searchForm, reg_number: '', reg_year: ''})
        seteFileNumber('')
        setIsPetition(false)
        setPetition({})
        setPetitioners([])
        setRespondents([])
        setAdvocates([])
    }

    useEffect(() => {
        resetPage()
    },[searchForm.court_type, searchPetition])

    useEffect(()=> {
        sessionStorage.removeItem("efile_no")
    },[])

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
                                <li className="breadcrumb-item active" aria-current="page">Extension of Time</li>
                            </ol>
                        </nav>
                        <div className="card">
                            <div className="card-body p-1" style={{minHeight:'500px'}}>
                                <div id="stepper1" className="bs-stepper">
                                    <div className="bs-stepper-header mb-3">
                                        <div className="step" data-target="#initial-input">
                                            <button className="step-trigger">
                                            <span className="bs-stepper-circle">1</span>
                                            <span className="bs-stepper-label">Petition Details</span>
                                            </button>
                                        </div>
                                        <div className="line"></div>
                                        <div className="step" data-target="#litigant">
                                            <button className="step-trigger">
                                            <span className="bs-stepper-circle">2</span>
                                            <span className="bs-stepper-label">Litigants</span>
                                            </button>
                                        </div>
                                        <div className="line"></div>
                                        <div className="step" data-target="#ground">
                                            <button className="step-trigger">
                                            <span className="bs-stepper-circle">3</span>
                                            <span className="bs-stepper-label">Grounds</span>
                                            </button>
                                        </div>
                                        <div className="line"></div>
                                        <div className="step" data-target="#documents">
                                            <button className="step-trigger">
                                            <span className="bs-stepper-circle">4</span>
                                            <span className="bs-stepper-label">Documents</span>
                                            </button>
                                        </div>
                                        <div className="line"></div>
                                        <div className="step" data-target="#payment">
                                            <button className="step-trigger">
                                            <span className="bs-stepper-circle">5</span>
                                            <span className="bs-stepper-label">Payment</span>
                                            </button>
                                        </div>
                                        <div className="line"></div>
                                        <div className="step" data-target="#efile">
                                            <button className="step-trigger">
                                            <span className="bs-stepper-circle">6</span>
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
                                                            <div className="col-sm-8 offset-md-2">
                                                                <select 
                                                                    name="efile_no" 
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
                                                                        <label htmlFor="court_type_hc">High Court</label>
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
                                                                        <label htmlFor="court_type_dc">District Court</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 offset-md-3">
                                                                { parseInt(searchForm.court_type) === 2 && (
                                                                    <div className="row">
                                                                        <div className="col-md-6">
                                                                            <div className="form-group">
                                                                                <label htmlFor="">State</label>
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
                                                                                <label htmlFor="">District</label>
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
                                                                            <label htmlFor="">Establishment</label>
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
                                                                            <label htmlFor="">Bench</label>
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
                                                                        <label htmlFor="case_type">Case Type</label>
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
                                                                                        placeholder='Registration Number'
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
                                                                                        placeholder='Registration Year'
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
                                                                                    Search
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
                                                <div className="container-fluid mt-5 px-5">
                                                    { isPetition && (
                                                        <>
                                                            <InitialInput petition={bail} />
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
                                                                                    checked={isPetitionerSelected(petitioner)}
                                                                                    onChange={() => handlePetitionerCheckBoxChange(petitioner)}
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
                                                                                <div className="icheck-success">
                                                                                    <input 
                                                                                        type="checkbox" 
                                                                                        id={`checkboxSuccess${res.litigant_id}`} 
                                                                                        checked={isRespondentSelected(res)}
                                                                                        onChange={() => handleRespondentCheckBoxChange(res)}
                                                                                    />
                                                                                    <label htmlFor={`checkboxSuccess${res.litigant_id}`}></label>
                                                                                </div>                                                                            
                                                                            </td>
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
                                                                                            <DeleteIcon color='error' />
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
                                                    { isPetition && (
                                                        <div className="d-flex justify-content-center">
                                                            <Button
                                                                variant="contained"
                                                                color="success"
                                                                onClick={handleInitialSubmit}
                                                            >
                                                                Submit
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div id="litigant" className="content">

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
                                        <div id="ground" className="content">
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

export default Extension;