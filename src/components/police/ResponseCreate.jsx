import api from 'api'
import * as Yup from 'yup'
import React, { useState, useEffect, useContext } from 'react'
import { RequiredField } from 'utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import FormControl from 'react-bootstrap/FormControl'
import FormGroup from 'react-bootstrap/FormGroup'
import FormLabel from 'react-bootstrap/FormLabel'
import Button from '@mui/material/Button'
import Document from 'components/police/Document';
import Loading from 'components/utils/Loading';
import MaterialDetails from 'components/police/MaterialDetails';
import VehicleDetails from 'components/police/VehicleDetails';
import { handleNumberChange } from 'components/validation/validations';
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";
import { LanguageContext } from 'contexts/LanguageContex';
import { useTranslation } from 'react-i18next';
import { BaseContext } from 'contexts/BaseContext';
import { AuthContext } from 'contexts/AuthContext';
import PetitionDetail from './PetitionDetail';
import AccusedDetail from './AccusedDetail';
import LinkFIR from './LinkFIR';
import DatePicker from 'components/utils/DatePicker';


const ResponseCreate = () => {
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);
    const { state } = useLocation()
    const {setEfileNumber} = useContext(BaseContext)
    const {user} = useContext(AuthContext)
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

    const initialState = {
        efile_no: '',
        crime_number: '',
        crime_year: '',
        date_of_arrest:'',
        offences: '',
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
        no_of_witness: 0,
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
    const [form, setForm] = useState(initialState)
    const [errors, setErrors] = useState({})
    const [materials, setMaterials] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [petition, setPetition] = useState(initialPetition)
    const [loading, setLoading] = useState(false)
    const [crime, setCrime] = useState({})
    const [accused, setAccused] = useState([])
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


    const validationSchema = Yup.object({
        csr_number: Yup.string().required('CSR Number is required'),
        limitation_date: Yup.string().required('Limitation date is required'),
        offences: Yup.string().required(),
        accused_name: Yup.string().required(),
        specific_allegations: Yup.string().required(),
        materials_used: Yup.string().required(),
        discharged: Yup.string().required(),
        hospital_name: Yup.string()
            .nullable()
            .when('discharged', (discharged, schema) => {
                if (parseInt(discharged) === 2) {
                    return schema.required('Hospital name is required');
                }
                return schema.notRequired();
            }),
        victim_condition: Yup.string()
            .nullable()
            .when('discharged', (discharged, schema) => {
                if (parseInt(discharged) === 2) {
                    return schema.required('Condition details is required');
                }
                return schema.notRequired();
            }),
        injury_particulars: Yup.string()
            .nullable()
            .when('discharged', (discharged, schema) => {
                if (parseInt(discharged) === 2) {
                    return schema.required('Injury particulars is required');
                }
                return schema.notRequired();
            }),
        is_material_seized: Yup.string().required('Matirial serized is required'),
        is_vehicle_seized: Yup.string().required('Vehicle serized is required'),
        date_of_arrest: Yup.date().transform((value, originalValue) =>
            originalValue === "" ? null : value
            ).nullable().required("Date of arrest is required"),
        previous_case: Yup.string().required(),
        previous_bail: Yup.string().required(),
        other_accused_status: Yup.string().required(),
        reason_not_given: Yup.string().required(),
        other_information: Yup.string().required(),
        investigation_stage: Yup.string().required(),
        cnr_number: Yup.string()
            .nullable()
            .when("investigation_stage", (investigation_stage, schema) => {
            if (parseInt(investigation_stage) === 2) {
                return schema.required('CNR Number required')
            }
            return schema.notRequired()
        }),
        court: Yup.string()
            .nullable()
            .when("investigation_stage", (investigation_stage, schema) => {
            if(parseInt(investigation_stage) === 2){
                return schema.required('Court required')
            }
            return schema.notRequired()
        }),
        case_stage: Yup.string()
            .nullable()
            .when("investigation_stage", (investigation_stage, schema) => {
            if(parseInt(investigation_stage) === 2){
                return schema.required('CNR Number required')
            }
            return schema.notRequired()
        }),
        next_hearing: Yup.date()
            .nullable()
            .when("investigation_stage", (investigation_stage, schema) => {
            if(parseInt(investigation_stage) === 2){
                return schema.transform((value, originalValue) =>
                    originalValue === "" ? null : value
                ).nullable().required("Next hearing required")
            }
            return schema.notRequired()
        }),
        no_of_witness: Yup.string()
            .nullable()
            .when("investigation_stage", (investigation_stage, schema) => {
            if(parseInt(investigation_stage) === 2){
                return schema.required('No of witness required').matches(/^\d{2}$/, 'No of witness required')
            }
        }),
    })

    const handleDateChange = (field, value) => {
        setForm((prev) => ({
          ...prev,
          [field]: value,
        }));
     };


    useEffect(() => {
        async function fetchPetitionDetail() {
            try{
                setLoading(true)
                const response = await api.post(`police/petition/detail/`, { efile_no: state.efile_no })
                if (response.status === 200) {
                    setForm({
                        ...form,
                        efile_no: response.data.petition.efile_number,
                        crime_number: response.data.petition.fir_number,
                        crime_year: response.data.petition.fir_year
                    })
                    setEfileNumber(response.data.petition.efile_number)
                    const { petition, litigants, crime } = response.data
                    setPetition(petition)
                    setAccused(litigants.filter(l => l.litigant_type === 1))
                    setCrime(crime)
                }
            }catch(error){
                console.log(error)
            }finally{
                setLoading(false)
            }
        }
        fetchPetitionDetail()
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


    useEffect(() => {
        if(firTagged){
            window.location.reload()
        }
    }, [firTagged])


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await validationSchema.validate(form, { abortEarly: false })
            form.efile_no = state.efile_no
            const data = {
                response: form,
                materials,
                vehicles,
                documents
            } 
            const response = await api.post("police/response/create/", data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
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
                console.log(error.inner)
                const newErrors = {};
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message;
                });
                setErrors(newErrors);
            }
        }
    }


    return (
        <React.Fragment>
            {state.efile_no && (
            <div className="card card-outline card-primary">
                {loading && <Loading />}
                <ToastContainer />
                <div className="card-header">
                    <h3 className="card-title">
                        <i className="fas fa-edit mr-2"></i><strong>Police Response: </strong>
                    </h3>
                    <span className="text-primary ml-3"><strong>{state.efile_no}</strong></span>
                </div>
                <div className="card-body">
                    <PetitionDetail 
                        petition={petition}
                        crime={crime}
                    />
                    <AccusedDetail 
                        accused={accused}
                    />
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
                                                        className={`form-control ${errors.csr_number ? 'is-invalid' : ''}`}
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
                                                        className={`form-control ${errors.limitation_date ? 'is-invalid' : null}`}
                                                        name="crime_number"
                                                        value={form.crime_number}
                                                        readOnly={form.crime_number !== '' ? true : false}
                                                        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                    />
                                                    <div className="invalid-feedback">
                                                        { errors.limitation_date }
                                                    </div>
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
                                                    <DatePicker 
                                                        name="date_of_arrest"
                                                        value={form.date_of_arrest}
                                                        onChange={handleDateChange}
                                                        error={errors.date_of_arrest ? true : false}
                                                    />
                                                    <div className="invalid-feedback">
                                                        {errors.date_of_arrest}
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
                                            <div className="col-md-6">
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
                                                        <div className="text-danger">{ errors.discharged }</div>
                                                    </div>
                                                </div>
                                                {parseInt(form.discharged) === 2 && (
                                                    <React.Fragment>
                                                        <div className="form-group row">
                                                            <label htmlFor="" className="col-sm-3">Hospital Name</label>
                                                            <div className="col-sm-9">
                                                                <input
                                                                    type="text"
                                                                    className={`form-control ${errors.hospital_name ? 'is-invalid' : null}`}
                                                                    name="hospital_name"
                                                                    value={form.hospital_name}
                                                                    onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                                />
                                                                <div className="invalid-feedback">
                                                                    { errors.hospital_name }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label htmlFor="" className="col-sm-3">Condition of Victim</label>
                                                            <div className="col-sm-9">
                                                                <input
                                                                    type="text"
                                                                    className={`form-control ${errors.victim_condition ? 'is-invalid' : null}`}
                                                                    name="victim_condition"
                                                                    value={form.victim_condition}
                                                                    onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                                />
                                                                <div className="invalid-feedback">
                                                                    { errors.victim_condition }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label htmlFor="" className="col-sm-3">Particulars of Injury</label>
                                                            <div className="col-sm-9">
                                                                <textarea
                                                                    rows={2}
                                                                    name="injury_particulars"
                                                                    className={`form-control ${errors.injury_particulars ? 'is-invalid' : null}`}
                                                                    value={form.injury_particulars}
                                                                    onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                                                                ></textarea>
                                                                <div className="invalid-feedback">
                                                                    { errors.injury_particulars}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </React.Fragment>
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
                                                <div className="text-danger">{ errors.is_material_seized }</div>
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
                                                <div className="text-danger">{ errors.is_vehicle_seized }</div>
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
                                                    <DatePicker 
                                                        name="limitation_date"
                                                        value={form.limitation_date}
                                                        onChange={handleDateChange}
                                                        error={errors.limitation_date ? true : false}
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
                                                            onChange={(e) => setForm({...form, [e.target.name] : e.target.value})}
                                                        >
                                                            <option value="">Select Court</option>
                                                            {courts.map((court, index) => (
                                                                <option key={index} value={court.court_code}>
                                                                    {language === 'ta' ? court.court_lname : court.court_name}
                                                                </option>
                                                            ))}
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
                                                        <DatePicker 
                                                            name="next_hearing"
                                                            value={form.next_hearing}
                                                            onChange={handleDateChange}
                                                            error={errors.next_hearing ? true : false}
                                                        />
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
                            <LinkFIR 
                                setFirTagged={setFirTagged}
                                efileNumber={petition.efile_no}
                            />
                        </React.Fragment>
                    )}

                </div>
            </div>
            )}
        </React.Fragment>
    )
}

export default ResponseCreate