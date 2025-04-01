import api from 'api'
import * as Yup from 'yup'
import React, { useState, useEffect, useContext } from 'react'
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
import Loading from 'components/utils/Loading';
import MaterialDetails from 'components/police/MaterialDetails';
import VehicleDetails from 'components/police/VehicleDetails';
import { handleMobileChange, handleNumberChange, validateEmail, handleAgeChange, handleBlur, handleNameChange, handlePincodeChange } from 'components/validation/validations';
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";
import { LanguageContext } from 'contexts/LanguageContex';
import { useTranslation } from 'react-i18next';
import { BaseContext } from 'contexts/BaseContext';


const ResponseCreate = () => {
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);
    const { state } = useLocation()
    const {setEfileNumber} = useContext(BaseContext)
    const navigate = useNavigate()
    const initialPetition = {
        filing_type: '',
        court_type: '',
        state: '',
        district: '',
        establishment: '',
        court: '',
        pdistrict_id: ''
    }
    const initialSearchForm = {
        state: 33,
        district: 2,
        pdistrict: 583,
        police_station: 2958324,
        crime_number: '',
        year: ''
    }
    const initialState = {
        efile_no: '',
        crime_number: '',
        crime_year: '',
        offences: '',
        date_of_arrest: '',
        accused_name: '',
        specific_allegations: '',
        materials_used: '',
        discharged: '',
        hospital_name: '',
        victim_condition: '',
        injury_particulars: '',
        investigation_stage: '',
        cnr_number: '',
        court: '',
        case_stage: '',
        next_hearing: '',
        no_of_witness: '',
        previous_case: '',
        previous_bail: '',
        other_accused_status: '',
        reason_not_given: '',
        other_information: '',
        court_details: '',
        is_material_seized: '',
        is_vehicle_seized: '',
        limitation_date: '',
        csr_number: '',
    }
    const [materials, setMaterials] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [arrestModify, setArrestModify] = useState(true)
    const [showAdditionalFields, setShowAdditionalFields] = useState(false)
    const [petition, setPetition] = useState(initialPetition)
    const [searchForm, setSearchForm] = useState(initialSearchForm)
    const [searchErrors, setSearchErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [fir, setFir] = useState({});
    const [crime, setCrime] = useState({})
    const [accused, setAccused] = useState([])
    const [respondent, setRespondent] = useState([])
    const [firTagged, setFirTagged] = useState(false)
    const [courts, setCourts] = useState([]);

    const [documents, setDocuments] = useState([])

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
        csr_number: Yup.string(),
        offences: Yup.string().required(),
        date_of_arrest: Yup.date().required(),
        accused_name: Yup.string().required(),
        specific_allegations: Yup.string().required(),
        materials_used: Yup.string().required(),
        // discharged: Yup.string().required(),
        previous_case: Yup.string().required(),
        previous_bail: Yup.string().required(),
        other_accused_status: Yup.string().required(),
        reason_not_given: Yup.string().required(),
        other_information: Yup.string().required(),
        investigation_stage: Yup.string().required(),
        cnr_number: Yup.string().when("investigation_stage", (investigation_stage, schema) => {
            if (parseInt(investigation_stage) === 2) {
                return schema.required('CNR Number required')
            }
        }),
        // court: Yup.string().when("investigation_stage", (investigation_stage, schema) => {
        //     if(parseInt(investigation_stage) === 2){
        //         return schema.required('Court required')
        //     }
        // }),
        // case_stage: Yup.string().when("investigation_stage", (investigation_stage, schema) => {
        //     if(parseInt(investigation_stage) === 2){
        //         return schema.required('CNR Number required')
        //     }
        // }),
        // next_hearing: Yup.date().when("investigation_stage", (investigation_stage, schema) => {
        //     if(parseInt(investigation_stage) === 2){
        //         return schema.required('Next hearing required')
        //     }
        // }),
        // no_of_witness: Yup.number().when("investigation_stage", (investigation_stage, schema) => {
        //     if(parseInt(investigation_stage) === 2){
        //         return schema.required('No of witness required').typeError('Number of witnesses must be a valid integer')
        //         .integer('Number of witnesses must be an integer')
        //     }
        // }),
    })

    const [form, setForm] = useState(initialState)
    const [errors, setErrors] = useState(initialState)

    const date_of_arrest_Display = (date) => {
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const date_of_arrest_Backend = (date) => {
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    };

    const next_hearing_Display = (date) => {
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const next_hearing_Backend = (date) => {
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    };

    const formatDate1 = (date) => {
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const date_of_arrest = flatpickr(".date_of_arrest-date-picker", {
            dateFormat: "d/m/Y",
            maxDate: "today",
            defaultDate: form.date_of_arrest ? date_of_arrest_Display(new Date(form.date_of_arrest)) : '',
            onChange: (selectedDates) => {
                const formattedDate = selectedDates[0] ? date_of_arrest_Backend(selectedDates[0]) : "";
                setForm({ ...form, date_of_arrest: formattedDate });
            },
        });

        return () => {
            if (date_of_arrest && typeof date_of_arrest.destroy === "function") {
                date_of_arrest.destroy();
            }
        };
    }, [form]);

    useEffect(() => {
        const limitation_date = flatpickr(".limitation_date-date-picker", {
            dateFormat: "d/m/Y",
            maxDate: "today",
            defaultDate: form.limitation_date,
            onChange: (selectedDates1) => {
                const formattedDate1 = selectedDates1[0] ? formatDate1(selectedDates1[0]) : "";
                setForm({ ...form, limitation_date: formattedDate1 });
            },
        });

        return () => {
            if (limitation_date && typeof limitation_date.destroy === "function") {
                limitation_date.destroy();
            }
        };
    }, [form]);

    useEffect(() => {
        const next_hearing = flatpickr(".next_hearing-date-picker", {
            dateFormat: "d/m/Y",
            minDate: "today",
            defaultDate: form.next_hearing ? next_hearing_Display(new Date(form.next_hearing)) : '',
            onChange: (selectedDates) => {
                const formattedDate = selectedDates[0] ? next_hearing_Backend(selectedDates[0]) : "";
                setForm({ ...form, next_hearing: formattedDate });
            },
        });

        return () => {
            if (next_hearing && typeof next_hearing.destroy === "function") {
                next_hearing.destroy();
            }
        };
    }, [form]);

    useEffect(() => {
        async function fetchData() {
            const response = await api.get(`police/filing/detail/`, { params: { efile_no: state.efile_no } })
            if (response.status === 200) {
                setForm({
                    ...form,
                    efile_no: response.data.petition.efile_number,
                    crime_number: response.data.petition.fir_number,
                    crime_year: response.data.petition.fir_year
                })
                setEfileNumber(response.data.petition.efile_number)
                const { petition, litigant, crime } = response.data
                setPetition(petition)
                setAccused(litigant.filter(l => l.litigant_type === 1))
                setRespondent(litigant.filter(l => l.litigant_type === 2))
                setCrime(crime)
            }
        }
        fetchData()
    }, [firTagged])

    useEffect(() => {
        async function fetchCourts() {
            try {
                const response = await api.get('/base/jurisdiction-courts/');
                if (response.status === 200) {
                    setCourts(response.data.map(item => item.court));
                }
            } catch (error) {
                console.error('Error fetching courts:', error);
            }
        }

        fetchCourts();
    }, []);

    const handleCourtChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };


    const handleSearch = async (e) => {
        e.preventDefault()
        try {
            await searchValidationSchema.validate(searchForm, { abortEarly: false })
            setLoading(true)
            const data = {
                state: petition.state?.state_code,
                district: petition.district?.district_code,
                pdistrict: petition.police_station?.district_code,
                police_station: petition.police_station?.cctns_code,
                fir_number: searchForm.crime_number,
                fir_year: searchForm.year
            }
            const response = await api.post("external/police/fir-search/", data)
            if (response.status === 200) {
                sessionStorage.setItem("api_id", response.data.api_id)
                setFir({
                    ...fir,
                    state: petition.state?.state_code,
                    district: petition.district?.district_code,
                    police_station: petition.police_station?.cctns_code,
                    fir_number: searchForm.crime_number,
                    fir_year: searchForm.year,
                    date_of_occurrence: response.data.date_of_occurrence,
                    investigation_officer: response.data.investigation_officer_name,
                    fir_date_time: response.data.FIR_DATE_Time,
                    place_of_occurrence: response.data.place_of_occurence,
                    gist_of_fir: response.data.gist_of_FIR,
                    gist_in_local: response.data.gist_of_FIR_local_language,
                    complainant_age: response.data.complainant_age,
                    complainant_guardian: response.data.complainant_guardian,
                    complainant_guardian_name: response.data.complainant_guardian_name,
                    complainant_name: response.data.complaintant_name,
                    investigation_officer_rank: response.data.investigation_officer_rank,
                    no_of_accused: response.data.no_of_accused
                })
                setShowAdditionalFields(true)
            }
        } catch (error) {
            if (error.inner) {
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setSearchErrors(newErrors)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            // await validationSchema.validate(form, { abortEarly: false })
            form.efile_no = state.efile_no
            const post_data = {
                response: form,
                materials,
                vehicles,
                documents
            } 
            console.log(post_data);
            const response = await api.post("police/response/create/", post_data)
            if (response.status === 201) {
                toast.success("Response added successfully", {
                    theme: "colored"
                })
                setForm(initialState)
                navigate("/police/dashboard")
            }
        } catch (error) {
            console.log(error)
            if (error.inner) {
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
            {state.efile_no && (
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
                                                {parseInt(petition.judiciary?.id) === 2 && (
                                                    <>
                                                        <tr>
                                                            <td>Court Type</td>
                                                            <td>{petition.judiciary?.judiciary_name}</td>
                                                            <td>State</td>
                                                            <td>{petition.state.state_name}</td>
                                                            <td>District</td>
                                                            <td>{petition.district.district_name}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Establishment</td>
                                                            <td colSpan={2}>{petition.establishment.establishment_name}</td>
                                                            <td>Court Name</td>
                                                            <td colSpan={2}>{petition.court.court_name}</td>
                                                        </tr>
                                                    </>
                                                )}
                                                <tr>
                                                    <td>Petition&nbsp;Number</td>
                                                    <td>
                                                        {`${petition.filing_type?.type_name}/${petition.filing_number}/${petition.filing_year}`}
                                                    </td>
                                                    <td>Crime&nbsp;Number</td>
                                                    <td>{`${crime.fir_number}/${crime.fir_year}`}</td>
                                                    <td>Date of FIR</td>
                                                    <td>{crime.fir_date_time}</td>
                                                </tr>
                                                <tr>
                                                    <td>Police&nbsp;Station</td>
                                                    <td>{petition.police_station ? petition.police_station.station_name : null}</td>
                                                    <td>Date of Occurence</td>
                                                    <td>{crime.date_of_occurrence}</td>
                                                    <td>Complainant&nbsp;Name</td>
                                                    <td>{crime.complainant_name}</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={6}>
                                                        <p>
                                                            <strong>Gist of FIR</strong><br /><br />
                                                            <span colSpan={5} dangerouslySetInnerHTML={CreateMarkup(crime.gist_of_fir)}></span>
                                                        </p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={6}>
                                                        <p>
                                                            <strong>Gist in Local Language</strong><br /><br />
                                                            <span colSpan={5} dangerouslySetInnerHTML={CreateMarkup(crime.gist_of_fir_in_local)}></span>
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
                                                    {accused
                                                        .filter((l) => l.litigant_type === 1)
                                                        .map((a, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{a.litigant_name}</td>
                                                                <td>{a.age}</td>
                                                                <td>{a.rank}</td>
                                                                <td>{a.relation}</td>
                                                                <td>{a.relation_name}</td>
                                                                <td>{a.address}</td>
                                                                <td></td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                { crime.fir_no && crime.fir_year ? (
                                    <React.Fragment>
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
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="csr_number"
                                                                    value={form.csr_number}
                                                                    onChange={(e) => handleNumberChange(e, setForm, form, 'csr_number')}
                                                                
                                                                />
                                                                <div className="invalid-feedback">
                                                                    {errors.csr_number}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <div className="form-group">
                                                                <label htmlFor="">Crime Number <RequiredField /></label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="crime_number"
                                                                    value={form.crime_number}
                                                                    readOnly={form.crime_number !== '' ? true : false}
                                                                    onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <div className="form-group">
                                                                <label htmlFor="">Crime Year<RequiredField /></label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="crime_year"
                                                                    value={form.crime_year}
                                                                    readOnly={form.crime_year !== '' ? true : false}
                                                                    onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <label htmlFor="">Date of Arrest<RequiredField /></label>
                                                            <div className="input-group mb-3">
                                                                <input
                                                                    type="date"
                                                                    className={`form-control date_of_arrest-date-picker ${errors.date_of_arrest ? 'is-invalid' : ''}`}
                                                                    name="date_of_arrest"
                                                                    value={form.date_of_arrest ? form.date_of_arrest : ''}
                                                                    placeholder="DD/MM/YYYY"
                                                                    onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                                    style={{
                                                                        backgroundColor: 'transparent',
                                                                        border: '1px solid #ccc', 
                                                                        padding: '8px',            
                                                                    }}
                                                                />
                                                                <div className="invalid-feedback">
                                                                    {errors.date_of_arrest}
                                                                </div>
                                                                {/* <div className="input-group-append">
                                                        <button 
                                                            className="btn btn-outline-primary" 
                                                            type="button"
                                                            onClick={(e) => setArrestModify(!arrestModify)}
                                                        >Modify</button>
                                                    </div> */}
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
                                                                    className={`form-control ${errors.offences ? 'is-invalid' : null}`}
                                                                    onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                                ></FormControl>
                                                                <div className="invalid-feedback">
                                                                    {errors.offences}
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
                                                                    className={`form-control ${errors.accused_name ? 'is-invalid' : null}`}
                                                                    onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                                ></FormControl>
                                                                <div className="invalid-feedback">
                                                                    {errors.accused_name}
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
                                                                    className={`form-control ${errors.specific_allegations ? 'is-invalid' : null}`}
                                                                    value={form.specific_allegations}
                                                                    onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                                ></FormControl>
                                                                <div className="invalid-feedback">
                                                                    {errors.specific_allegations}
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
                                                                    className={`form-control ${errors.materials_used ? 'is-invalid' : null}`}
                                                                    value={form.materials_used}
                                                                    onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                                ></FormControl>
                                                                <div className="invalid-feedback">
                                                                    {errors.materials_used}
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
                                                                            onChange={(e) => setForm({ ...form, [e.target.name]: 1 })}
                                                                            checked={parseInt(form.discharged) === 1 ? true : false}
                                                                        />
                                                                        <label htmlFor="radioDischarged1">Yes</label>
                                                                    </div>
                                                                    <div className="icheck-danger d-inline mx-2">
                                                                        <input
                                                                            type="radio"
                                                                            id="radioDischarged2"
                                                                            name="discharged"
                                                                            onChange={(e) => setForm({ ...form, [e.target.name]: 2 })}
                                                                            checked={parseInt(form.discharged) === 2 ? true : false} />
                                                                        <label htmlFor="radioDischarged2">No</label>
                                                                    </div>
                                                                    <div className="icheck-primary d-inline mx-2">
                                                                        <input
                                                                            type="radio"
                                                                            id="radioDischarged3"
                                                                            name="discharged"
                                                                            onChange={(e) => setForm({ ...form, [e.target.name]: 3 })}
                                                                            checked={parseInt(form.discharged) === 3 ? true : false} />
                                                                        <label htmlFor="radioDischarged3">Not Applicable</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {parseInt(form.discharged) === 2 && (
                                                                <>
                                                                    <div className="form-group row">
                                                                        <label htmlFor="" className="col-sm-3">Hospital Name</label>
                                                                        <div className="col-sm-9">
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                name="hospital_name"
                                                                                value={form.hospital_name}
                                                                                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
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
                                                                                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
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
                                                                                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
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
                                                                    onChange={(e) => setForm({ ...form, [e.target.name]: 1 })}
                                                                    checked={parseInt(form.is_material_seized) === 1 ? true : false}
                                                                />
                                                                <label htmlFor="radioseized1">Yes</label>
                                                            </div>
                                                            <div className="icheck-danger d-inline mx-2">
                                                                <input
                                                                    type="radio"
                                                                    id="radioseized2"
                                                                    name="is_material_seized"
                                                                    onChange={(e) => setForm({ ...form, [e.target.name]: 2 })}
                                                                    checked={parseInt(form.is_material_seized) === 2 ? true : false} />
                                                                <label htmlFor="radioseized2">No</label>
                                                            </div>
                                                            <div className="icheck-primary d-inline mx-2">
                                                                <input
                                                                    type="radio"
                                                                    id="radioseized3"
                                                                    name="is_material_seized"
                                                                    onChange={(e) => setForm({ ...form, [e.target.name]: 3 })}
                                                                    checked={parseInt(form.is_material_seized) === 3 ? true : false} />
                                                                <label htmlFor="radioseized3">Not Applicable</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {parseInt(form.is_material_seized) === 1 && (
                                                        <MaterialDetails materials={materials} setMaterials={setMaterials} />
                                                    )}
                                                    <div className="form-group row">
                                                        <label className="col-sm-3">Vechicle seized?</label>
                                                        <div className="col-sm-8">
                                                            <div className="icheck-success d-inline mx-2">
                                                                <input
                                                                    type="radio"
                                                                    id="radiovehicleseized1"
                                                                    name="is_vehicle_seized"
                                                                    onChange={(e) => setForm({ ...form, [e.target.name]: 1 })}
                                                                    checked={parseInt(form.is_vehicle_seized) === 1 ? true : false}
                                                                />
                                                                <label htmlFor="radiovehicleseized1">Yes</label>
                                                            </div>
                                                            <div className="icheck-danger d-inline mx-2">
                                                                <input
                                                                    type="radio"
                                                                    id="radiovehicleseized2"
                                                                    name="is_vehicle_seized"
                                                                    onChange={(e) => setForm({ ...form, [e.target.name]: 2 })}
                                                                    checked={parseInt(form.is_vehicle_seized) === 2 ? true : false} />
                                                                <label htmlFor="radiovehicleseized2">No</label>
                                                            </div>
                                                            <div className="icheck-primary d-inline mx-2">
                                                                <input
                                                                    type="radio"
                                                                    id="radiovehicleseized3"
                                                                    name="is_vehicle_seized"
                                                                    onChange={(e) => setForm({ ...form, [e.target.name]: 3 })}
                                                                    checked={parseInt(form.is_vehicle_seized) === 3 ? true : false} />
                                                                <label htmlFor="radioseized3">Not Applicable</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {parseInt(form.is_vehicle_seized) === 1 && (
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
                                                                    onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                                >
                                                                    <option value="">Select</option>
                                                                    <option value="1">Pending Investigation</option>
                                                                    <option value="2">Chargesheet filed</option>
                                                                </select>
                                                                <div className="invalid-feedback">
                                                                    {errors.investigation_stage}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="" style={{ width: '380px', }} >Limitation date for filing Charge Sheet(As per Act)</label>
                                                                <input type="date" className={`form-control limitation_date-date-picker ${errors.limitation_date ? 'is-invalid' : ''}`}
                                                                    name="limitation_date"
                                                                    value={form.limitation_date}
                                                                    // readOnly={form.is_produced === true ? false : true }
                                                                    onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                                    placeholder="DD/MM/YYYY"
                                                                    style={{
                                                                        backgroundColor: 'transparent',
                                                                        border: '1px solid #ccc', 
                                                                        padding: '8px',            
                                                                    }}

                                                                />
                                                                <div className="invalid-feedback">
                                                                    {errors.limitation_date}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {parseInt(form.investigation_stage) === 2 && (
                                                        <div className="row mt-3">
                                                            <div className="col-md-2">
                                                                <FormGroup className="mb-3">
                                                                    <label htmlFor="">CNR Number</label>
                                                                    <FormControl
                                                                        name="cnr_number"
                                                                        className={`form-control ${errors.cnr_number ? 'is-invalid' : ''}`}
                                                                        value={form.cnr_number}
                                                                        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                                    ></FormControl>
                                                                    <div className="invalid-feedback">
                                                                        {errors.cnr_number}
                                                                    </div>
                                                                </FormGroup>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <FormGroup className="mb-3">
                                                                    <label htmlFor="court">Court</label>
                                                                    <select
                                                                        name="court"
                                                                        className={`form-control ${errors.court ? 'is-invalid' : ''}`}
                                                                        value={form.court}
                                                                        onChange={handleCourtChange}
                                                                    >
                                                                        <option value="">Select Court</option>
                                                                        {courts.length > 0 ? (
                                                                            courts.map((court) => (
                                                                                <option key={court.court_code} value={court.court_code}>
                                                                                    {language === 'ta' ? court.court_lname : court.court_name}
                                                                                </option>
                                                                            ))
                                                                        ) : (
                                                                            <option value="">No courts available</option>
                                                                        )}
                                                                    </select>
                                                                    <div className="invalid-feedback">{errors.court}</div>
                                                                </FormGroup>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <FormGroup className="mb-3">
                                                                    <label htmlFor="">Stage of the Case</label>
                                                                    <FormControl
                                                                        name="case_stage"
                                                                        className={`form-control ${errors.case_stage ? 'is-invalid' : ''}`}
                                                                        value={form.case_stage}
                                                                        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                                    ></FormControl>
                                                                    <div className="invalid-feedback">
                                                                        {errors.case_stage}
                                                                    </div>
                                                                </FormGroup>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <FormGroup className="mb-3">
                                                                    <label htmlFor="">Next Hearing Date</label>
                                                                    <FormControl
                                                                        type="date"
                                                                        className={`form-control next_hearing-date-picker ${errors.next_hearing ? 'is-invalid' : ''}`}
                                                                        name="next_hearing"
                                                                        value={form.next_hearing ? form.next_hearing : ''}
                                                                        placeholder="DD/MM/YYYY"
                                                                        onChange={(e) => setForm({ ...form, next_hearing: e.target.value })}
                                                                        style={{
                                                                            backgroundColor: 'transparent',
                                                                            border: '1px solid #ccc', 
                                                                            padding: '8px',            
                                                                        }}
                                                                    ></FormControl>
                                                                    <div className="invalid-feedback">
                                                                        {errors.next_hearing}
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
                                                                        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                                    ></FormControl>
                                                                    <div className="invalid-feedback">
                                                                        {errors.no_of_witness}
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
                                                                    onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                                ></textarea>
                                                                <div className="invalid-feedback">
                                                                    {errors.previous_case}
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
                                                                    onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                                ></FormControl>
                                                                <div className="invalid-feedback">
                                                                    {errors.previous_bail}
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
                                                                    onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                                ></FormControl>
                                                                <div className="invalid-feedback">
                                                                    {errors.other_accused_status}
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
                                                                    onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                                ></FormControl>
                                                                <div className="invalid-feedback">
                                                                    {errors.reason_not_given}
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
                                                                    onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                                ></FormControl>
                                                                <div className="invalid-feedback">
                                                                    {errors.other_information}
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
                                                                    onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                                ></FormControl>
                                                                <div className="invalid-feedback">
                                                                    {errors.court_details}
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
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <p className="text-dark border-bottom pb-2"><strong>Tag FIR details</strong></p>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>FIR Number<RequiredField /></Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name="crime_number"
                                                                className={`${searchErrors.crime_number ? 'is-invalid' : ''}`}
                                                                value={searchForm.crime_number}
                                                                onChange={(e) => setSearchForm({ ...searchForm, [e.target.name]: e.target.value })}
                                                            ></Form.Control>
                                                            <div className="invalid-feedback">{searchErrors.crime_number}</div>
                                                        </Form.Group>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <Form.Group>
                                                            <Form.Label>Year<RequiredField /></Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name="year"
                                                                className={`${searchErrors.year ? 'is-invalid' : ''}`}
                                                                value={searchForm.year}
                                                                onChange={(e) => setSearchForm({ ...searchForm, [e.target.name]: e.target.value })}
                                                            ></Form.Control>
                                                            <div className="invalid-feedback">{searchErrors.year}</div>
                                                        </Form.Group>
                                                    </div>
                                                    <div className="col-md-2 mt-4 pt-2">
                                                        <Form.Group>
                                                            <Button
                                                                variant="contained"
                                                                onClick={handleSearch}
                                                            ><i className="fa fa-search mr-2"></i>Search</Button>
                                                        </Form.Group>
                                                    </div>
                                                    <div className="col-md-12 d-flex justify-content-center">
                                                        {showAdditionalFields && (
                                                            <FIRDetails 
                                                                setFirTagged={setFirTagged}
                                                                efile_no = {petition.efile_no}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            )}

            {loading && <Loading />}
        </>
    )
}

export default ResponseCreate