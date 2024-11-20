import api from 'api'
import * as Yup from 'yup'
import React, { useState, useEffect } from 'react'
import { CreateMarkup, RequiredField } from 'utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import FormGroup from 'react-bootstrap/FormGroup'
import FormLabel from 'react-bootstrap/FormLabel'
import Button from '@mui/material/Button'
import Document from 'components/police/Document';
import FIRDetails from 'components/police/FIRDetails';
import Loading from 'components/Loading';
import MaterialDetails from 'components/police/MaterialDetails';
import VehicleDetails from 'components/police/VehicleDetails';


const ResponseCreate = () => {
    const {state} = useLocation()
    const navigate = useNavigate()
    const initialPetition = {
        filing_type: '', 
        court_type: '',
        state: '',
        district: '',
        establishment: '',
        court: ''
    }
    const initialSearchForm = {
        state: 33,
        district:2,
        pdistrict:583,
        police_station: 2958324,
        crime_number: '',
        year: ''
    }
    const initialState = {
        efile_no            : '',
        crime_number        : '',
        crime_year          : '',
        offences            : '',
        date_of_arrest      : '',
        accused_name        : '',
        specific_allegations: '',
        materials_used      : '',
        discharged          : '',
        hospital_name       : '',
        victim_condition    : '',
        injury_particulars  : '',
        investigation_stage : '',
        cnr_number          : '',
        court               : '',
        case_stage          : '',
        next_hearing        : undefined,
        no_of_witness       : undefined,
        previous_case       : '',
        previous_bail       : '',
        other_accused_status: '',
        reason_not_given    : '',
        other_information   : '',
        court_details       : '',
        is_material_seized  : '',
        is_vehicle_seized   : '',
    }
    const[materials, setMaterials] = useState([])
    const[vehicles, setVehicles] = useState([])
    const[arrestModify, setArrestModify] = useState(true)
    const[showAdditionalFields, setShowAdditionalFields] = useState(false)
    const[petition, setPetition] = useState(initialPetition)
    const[searchForm, setSearchForm] = useState(initialSearchForm)
    const[searchErrors, setSearchErrors] = useState({})
    const[loading, setLoading] = useState(false)
    const[fir, setFir] = useState({});
    const[crime, setCrime] = useState({})
    const[accused, setAccused] = useState([])
    const[respondent, setRespondent] = useState([])
    const[firTagged, setFirTagged] = useState(false)

    const[documents, setDocuments] = useState([])

    const addDocument = (document) => {
        setDocuments(prevDocuments => [...prevDocuments, document])
    }

    const deleteDocument = (indexToDelete) => {
        const newDocuments = documents.filter((_, index) => index !== indexToDelete)
        setDocuments(newDocuments)
    }
  
    const searchValidationSchema = Yup.object({
        crime_number: Yup.number().required("This field should not be blank").typeError("This field should be numeric"),
        year: Yup.number().required("This field should not be blank").typeError("This field should be numeric")
    })

    const validationSchema = Yup.object({
        offences: Yup.string().required(),
        date_of_arrest: Yup.date().required().typeError('Invalid date format. Please use YYYY-MM-DD.'),
        accused_name: Yup.string().required(),
        specific_allegations: Yup.string().required(),
        materials_used: Yup.string().required(),
        discharged: Yup.string().required(),
        previous_case: Yup.string().required(),
        previous_bail: Yup.string().required(),
        other_accused_status: Yup.string().required(),
        reason_not_given: Yup.string().required(),
        other_information: Yup.string().required(),
        investigation_stage: Yup.string().required(),
        cnr_number: Yup.string().when("investigation_stage", (investigation_stage, schema) => {
            if(parseInt(investigation_stage) === 2){
                return schema.required('CNR Number required')
            }
        }),
        // court: Yup.string().when("investigation_stage", (investigation_stage, schema) => {
        //     if(parseInt(investigation_stage) === 2){
        //         return schema.required('Court required')
        //     }
        // }),
        case_stage: Yup.string().when("investigation_stage", (investigation_stage, schema) => {
            if(parseInt(investigation_stage) === 2){
                return schema.required('CNR Number required')
            }
        }),
        next_hearing: Yup.date().when("investigation_stage", (investigation_stage, schema) => {
            if(parseInt(investigation_stage) === 2){
                return schema.required('Next hearing required').typeError('Invalid date format. Please use YYYY-MM-DD.')
            }
        }),
        no_of_witness: Yup.number().when("investigation_stage", (investigation_stage, schema) => {
            if(parseInt(investigation_stage) === 2){
                return schema.required('No of witness required').typeError('Number of witnesses must be a valid integer')
                .integer('Number of witnesses must be an integer')
            }
        }),
    })
    
    const[form, setForm] = useState(initialState)
    const[errors, setErrors] = useState({})

    useEffect(() => {
        async function fetchData(){
            const response = await api.get(`police/filing/detail/`, {params:{efile_no:state.efile_no}})
            if(response.status === 200){
                setForm({
                    ...form,
                    efile_no: response.data.petition.efile_number,
                    crime_number: response.data.crime.fir_number,
                    crime_year: response.data.crime.fir_year
                })
                const {petition, litigant, crime} = response.data
                setPetition(petition)
                setAccused(litigant.filter(l=>l.litigant_type === 1))
                setRespondent(litigant.filter(l=>l.litigant_type === 2))
                setCrime(crime)
            }
        }
        fetchData()
    }, [firTagged])

    const handleSearch = async(e) => {
        e.preventDefault()
        try{
            await searchValidationSchema.validate(searchForm, {abortEarly:false})
            setLoading(true)
            const response = await api.post("external/police/tamilnadu/fir-details/", searchForm)
            if(response.status === 200){
                setFir({...fir,
                    state: searchForm.state,
                    district: searchForm.district,
                    police_station: searchForm.police_station,
                    fir_number: searchForm.crime_number,
                    fir_year: searchForm.year,
                    date_of_occurrence  : response.data.date_of_occurrence,
                    investigation_officer: response.data.investigation_officer_name,
                    fir_date_time: response.data.FIR_DATE_Time,
                    place_of_occurrence: response.data.place_of_occurence,
                    gist_of_fir: response.data.gist_of_FIR,
                    gist_in_local: response.data.gist_of_FIR_local_language,
                    complainant_age: response.data.complainant_age,
                    complainant_guardian: response.data.complainant_guardian,
                    complainant_guardian_name: response.data.complainant_guardian_name,
                    complainant_name:response.data.complaintant_name,
                    investigation_officer_rank:response.data.investigation_officer_rank,
                    no_of_accused: response.data.no_of_accused
                })
                setShowAdditionalFields(true)
            }
        }catch(error){
            if(error.inner){
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setSearchErrors(newErrors)
            }
        }finally{
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            await validationSchema.validate(form, {abortEarly:false})
            form.efile_no = state.efile_no
            const post_data = {
                response: form,
                materials,
                vehicles
            }
            const response = await api.post("police/response/create/", post_data)
            if(response.status === 201){
                toast.success("Response added successfully", {
                    theme: "colored"
                })
                setForm(initialState)
                navigate("/police/dashboard")
            }
        }catch(error){
            console.log(error)
            if(error.inner){
                const newErrors = {};
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message;
                });
                setErrors(newErrors);
            }
        }
    }

    return (
    <>
        <ToastContainer />
        { state.efile_no && (
            <div className="content-wrapper">
            <div className="container-fluid mt-3">
                <div className="card card-outline card-primary">
                    <div className="card-header">
                        <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Police Response</strong></h3>
                    </div>
                    <div className="card-body">
                            <div className="card card-outline card-warning">
                            <div className="card-header">
                                <strong>Petition Details</strong>
                            </div>
                            <div className="card-body p-1">
                                <table className="table table-bordered table-striped table-sm">
                                    <tbody>
                                        { parseInt(petition.judiciary?.id) === 2 && (
                                        <>
                                        <tr>
                                            <td>Court Type</td>
                                            <td>{ petition.judiciary?.judiciary_name }</td>
                                            <td>State</td>
                                            <td>{ petition.state.state_name }</td>
                                            <td>District</td>
                                            <td>{ petition.district.district_name }</td>
                                        </tr>    
                                        <tr>
                                            <td>Establishment</td>
                                            <td colSpan={2}>{ petition.establishment.establishment_name }</td>
                                            <td>Court Name</td>
                                            <td colSpan={2}>{ petition.court.court_name }</td>
                                        </tr>
                                        </>
                                        )}
                                        <tr>
                                            <td>Petition&nbsp;Number</td>
                                            <td>
                                                {`${petition.filing_type.type_name}/${petition.filing_number}/${petition.filing_year}`}
                                            </td>
                                            <td>Crime&nbsp;Number</td>
                                            <td>{`${crime.fir_number }/${ crime.fir_year }`}</td>
                                            <td>Date of FIR</td>
                                            <td>{ crime.fir_date_time }</td>
                                        </tr>
                                        <tr>
                                            <td>Police&nbsp;Station</td>
                                            <td>{ crime.police_station ? crime.police_station : null }</td>
                                            <td>Date of Occurence</td>
                                            <td>{ crime.date_of_occurrence }</td>
                                            <td>Complainant&nbsp;Name</td>
                                            <td>{crime.complainant_name}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={6}>
                                                <p>
                                                    <strong>Gist of FIR</strong><br/><br/>
                                                    <span colSpan={5} dangerouslySetInnerHTML={CreateMarkup(crime.gist_of_fir)}></span>
                                                </p>
                                            </td>    
                                        </tr>
                                        <tr>
                                            <td colSpan={6}>
                                                <p>
                                                    <strong>Gist in Local Language</strong><br/><br/>
                                                    <span colSpan={5} dangerouslySetInnerHTML={CreateMarkup(crime.gist_in_local)}></span>
                                                </p>
                                            </td>    
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            </div>
                            <div className="card card-outline card-secondary">
                                <div className="card-header">
                                    <strong>Accused Details</strong>
                                </div>
                                <div className="card-body p-1">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped table-sm">
                                            <thead>
                                                <tr className="bg-secondary">
                                                    <th>#</th>
                                                    <th>Accused Name</th>
                                                    <th>Age</th>
                                                    <th>Rank</th>
                                                    <th>Relative</th>
                                                    <th>Relative Name</th>
                                                    <th>Address</th>
                                                    <th>Photo</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                { accused.filter(l=>l.litigant_type===1).map((a, index) => (
                                                    <tr key={index}>
                                                        <td>{ index+1 }</td>
                                                        <td>{ a.litigant_name }</td>
                                                        <td>{ a.age }</td>
                                                        <td>{ a.rank }</td>
                                                        <td>{ a.relation }</td>
                                                        <td>{ a.relation_name }</td>
                                                        <td>{ a.address }</td>
                                                        <td></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        { crime.fir_number && crime.fir_year ? (
                        <>
                            <div className="card card-outline card-danger">
                                <div className="card-header">
                                    <strong>Response</strong>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            
                                            <div className="col-md-2">
                                                <div className="form-group">
                                                    <label htmlFor="csr_number">CSR Number</label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <div className="form-group">
                                                    <label htmlFor="">Crime Number <RequiredField/></label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control"
                                                        name="crime_number"
                                                        value={form.crime_number}
                                                        readOnly={ form.crime_number !== '' ? true : false }
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <div className="form-group">
                                                    <label htmlFor="">Crime Year<RequiredField/></label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control"
                                                        name="crime_year"
                                                        value={form.crime_year}
                                                        readOnly={ form.crime_year !== '' ? true : false }
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <label htmlFor="">Date of Arrest<RequiredField/></label>
                                                <div className="input-group mb-3">
                                                    <input 
                                                        type="date" 
                                                        className={`form-control ${errors.date_of_arrest ? 'is-invalid' : ''}`} 
                                                        name="date_of_arrest"
                                                        value={form.date_of_arrest}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    />
                                                    <div className="invalid-feedback">
                                                        { errors.date_of_arrest }
                                                    </div>
                                                    <div className="input-group-append">
                                                        <button 
                                                            className="btn btn-outline-primary" 
                                                            type="button"
                                                            onClick={(e) => setArrestModify(!arrestModify)}
                                                        >Modify</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <FormGroup className='mb-3'>
                                                    <FormLabel>Offences</FormLabel>
                                                    <FormControl 
                                                        as="textarea" 
                                                        rows={2}
                                                        name="offences"
                                                        value={form.offences}
                                                        className={`form-control ${errors.offences ? 'is-invalid' : null }`}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    ></FormControl>
                                                    <div className="invalid-feedback">
                                                        { errors.offences}
                                                    </div>
                                                </FormGroup>
                                            </div>
                                            <div className="col-md-6">
                                                <FormGroup className='mb-3'>
                                                    <FormLabel>Name of the accused/suspected person(s)</FormLabel>
                                                    <FormControl 
                                                        as="textarea"
                                                        name="accused_name"
                                                        value={form.accused_name}
                                                        className={`form-control ${errors.accused_name ? 'is-invalid' : null }`}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    ></FormControl>
                                                    <div className="invalid-feedback">
                                                        { errors.accused_name }
                                                    </div>
                                                </FormGroup>
                                            </div>
                                            <div className="col-md-6">
                                                <FormGroup className='mb-3'>
                                                    <FormLabel>Specific Allegations /Overt Acts against the Petitioner(s)</FormLabel>
                                                    <FormControl 
                                                        as="textarea"
                                                        rows={2}
                                                        name="specific_allegations"
                                                        className={`form-control ${errors.specific_allegations ? 'is-invalid' : null }`}
                                                        value={form.specific_allegations}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    ></FormControl>
                                                    <div className="invalid-feedback">
                                                        { errors.specific_allegations }
                                                    </div>
                                                </FormGroup>
                                            </div>
                                            <div className="col-md-6np[">
                                                <FormGroup className='mb-3'>
                                                    <FormLabel>Materials & Circumstances against the Petitioner</FormLabel>
                                                    <FormControl 
                                                        as="textarea" 
                                                        rows={2}
                                                        name="materials_used"
                                                        className={`form-control ${errors.materials_used ? 'is-invalid' : null }`}
                                                        value={form.materials_used}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    ></FormControl>
                                                    <div className="invalid-feedback">
                                                        { errors.materials_used }
                                                    </div>
                                                </FormGroup>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-group row">
                                                    <label className="col-sm-3">Injured discharged</label>
                                                    <div className="col-sm-8">
                                                        <div className="icheck-success d-inline mx-2">
                                                            <input 
                                                                type="radio" 
                                                                id="radioDischarged1" 
                                                                name="discharged" 
                                                                onChange={(e) => setForm({...form, [e.target.name] : 1})} 
                                                                checked={parseInt(form.discharged) === 1 ? true : false}
                                                            />
                                                            <label htmlFor="radioDischarged1">Yes</label>
                                                        </div>
                                                        <div className="icheck-danger d-inline mx-2">
                                                            <input 
                                                                type="radio" 
                                                                id="radioDischarged2" 
                                                                name="discharged" 
                                                                onChange={(e) => setForm({...form, [e.target.name] : 2})} 
                                                                checked={parseInt(form.discharged) === 2 ? true : false}/>
                                                            <label htmlFor="radioDischarged2">No</label>
                                                        </div>
                                                        <div className="icheck-primary d-inline mx-2">
                                                            <input 
                                                                type="radio" 
                                                                id="radioDischarged3" 
                                                                name="discharged" 
                                                                onChange={(e) => setForm({...form, [e.target.name] : 3})} 
                                                                checked={parseInt(form.discharged) === 3 ? true : false}/>
                                                            <label htmlFor="radioDischarged3">Not Applicable</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                { parseInt(form.discharged) === 2 && (
                                                <>
                                                    <div className="form-group row">
                                                        <label htmlFor="" className="col-sm-3">Hospital Name</label>
                                                        <div className="col-sm-9">
                                                            <input 
                                                                type="text" 
                                                                className="form-control" 
                                                                name="hospital_name"
                                                                value={form.hospital_name}
                                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label htmlFor="" className="col-sm-3">Condition of Victim</label>
                                                        <div className="col-sm-9">
                                                            <input 
                                                                type="text" 
                                                                className="form-control"
                                                                name="victim_condition" 
                                                                value={form.victim_condition}
                                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label htmlFor="" className="col-sm-3">Particulars of Injury</label>
                                                        <div className="col-sm-9">
                                                            <FormControl 
                                                                as="textarea" 
                                                                rows={2}
                                                                name="injury_particulars"
                                                                value={form.injury_particulars}
                                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                            ></FormControl>
                                                        </div>
                                                    </div>
                                                </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3">Material seized?</label>
                                            <div className="col-sm-8">
                                                <div className="icheck-success d-inline mx-2">
                                                    <input 
                                                        type="radio" 
                                                        id="radioseized1" 
                                                        name="is_material_seized" 
                                                        onChange={(e) => setForm({...form, [e.target.name] : 1})} 
                                                        checked={parseInt(form.is_material_seized) === 1 ? true : false}
                                                    />
                                                    <label htmlFor="radioseized1">Yes</label>
                                                </div>
                                                <div className="icheck-danger d-inline mx-2">
                                                    <input 
                                                        type="radio" 
                                                        id="radioseized2" 
                                                        name="is_material_seized" 
                                                        onChange={(e) => setForm({...form, [e.target.name] : 2})} 
                                                        checked={parseInt(form.is_material_seized) === 2 ? true : false}/>
                                                    <label htmlFor="radioseized2">No</label>
                                                </div>
                                                <div className="icheck-primary d-inline mx-2">
                                                    <input 
                                                        type="radio" 
                                                        id="radioseized3" 
                                                        name="is_material_seized" 
                                                        onChange={(e) => setForm({...form, [e.target.name] : 3})} 
                                                        checked={parseInt(form.is_material_seized) === 3 ? true : false}/>
                                                    <label htmlFor="radioseized3">Not Applicable</label>
                                                </div>
                                            </div>
                                        </div>
                                        { parseInt(form.is_material_seized) === 1 && (
                                            <MaterialDetails 
                                                materials={materials} 
                                                setMaterials={setMaterials} 
                                             />
                                        )}
                                        <div className="form-group row">
                                            <label className="col-sm-3">Vechicle seized?</label>
                                            <div className="col-sm-8">
                                                <div className="icheck-success d-inline mx-2">
                                                    <input 
                                                        type="radio" 
                                                        id="radiovehicleseized1" 
                                                        name="is_vehicle_seized" 
                                                        onChange={(e) => setForm({...form, [e.target.name] : 1})} 
                                                        checked={parseInt(form.is_vehicle_seized) === 1 ? true : false}
                                                    />
                                                    <label htmlFor="radiovehicleseized1">Yes</label>
                                                </div>
                                                <div className="icheck-danger d-inline mx-2">
                                                    <input 
                                                        type="radio" 
                                                        id="radiovehicleseized2" 
                                                        name="is_vehicle_seized" 
                                                        onChange={(e) => setForm({...form, [e.target.name] : 2})} 
                                                        checked={parseInt(form.is_vehicle_seized) === 2 ? true : false}/>
                                                    <label htmlFor="radiovehicleseized2">No</label>
                                                </div>
                                                <div className="icheck-primary d-inline mx-2">
                                                    <input 
                                                        type="radio" 
                                                        id="radiovehicleseized3" 
                                                        name="is_vehicle_seized" 
                                                        onChange={(e) => setForm({...form, [e.target.name] : 3})} 
                                                        checked={parseInt(form.is_vehicle_seized) === 3 ? true : false}/>
                                                    <label htmlFor="radioseized3">Not Applicable</label>
                                                </div>
                                            </div>
                                        </div>
                                        { parseInt(form.is_vehicle_seized) === 1 && (
                                            <VehicleDetails 
                                                vehicles={vehicles}
                                                setVehicles={setVehicles}
                                            />
                                        )}
                                        <div className="row">
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="">Stage of Investigation / Trial</label>
                                                    <select 
                                                        name="investigation_stage"
                                                        value={form.investigation_stage}
                                                        className={`form-control ${errors.investigation_stage ? 'is-invalid' : null}`}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="1">Pending Investigation</option>
                                                        <option value="2">Chargesheet filed</option>
                                                    </select>
                                                    <div className="invalid-feedback">
                                                        { errors.investigation_stage }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="">Limitation date for filing Charge Sheet(As per Act)</label>
                                                    <input type="date" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                        { parseInt(form.investigation_stage) === 2 && (
                                        <div className="row mt-3">    
                                            <div className="col-md-2">
                                                <FormGroup className="mb-3">
                                                    <label htmlFor="">CNR Number</label>
                                                    <FormControl
                                                        name="cnr_number"
                                                        className={`form-control ${errors.cnr_number ? 'is-invalid' : ''}`}
                                                        value={form.cnr_number}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    ></FormControl>
                                                    <div className="invalid-feedback">
                                                        { errors.cnr_number }
                                                    </div>
                                                </FormGroup>
                                            </div>
                                            <div className="col-md-3">
                                                <FormGroup className="mb-3">
                                                    <label htmlFor="">Court</label>
                                                    <select 
                                                        name="court" 
                                                        className={`form-control ${errors.cnr_number ? 'is-invalid' : ''}`}
                                                        value={form.court}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    >
                                                        <option value="">Select Court</option>
                                                    </select>
                                                    <div className="invalid-feedback">
                                                        { errors.court }
                                                    </div>
                                                </FormGroup>
                                            </div>
                                            <div className="col-md-2">
                                                <FormGroup className="mb-3">
                                                    <label htmlFor="">Stage of the Case</label>
                                                    <FormControl
                                                        name="case_stage"
                                                        className={`form-control ${errors.case_stage ? 'is-invalid' : ''}`}
                                                        value={form.case_stage}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    ></FormControl>
                                                    <div className="invalid-feedback">
                                                        { errors.case_stage }
                                                    </div>
                                                </FormGroup>
                                            </div>
                                            <div className="col-md-2">
                                                <FormGroup className="mb-3">
                                                    <label htmlFor="">Next Hearing Date</label>
                                                    <FormControl 
                                                        type="date"
                                                        className={`form-control ${errors.next_hearing ? 'is-invalid' : ''}`}
                                                        name="next_hearing"
                                                        value={form.next_hearing}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    ></FormControl>
                                                    <div className="invalid-feedback">
                                                        { errors.next_hearing }
                                                    </div>
                                                </FormGroup>
                                            </div>
                                            <div className="col-md-2">
                                                <FormGroup className="mb-3">
                                                    <label htmlFor="">No. Of. Witness</label>
                                                    <FormControl
                                                        type="number"
                                                        name="no_of_witness"
                                                        className={`form-control ${errors.no_of_witness ? 'is-invalid' : ''}`}
                                                        value={form.no_of_witness}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value })}
                                                    ></FormControl>
                                                    <div className="invalid-feedback">
                                                        { errors.no_of_witness }
                                                    </div>
                                                </FormGroup>
                                            </div>
                                        </div>
                                        )}
                                        <div className="row">
                                            <div className="col-md-4">
                                                <FormGroup className="mb-3">
                                                    <FormLabel>Antecedents/Previous Cases against the Petitioner(s)</FormLabel>
                                                    <textarea 
                                                        name="previous_case"
                                                        value={form.previous_case}
                                                        className={`form-control ${errors.previous_case ? 'is-invalid' : null}`}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value })}
                                                    ></textarea>
                                                    <div className="invalid-feedback">
                                                        { errors.previous_case}
                                                    </div>
                                                </FormGroup>
                                            </div>
                                            <div className="col-md-4">
                                                <FormGroup className="mb-3">
                                                    <FormLabel>Details of Previous Bail Applications</FormLabel>
                                                    <FormControl 
                                                        as="textarea" 
                                                        rows={2}
                                                        name="previous_bail"
                                                        className={`form-control ${errors.previous_bail ? 'is-invalid' : null}`}
                                                        value={form.previous_bail}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    ></FormControl>
                                                    <div className="invalid-feedback">
                                                        { errors.previous_bail }
                                                    </div>
                                                </FormGroup>
                                            </div>
                                            <div className="col-md-4">
                                                <FormGroup className="mb-3">
                                                    <FormLabel>Status of other accused</FormLabel>
                                                    <FormControl 
                                                        as="textarea" 
                                                        rows={2}
                                                        name="other_accused_status"
                                                        value={form.other_accused_status}
                                                        className={`form-control ${errors.other_accused_status ? 'is-invalid' : null}`}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                        ></FormControl>
                                                        <div className="invalid-feedback">
                                                            { errors.other_accused_status }
                                                        </div>
                                                </FormGroup>
                                            </div>
                                            <div className="col-md-4">
                                                <FormGroup className="mb-3">
                                                    <FormLabel>Why Bail/AB Should Not be Granted</FormLabel>
                                                    <FormControl 
                                                        as="textarea" 
                                                        rows={2}
                                                        name="reason_not_given"
                                                        className={`form-control ${errors.reason_not_given ? 'is-invalid' : null}`}
                                                        value={form.reason_not_given}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    ></FormControl>
                                                    <div className="invalid-feedback">
                                                        { errors.reason_not_given }
                                                    </div>
                                                </FormGroup>
                                            </div>
                                            <div className="col-md-4">
                                                <FormGroup className="mb-3">
                                                    <FormLabel>Any other Information</FormLabel>
                                                    <FormControl 
                                                        as="textarea" 
                                                        rows={2}
                                                        name="other_information"
                                                        className={`form-control ${errors.other_information ? 'is-invalid' : null}`}
                                                        value={form.other_information}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    ></FormControl>
                                                    <div className="invalid-feedback">
                                                        { errors.other_information }
                                                    </div>
                                                </FormGroup>
                                            </div>
                                            <div className="col-md-4">
                                                <FormGroup className="mb-3">
                                                    <FormLabel>Court Details: FIR/ Committal/Trial/ Appellate</FormLabel>
                                                    <FormControl 
                                                        as="textarea" 
                                                        rows={2}
                                                        name="court_details"
                                                        value={form.court_details}
                                                        className={`form-control ${errors.court_details ? 'is-invalid' : null}`}
                                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                    ></FormControl>
                                                    <div className="invalid-feedback">
                                                        { errors.court_details }
                                                    </div>
                                                </FormGroup>
                                            </div>
                                            <div className="col-md-12">
                                                <Document 
                                                    documents={documents}
                                                    setDocuments={setDocuments}
                                                    addDocument={addDocument}
                                                    deleteDocument={deleteDocument}
                                                />
                                            </div>
                                            <div className="col-md-12">
                                                <Button 
                                                    variant='contained' 
                                                    color="success"
                                                    type='submit'
                                                >Submit</Button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </>
                        ): (
                        <>
                        <div className="row">
                            <div className="col-md-6 offset-md-3">
                                <div className="row" style={{border:"1px solid #ffc107"}}>
                                    <div className="col-md-12 p-0">
                                        <p className="bg-warning py-1 px-3"><strong>FIR Search</strong></p>
                                    </div>
                                    <div className="col-md-3 offset-2">
                                        <Form.Group className="mb-3">
                                            <Form.Label>FIR Number<RequiredField/></Form.Label>
                                            <Form.Control 
                                                type="text"
                                                name="crime_number"
                                                className={`${searchErrors.crime_number ? 'is-invalid': ''}`}
                                                value={searchForm.crime_number}
                                                onChange={(e) => setSearchForm({...searchForm, [e.target.name]: e.target.value})}
                                            ></Form.Control>
                                            <div className="invalid-feedback">{ searchErrors.crime_number }</div>
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-3">
                                        <Form.Group>
                                            <Form.Label>Year<RequiredField/></Form.Label>
                                            <Form.Control 
                                                type="text"
                                                name="year"
                                                className={`${searchErrors.year ? 'is-invalid' : ''}`}
                                                value={searchForm.year}
                                                onChange={(e) => setSearchForm({...searchForm, [e.target.name]: e.target.value})}
                                            ></Form.Control>
                                            <div className="invalid-feedback">{ searchErrors.year }</div>
                                        </Form.Group>   
                                    </div>  
                                    <div className="col-md-2 mt-4 pt-2">
                                        <Form.Group>
                                            <Button 
                                                variant="contained"
                                                onClick={ handleSearch }
                                            ><i className="fa fa-search mr-2"></i>Search</Button>
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-12 d-flex justify-content-center">
                                        { showAdditionalFields && (
                                            <FIRDetails fir={fir} efile_no={state.efile_no} setFirTagged={setFirTagged}/>
                                        )}
                                    </div> 
                                </div>
                            </div>
                        </div>
                        </>
                        )}
    
                    </div>
                </div>
            </div>  
        </div>    
        )}     
        { loading && <Loading />} 
    </>
  )
}

export default ResponseCreate