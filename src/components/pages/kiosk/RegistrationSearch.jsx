import React, { useState, useContext } from 'react'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import * as Yup from 'yup'
import api from '../../../api';
import { toast, ToastContainer } from 'react-toastify';
import { StateContext } from 'contexts/StateContext';
import { DistrictContext } from 'contexts/DistrictContext';
import { EstablishmentContext } from 'contexts/EstablishmentContext';
import { CaseTypeContext } from 'contexts/CaseTypeContext';
import { BenchTypeContext } from 'contexts/BenchTypeContext';

const RegistrationSearch = () => {

    const {states} = useContext(StateContext)
    const {districts} = useContext(DistrictContext)
    const {establishments} = useContext(EstablishmentContext)
    const {benchtypes} = useContext(BenchTypeContext)
    // const {casetypes}   = useContext(CaseTypeContext)

    const[petition, setPetition] = useState({})
    const[litigant, setLitigant] = useState([])
    const[proceeding, setProceeding] = useState([])
    const[caseDetails, setCaseDetails] = useState(false)
    const[form, setForm] = useState({
        court_type:1,
        bench_type:'',
        state:'',
        district:'',
        establishment:'',
        case_type: '',
        reg_number: '',
        reg_year: ''
    })
    const[errors, setErrors] = useState({})
    const validationSchema = Yup.object({
        state: Yup.string().required(),
        district: Yup.string().required(),
        establishment: Yup.string().required(),
        case_type: Yup.string().required(),
        reg_number: Yup.number().typeError('This field should be a number').required(),
        reg_year: Yup.number().typeError('This field should be a number').required()
    })


    const handleSubmit = async () => {
        try{
            await validationSchema.validate(form, {abortEarly:false})
            const {response} = await api.post("case/search/registration-number/", form)
            if(response.status === 200){
                setCaseDetails(true)
                setPetition(response.data.petition)
                setLitigant(response.data.litigant)
                setProceeding(response.data.proceeding)
            }
        }catch(error){
            if(error.inner){
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
            }
            if(error.response){
                toast.error(error.response.message, {theme:"colored"})
            }
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="container" style={{ minHeight:"500px"}}>
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb" className="mt-2 mb-1">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item text-primary">Home</li>
                                <li className="breadcrumb-item text-primary">Status</li>
                                <li className="breadcrumb-item active">Registration Number</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 d-flex justify-content-center">
                        <div className="form-group">
                            <div className="icheck-primary d-inline mx-2">
                                <input 
                                    type="radio" 
                                    name="court_type" 
                                    id="court_type_hc" 
                                    value={ form.court_type }
                                    checked={parseInt(form.court_type) === 1 ? true : false }
                                    onChange={(e) => setForm({...form, [e.target.name]: 1, state:'', district:'', establishment:''})} 
                                />
                                <label htmlFor="court_type_hc">High Court</label>
                            </div>
                            <div className="icheck-primary d-inline mx-2">
                                <input 
                                    type="radio" 
                                    id="court_type_dc" 
                                    name="court_type" 
                                    value={form.court_type}
                                    checked={parseInt(form.court_type) === 2 ? true : false } 
                                    onChange={(e) => setForm({...form, [e.target.name]: 2, bench_type:''})}
                                />
                                <label htmlFor="court_type_dc">District Court</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        { parseInt(form.court_type) === 2 && (
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="">State</label>
                                        <select 
                                            name="state" 
                                            className={`form-control ${errors.state ? 'is-invalid': ''}`}
                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                        >
                                            <option value="">Select state</option>
                                            { states.map((state, index) => (
                                            <option value={state.state_code} key={index}>{state.state_name}</option>
                                            ))}
                                        </select>
                                        <div className="invalid-feedback">
                                            { errors.state }
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="">District</label>
                                        <select 
                                            name="district" 
                                            className={`form-control ${errors.district ? 'is-invalid': ''}`}
                                            onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                        >
                                            <option value="">Select district</option>
                                            { districts.filter(district => parseInt(district.state) === parseInt(form.state)).map((district, index) => (
                                                <option value={district.district_code} key={index}>{district.district_name}</option>
                                            ))}
                                        </select>
                                        <div className="invalid-feedback">
                                            { errors.district }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="row">
                            { parseInt(form.court_type) === 2 && (
                            <div className="col-md-8">
                                <div className="form-group">
                                    <label htmlFor="">Establishment</label>
                                    <select 
                                        name="establishment" 
                                        className={`form-control ${errors.establishment ? 'is-invalid': ''}`}
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">Select establishment</option>
                                        {establishments.filter(est=>parseInt(est.district) === parseInt(form.district)).map((estd, index)=>(
                                            <option key={index} value={estd.establishment_code}>{estd.establishment_name}</option>
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">
                                        { errors.establishment }
                                    </div>
                                </div>
                            </div>
                            )}
                            { parseInt(form.court_type) === 1 && (
                            <div className="col-md-8">
                                <div className="form-group">
                                    <label htmlFor="">Bench</label>
                                    <select 
                                        name="bench_type" 
                                        className={`form-control ${errors.bench_type ? 'is-invalid': ''}`}
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">Select bench</option>
                                        {benchtypes.map((b, index)=>(
                                            <option key={index} value={b.type_code}>{b.bench_type}</option>
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">
                                        { errors.bench_type }
                                    </div>
                                </div>
                            </div>
                            )}
                            <div className="col-md-4">
                                <label htmlFor="case_type">Case Type</label>
                                <select 
                                    name="case_type" 
                                    id="case_type" 
                                    className={`form-control ${errors.case_type ? 'is-invalid' : null}`}
                                    onChange={(e)=> setForm({...form, [e.target.name]: e.target.value})}
                                >
                                    <option value="">Select case type</option>
                                    {/* { casetypes.map((type, index) => (
                                    <option value={type.type_code} key={index}>{type.type_full_form}</option>
                                    ))} */}
                                </select>
                                <div className="invalid-feedback">
                                    { errors.case_type }
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
                                                className={`form-control ${errors.reg_number ? 'is-invalid': ''}`}
                                                name="reg_number"
                                                value={form.reg_number}
                                                onChange={(e)=> setForm({...form, [e.target.name]: e.target.value })}
                                                placeholder='Registration Number'
                                            />
                                            <div className="invalid-feedback">
                                                { errors.reg_number }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <input 
                                                type="text" 
                                                className={`form-control ${errors.reg_year ? 'is-invalid': ''}`}
                                                name="reg_year"
                                                value={form.reg_year}
                                                onChange={(e)=> setForm({...form, [e.target.name]: e.target.value })}
                                                placeholder='Registration Year'
                                            />
                                            <div className="invalid-feedback">
                                                { errors.reg_year }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <Button 
                                            variant='contained'
                                            color="primary"
                                            endIcon={<SearchIcon />}
                                            onClick={handleSubmit}
                                        >
                                            Search
                                        </Button>
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

export default RegistrationSearch