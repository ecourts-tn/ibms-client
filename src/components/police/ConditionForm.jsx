import api from 'api'
import React, {useState, useEffect, useContext} from 'react'
import Button from '@mui/material/Button'
import { useLocation } from 'react-router-dom'
import WebcamCapture from 'components/utils/WebCamCapture'
import FingerPrintCapture from 'components/utils/FingerPrintCapture'
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify'
import { RequiredField } from 'utils'
import { MasterContext } from 'contexts/MasterContext'
import { PoliceStationContext } from 'contexts/PoliceStationContext'
import { EstablishmentContext } from 'contexts/EstablishmentContext'
import { AuthContext } from 'contexts/AuthContext'
import PetitionList from './PetitionList'
import { useTranslation } from 'react-i18next'
import Loading from 'components/utils/Loading'

const ConditionForm = () => {
    const {state} = useLocation()
    const { t } = useTranslation()
    const {user} = useContext(AuthContext)
    const {policeStations} = useContext(PoliceStationContext)
    const {establishments} = useContext(EstablishmentContext)
    const {masters: {
        states,
        districts,
    }} = useContext(MasterContext)

    const initialState = {
        crime_number: '',
        crime_year: '',
        accused: '',
        condition_date: '',
        condition_time:'',
        remarks: '',
        is_present:false,
        is_fingerprint:false,
        is_photo:false,
        photo: '',
        fingerprint:''
    }
    const[form, setForm] = useState(initialState)
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
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [caseFound, setCaseFound] = useState(false)
    const [petition, setPetition] = useState({})
    const [petitions, setPetitions] = useState([])
    const[efileNumber, setEfileNumber] = useState('')
    const [accused, setAccused] = useState([])
    const[searchErrors, setSearchErrors] = useState({})
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
                    return schema.required('Crime number is required').matches(/^\d{1-6}$/, 'Crime number is required')
                }
                return schema.notRequired()
            }),
        crime_year: Yup.string()
            .nullable()
            .when('search_type', (search_type, schema) => {
                if(parseInt(search_type) === 1){
                    return schema.required('Crime year is required').matches(/^\d{4}$/, 'Year must be exactly 4 digits')
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
                    return schema.required('Case number is required').matches(/^\d{1-6}$/, 'Case number is required')
                }
                return schema.notRequired()
            }),
        case_year: Yup.string()
            .nullable()
            .when('search_type', (search_type, schema) => {
                if(parseInt(search_type) === 2){
                    return schema.required('Case year is required').matches(/^\d{4}$/, 'Year must be exactly 4 digits')
                }
                return schema.notRequired()
            })
    })

    const validationSchema = Yup.object({
        crime_number: Yup.string().required('Crime number is required').matches(/\d{1-6}/g, 'Crime number should be numeric'),
        crime_year: Yup.string().required('Crime year is required').matches(/\d{1-4}/g, 'Year must be exactly 4 digits'),
        accused: Yup.string().required('Accused name is required'),
        condition_date: Yup.string().required('Condition date is required'),
        condition_time: Yup.string().required('Condition time is required'),
        remarks: Yup.string().nullable(),
        is_present: Yup.boolean().required('This field is required'),
        is_fingerprint:Yup.boolean()
            .nullable()
            .when('is_present', {
                is: true,
                then: schema => schema.required('Capture fingerprint is required'),
                otherwise: schema => schema.notRequired()
            }),
        is_photo: Yup.string()
            .nullable()
            .when('is_present', {
                is: true,
                then: schema => schema.required('Capture photo is required'),
                otherwise: schema => schema.notRequired()
            }),
        photo: Yup.string()
            .nullable()
            .when('is_photo', {
                is: true,
                then: schema => schema.required('Capture photo is required'),
                otherwise: schema => schema.notRequired()
            }),
        fingerprint: Yup.string()
            .nullable()
            .when('is_fingerprint', {
                is: true,
                then: schema => schema.required('Capture photo is required'),
                otherwise: schema => schema.notRequired()
            }),

    })



    useEffect(() => {
        if(user){
            setSearchForm({...searchForm,
                state: user.district?.state,
                district: user.district?.district_code,
                police_station: user.police_station?.cctns_code
            })
        }
    }, [user])

    useEffect(() => {
        const fetchDetail = async() =>{
            try{
                const response = await api.get(`litigant/list/`, {params:{efile_no:state.efile_no}})
                if(response.status === 200){
                    const filtered_data = response.data.filter((respondent)=> {
                        return respondent.litigant_type === 1
                    })
                    setAccused(filtered_data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchDetail()
    }, [])

    const condition_date_Display = (date) => {
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const condition_date_Backend = (date) => {
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const condition_date = flatpickr(".condition_date-date-picker", {
            dateFormat: "d-m-Y",
            // maxDate: "today",
            defaultDate: form.condition_date ? condition_date_Display(new Date(form.condition_date)) : '',
            onChange: (selectedDates) => {
                const formattedDate = selectedDates[0] ? condition_date_Backend(selectedDates[0]) : "";
                setForm({ ...form, condition_date: formattedDate });
            },
        });

        return () => {
            if (condition_date && typeof condition_date.destroy === "function") {
                condition_date.destroy();
            }
        };
    }, [form]);

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
                    setPetitions(response.data)
                }else{
                    setCaseFound(true)
                    setPetition(response.data.petition)
                    const accused = response.data.litigant?.filter((accused) => {
                        return accused.litigant_type === 1
                    })
                    setAccused(accused)
                    setForm({...form, efile_no:response.data.crime.petition})
                }
            }
        }catch(error){
            if(error.inner){
                console.log(error.inner)
                const newErrors = {}
                error.inner.forEach(err => {
                    newErrors[err.path] = err.message
                })
                setSearchErrors(newErrors)
            }
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

    useEffect(() => {
        const fetchPetitionDetail = async() => {
            try{
                const response = await api.get(`police/filing/detail/`, {params:{
                    efile_no:efileNumber}
                })
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

    const handleSubmit = async() => {
        try{
            await validationSchema.validate(form, { abortEarly: false })
            const response = await api.post(``)
            if(response.status === 201){
                toast.success("Condition details updated successfully", { theme: "colored"})
            }
        }catch(error){
            if(error.inner){
                console.log(error.inner)
                const newErrors = {}
                error.inner.forEach(err => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
            }
        }

    }

    return (
        <div className="card card-outline card-primary">
            { loading && <Loading />} <ToastContainer />
            <div className="card-header">
                <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Condition Compliance</strong></h3>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-10 offset-md-1">
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <div className="form-group">
                                    <div>
                                        <div className="icheck-primary d-inline mx-2">
                                        <input 
                                            type="radio" 
                                            name="search_type" 
                                            id="searchTypeYes" 
                                            checked={parseInt(searchForm.search_type) === 1}
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
                                            onChange={(e) => setSearchForm({...searchForm, search_type : 2})}
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
                                                className={ `form-control ${errors.state ? 'is-invalid': ''}`}
                                                value={searchForm.state}
                                                disabled = { searchForm.state ? true : false }
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
                                                    disabled={ searchForm.district ? true : false }
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
                                        { parseInt(searchForm.search_type) === 1 && (
                                            <React.Fragment>
                                                <div className="col-md-5">
                                                    <div className="form-group">
                                                        <label htmlFor="police_station">Police Station Name<RequiredField /></label><br />
                                                        <select 
                                                            name="police_station" 
                                                            id="police_station" 
                                                            className={`form-control ${errors.police_station ? 'is-invalid' : ''}`}
                                                            value={searchForm.police_station}
                                                            disabled={searchForm.police_station ? true : false}
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
                                                <div className="col-md-3 offset-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="case_number">Crime Number<RequiredField /></label>
                                                        <input 
                                                            type="text" 
                                                            className={`form-control ${searchErrors.crime_number ? 'is-invalid' : ''}`} 
                                                            name="crime_number"
                                                            value={searchForm.crime_number}
                                                            onChange={(e) => {
                                                                const value = e.target.value.replace(/\D/g, '')
                                                                if(value.length <= 6){
                                                                    setSearchForm({...searchForm, [e.target.name]: value })
                                                                }}
                                                            }
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
                        <div className="row mt-4">
                            <div className="col-md-10 offset-md-1">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group row">
                                            <label htmlFor="" className="col-sm-3">Crime Number <RequiredField /></label>
                                            <div className="col-sm-3">
                                                <input 
                                                    type="text"
                                                    name="crime_number" 
                                                    className={`form-control ${errors.crime_number ? 'is-invalid' : null}`}
                                                    value={form.crime_number}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, '')
                                                        if(value.length <= 6){
                                                            setForm({...form, [e.target.name]: value})
                                                        }}
                                                    }
                                                    placeholder='FIR No'
                                                />
                                                <div className="invalid-feedback">{ errors.crime_number}</div>
                                            </div>
                                            <div className="col-sm-3">
                                                <input 
                                                    type="text"
                                                    name="crime_year" 
                                                    className={`form-control ${errors.crime_year ? 'is-invalid' : null}`}
                                                    value={form.crime_year}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, '')
                                                        if(value.length <= 4){
                                                            setForm({...form, [e.target.name]: e.target.value})
                                                        }}
                                                    }
                                                    placeholder='FIR Year'
                                                />
                                                <div className="invalid-feedback">{ errors.crime_year}</div>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="" className="col-sm-3">Accused Name <RequiredField /></label>
                                            <div className="col-sm-6">
                                                <select 
                                                    name="accused"
                                                    className={`form-control ${errors.accused ? 'is-invalid' : null}`}
                                                >
                                                    <option value="">Select accused</option>
                                                    { accused.map((a, index) => (
                                                    <option key={index} value={a.litigant_id}>{a.litigant_name}</option>
                                                    ))}
                                                </select>
                                                <div className="invalid-feedback">{ errors.accused }</div>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="" className="col-sm-3">Condition Date <RequiredField /></label>
                                            <div className="col-sm-6">
                                                <input 
                                                    type="date" 
                                                    className={`form-control condition_date-date-picker ${errors.condition_date ? 'is-invalid' : ''}`}
                                                    name="condition_date"
                                                    value={form.condition_date ? form.condition_date : ''}
                                                    placeholder="DD-MM-YYYY"
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} 
                                                    style={{
                                                        backgroundColor: 'transparent',
                                                        border: '1px solid #ccc', 
                                                        padding: '8px',            
                                                    }}
                                                />
                                                <div className="invalid-feedback">{ errors.condition_date }</div>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="" className="col-sm-3">Condition Time <RequiredField /></label>
                                            <div className="col-sm-6">
                                                <input 
                                                    type="text" 
                                                    className={`form-control ${errors.condition_time ? 'is-invalid' : ''}`}
                                                    name="condition_time"
                                                    value={form.condition_time}
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} 
                                                />
                                                <div className="invalid-feedback">{ errors.condition_time }</div>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="" className="col-sm-3">Remarks</label>
                                            <div className="col-sm-6">
                                                <textarea 
                                                    rows={3} 
                                                    className="form-control"
                                                    name="remarks"
                                                    value={form.remarks}
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}  
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="" className="col-sm-3">Accused Present?</label>
                                            <div className="col-sm-6">
                                                <div class="icheck-primary d-inline">
                                                    <input 
                                                        type="checkbox" 
                                                        id="isPresentCheckbox" 
                                                        name="is_present"
                                                        value={form.is_present} 
                                                        checked={form.is_present}
                                                        onChange={(e) => setForm({...form, [e.target.name]: !form.is_present})}
                                                    />
                                                    <label for="isPresentCheckbox"></label>
                                                </div>
                                            </div>
                                        </div>
                                        { form.is_present && (
                                            <React.Fragment>
                                                <div className="form-group row">
                                                    <label htmlFor="" className="col-sm-3">Capture Fingerprint</label>
                                                    <div className="col-sm-6">
                                                        <div class="icheck-primary d-inline">
                                                            <input 
                                                                type="checkbox" 
                                                                id="fingerprintCheckbox" 
                                                                name="is_fingerprint"
                                                                value={form.is_fingerprint} 
                                                                checked={form.is_fingerprint}
                                                                onChange={(e) => setForm({...form, [e.target.name]: !form.is_fingerprint})}
                                                            />
                                                            <label for="fingerprintCheckbox"></label>
                                                            <div className="text-danger">{ errors.is_fingerprint }</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                { form.is_fingerprint && (
                                                    <FingerPrintCapture />
                                                )}
                                                <div className="form-group row">
                                                    <label htmlFor="" className="col-sm-3">Capture Photo</label>
                                                    <div className="col-sm-6">
                                                        <div class="icheck-primary d-inline">
                                                            <input 
                                                                type="checkbox" 
                                                                id="photoCheckbox" 
                                                                name="is_photo"
                                                                value={form.is_photo} 
                                                                checked={form.is_photo}
                                                                onChange={(e) => setForm({...form, [e.target.name]: !form.is_photo})}
                                                            />
                                                            <label for="photoCheckbox">
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                { form.is_photo && (
                                                    <WebcamCapture />
                                                )}
                                            </React.Fragment>
                                        )}                              
                                        <div className="form-group row">
                                            <div className="col-sm-3 offset-md-5">
                                                <Button
                                                    variant='contained'
                                                    color='success'
                                                    onClick={handleSubmit}
                                                >Submit</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                )}
            </div>
        </div>
    )
}

export default ConditionForm