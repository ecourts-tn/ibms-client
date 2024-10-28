import React, {useState, useContext} from 'react'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import * as Yup from 'yup'
import api from 'api'
import { toast, ToastContainer } from 'react-toastify';
import { StateContext } from 'contexts/StateContext';
import { DistrictContext } from 'contexts/DistrictContext';
import { EstablishmentContext } from 'contexts/EstablishmentContext';
import './style.css'
import { SeatContext } from 'contexts/SeatContext'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'

const FilingSearch = () => {

    const {states} = useContext(StateContext)
    const {districts} = useContext(DistrictContext)
    const {benchtypes} = useContext(SeatContext)
    const {establishments} = useContext(EstablishmentContext)
    const {language} = useContext(LanguageContext)
    const {t} = useTranslation()
    const[form, setForm] = useState({
        court_type:1,
        bench_type:'',
        state: '', 
        district: '',
        establishment: '',
        filing_number:'',
        filing_year:'',
    })
    const[errors, setErrors] = useState({})
    const[petition, setPetition] = useState({})
    const[litigant, setLitigant] = useState([])
    const[objection, setObjection] = useState([])
    const[caseDetails, setCaseDetails] = useState(false)
    const validationSchema = Yup.object({
        bench_type: Yup.string().when("court_type",(court_type, schema) => {
            if(parseInt(court_type) === 1){
                return schema.required(t('errors.bench_required'))
            }
        }),
        state: Yup.string().when("court_type", (court_type, schema) => {
            if(parseInt(court_type) === 2){
                return schema.required(t('errors.state_required'))
            }
        }),
        district: Yup.string().when("court_type", (court_type, schema) => {
            if(parseInt(court_type) === 2){
                return schema.required(t('errors.district_required'))
            }
        }),
        establishment: Yup.string().when("court_type", (court_type, schema) => {
            if(parseInt(court_type) === 2){
                return schema.required(t('errors.est_required'))
            }
        }),
        filing_number: Yup.number().typeError(t('errors.numeric')).required(),
        filing_year: Yup.number().typeError(t('errors.numeric')).required()
    })
    const handleSubmit = async() => {
        try{
            await validationSchema.validate(form, {abortEarly:false})
            const response = await api.post("case/search/filing-number/", form)
            if(response.status === 200){
                setCaseDetails(true)
                setPetition(response.data.petition)
                setLitigant(response.data.litigant)
                setObjection(response.data.objection)
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

    console.log(petition)

    return (
        <>
            <ToastContainer />
            <div className="container" style={{ minHeight:"500px"}}>
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb" className="mt-2 mb-1">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item text-primary">{t('home')}</li>
                                <li className="breadcrumb-item text-primary">{t('case_status')}</li>
                                <li className="breadcrumb-item active">{t('filing_number')}</li>
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
                                <label htmlFor="court_type_hc">{t('high_court')}</label>
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
                                <label htmlFor="court_type_dc">{t('district_court')}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-6 offset-md-3">
                                { parseInt(form.court_type) === 2 && (
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="">{t('state')}</label>
                                            <select 
                                                name="state" 
                                                className={`form-control ${errors.state ? 'is-invalid': ''}`}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            >
                                                <option value="">{t('alerts.select_state')}</option>
                                                { states.map((s, index) => (
                                                <option value={s.state_code} key={index}>{language === 'ta' ? s.state_lname : s.state_name}</option>
                                                ))}
                                            </select>
                                            <div className="invalid-feedback">
                                                { errors.state }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="">{t('district')}</label>
                                            <select 
                                                name="district" 
                                                className={`form-control ${errors.district ? 'is-invalid' : ''}`}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            >
                                                <option value="">{t('alerts.select_district')}</option>
                                                { districts.filter(district => parseInt(district.state) === parseInt(form.state)).map((district, index) => (
                                                    <option value={district.district_code} key={index}>{language === 'ta' ? district.district_lname : district.district_name}</option>
                                                ))}
                                            </select>
                                            <div className="invalid-feedback">
                                                { errors.district }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="">{t('est_name')}</label>
                                            <select 
                                                name="establishment" 
                                                className={`form-control ${errors.establishment ? 'is-invalid' : ''}`}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            >
                                                <option value="">{t('alerts.select_establishment')}</option>
                                                {establishments.filter(est=>parseInt(est.district) === parseInt(form.district)).map((estd, index)=>(
                                                    <option key={index} value={estd.establishment_code}>{language === 'ta' ? estd.establishment_lname: estd.establishment_name}</option>
                                                ))}
                                            </select>
                                            <div className="invalid-feedback">
                                                { errors.establishment }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                )}
                                { parseInt(form.court_type) === 1 && (
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="">{t('hc_bench')}</label>
                                            <select 
                                                name="bench_type" 
                                                className={`form-control ${errors.bench_type ? 'is-invalid' : ''}`}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            >
                                                <option value="">{t('alerts.select_bench_type')}</option>
                                                {benchtypes.map((b, index)=>(
                                                    <option key={index} value={b.type_code}>{language === 'ta' ? b.bench_ltype : b.bench_type}</option>
                                                ))}
                                            </select>
                                            <div className="invalid-feedback">
                                                { errors.bench_type }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                )}
                                <div className="row">
                                    <div className="col-md-10 offset-md-1">
                                        <div className="row">
                                            <div className="col-md-5">
                                                <div className="form-group">
                                                    <input 
                                                        type="text" 
                                                        className={`form-control ${errors.filing_number ? 'is-invalid': ''}`}
                                                        name="filing_number"
                                                        value={form.filing_number}
                                                        onChange={(e)=> setForm({...form, [e.target.name]: e.target.value })}
                                                        placeholder={t('filing_number')}
                                                    />
                                                    <div className="invalid-feedback">
                                                        { errors.filing_number }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <input 
                                                        type="text" 
                                                        className={`form-control ${errors.filing_year ? 'is-invalid': ''}`}
                                                        name="filing_year"
                                                        value={form.filing_year}
                                                        onChange={(e)=> setForm({...form, [e.target.name]: e.target.value })}
                                                        placeholder={t('case_year')}
                                                    />
                                                    <div className="invalid-feedback">
                                                        { errors.filing_year }
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
                                                    {t('search')}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                { caseDetails && (
                <div className="row">
                    <div className="col-md-12 mt-5">
                        <h6 className="text-center text-danger"><strong>CASE DETAILS</strong></h6>
                        <table className="table table-bordered table-striped table-sm details-table">
                            <tbody>
                                { petition.court_type.id === 2 && (
                                <>
                                <tr>
                                    <td>State</td>
                                    <td>{ petition.state.state_name }</td>
                                    <td>District</td>
                                    <td>{ petition.district.district_name }</td>
                                </tr>
                                <tr>
                                    <td>Establishment Name</td>
                                    <td>{ petition.establishment.establishment_name }</td>
                                    <td>Court Name</td>
                                    <td>{ petition.court.court_name }</td>
                                </tr>
                                </>
                                )}
                                <tr>
                                    <td>Filing Number</td>
                                    <td>{ petition.filing_type ? `${petition.filing_type.type_name}/${petition.filing_number}/${petition.filing_year}` : null}</td>
                                    <td>Filing Date</td>
                                    <td>{ petition.filing_date }</td>
                                </tr>
                                <tr>
                                    <td>Registration Number</td>
                                    <td>{ petition.reg_type ? `${petition.reg_type.type_name}/${ petition.reg_number}/${ petition.reg_year}` : null }</td>
                                    <td>Registration Date</td>
                                    <td>{  petition.date_of_registration }</td>
                                </tr>
                                {  petition.court_type.code === 2 && (
                                <>
                                    <tr>
                                        <td>State</td>
                                        <td>{ petition.state.state_name}</td>
                                        <td>District</td>
                                        <td>{ petition.district.district_name}</td>
                                    </tr>
                                    <tr>
                                        <td>Establishment</td>
                                        <td>{ petition.establishment.establishment_name}</td>
                                        <td>Court</td>
                                        <td>{ petition.court.court_name}</td>
                                    </tr>
                                </>
                                )}
                                {  petition.court_type.code === 1 && (
                                <>
                                    <tr>
                                        <td>Court Type</td>
                                        <td>{ petition.court_type.name}</td>
                                        <td>Bench Type</td>
                                        <td>{ petition.bench_type.name}</td>
                                    </tr>
                                </>
                                )}
                            </tbody>
                        </table>
                        <h6 className="text-center text-danger"><strong>PETITIONER DETAILS</strong></h6>
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <td>
                                    { litigant.filter(l=>l.litigant_type ===1).map((p, index) => (
                                        <>
                                            <p>
                                                <strong>{index+1}. {p.litigant_name}</strong><br/>
                                                { p.address }
                                            </p>
                                        </>

                                    ))}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <h6 className="text-center text-danger"><strong>RESPONDENT DETAILS</strong></h6>
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <td>
                                    { litigant.filter(l=>l.litigant_type===2).map((res, index) => (
                                        <>
                                            <p><strong>{index+1}. {res.litigant_name} {res.designation}</strong><br/>
                                                { `${res.police_station.station_name}, ${res.district.district_name}, ${res.address}`}
                                            </p>
                                        </>
                                    ))}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        { Object.keys(objection).length > 0 && (
                        <>
                        <h6 className="text-center text-danger"><strong>OBJECTIONS</strong></h6>
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <td>
                                    
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        </>)}
                    </div>
                </div>
                )}
            </div>  
        </>
  )
}

export default FilingSearch