import React, { useState, useContext } from 'react'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import * as Yup from 'yup'
import api from 'api';
import { toast, ToastContainer } from 'react-toastify';
import { StateContext } from 'contexts/StateContext';
import { DistrictContext } from 'contexts/DistrictContext';
import { EstablishmentContext } from 'contexts/EstablishmentContext';
import { CaseTypeContext } from 'contexts/CaseTypeContext';
import { SeatContext } from 'contexts/SeatContext';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';
import Loading from 'components/common/Loading';
import { Link } from 'react-router-dom';
import { truncateChars } from 'utils';

const RegistrationSearch = () => {
    
    const[form, setForm] = useState({
        judiciary:1,
        seat:'',
        state:'',
        district:'',
        establishment:'',
        case_type: '',
        reg_number: '',
        reg_year: ''
    })
    const {states} = useContext(StateContext)
    const {districts} = useContext(DistrictContext)
    const {establishments} = useContext(EstablishmentContext)
    const {seats} = useContext(SeatContext)
    const {language} = useContext(LanguageContext)
    const {casetypes}   = useContext(CaseTypeContext)
    const {t} = useTranslation()
    const[petition, setPetition] = useState({})
    const[errors, setErrors] = useState({})
    const[loading, setLoading] = useState(false)
    const[isExist, setIsExist] = useState(false)

    const validationSchema = Yup.object({
        seat: Yup.string().when("judiciary",(judiciary, schema) => {
            if(parseInt(judiciary) === 1){
                return schema.required(t('errors.bench_required'))
            }
        }),
        state: Yup.string().when("judiciary", (judiciary, schema) => {
            if(parseInt(judiciary) === 2){
                return schema.required(t('errors.state_required'))
            }
        }),
        district: Yup.string().when("judiciary", (judiciary, schema) => {
            if(parseInt(judiciary) === 2){
                return schema.required(t('errors.district_required'))
            }
        }),
        establishment: Yup.string().when("judiciary", (judiciary, schema) => {
            if(parseInt(judiciary) === 2){
                return schema.required(t('errors.est_required'))
            }
        }),
        case_type: Yup.string().required(t('errors.case_type_required')),
        reg_number: Yup.number().typeError(t('errors.numeric')).required(),
        reg_year: Yup.number().typeError(t('errors.numeric')).required()
    })


    const handleSubmit = async () => {
        try{
            setLoading(true)
            await validationSchema.validate(form, {abortEarly:false})
            const response = await api.post("case/search/registration-number/", form)
            if(response.status === 200){
                setIsExist(true)
                setPetition(response.data)
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
                toast.error(error.response.data.message, {theme:"colored"})
            }
        }finally{
            setLoading(false)
        }
    }

    { console.log(isExist)}

    return (
        <>
            {loading && <Loading />}
            <ToastContainer />
            <div className="container" style={{ minHeight:"500px"}}>
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb" className="mt-2 mb-1">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item text-primary">{t('home')}</li>
                                <li className="breadcrumb-item text-primary">{t('case_status')}</li>
                                <li className="breadcrumb-item active">{t('registration_number')}</li>
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
                                    name="judiciary" 
                                    id="judiciary_hc" 
                                    value={ form.judiciary }
                                    checked={parseInt(form.judiciary) === 1 ? true : false }
                                    onChange={(e) => setForm({...form, [e.target.name]: 1, state:'', district:'', establishment:''})} 
                                />
                                <label htmlFor="judiciary_hc">{t('high_court')}</label>
                            </div>
                            <div className="icheck-primary d-inline mx-2">
                                <input 
                                    type="radio" 
                                    id="judiciary_dc" 
                                    name="judiciary" 
                                    value={form.judiciary}
                                    checked={parseInt(form.judiciary) === 2 ? true : false } 
                                    onChange={(e) => setForm({...form, [e.target.name]: 2, seat:''})}
                                />
                                <label htmlFor="judiciary_dc">{t('district_court')}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        { parseInt(form.judiciary) === 2 && (
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
                                            { states.map((state, index) => (
                                            <option value={state.state_code} key={index}>{language === 'ta' ? state.state_lname : state.state_name}</option>
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
                                            className={`form-control ${errors.district ? 'is-invalid': ''}`}
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
                            </div>
                        )}
                        <div className="row">
                            { parseInt(form.judiciary) === 2 && (
                            <div className="col-md-8">
                                <div className="form-group">
                                    <label htmlFor="">{t('est_name')}</label>
                                    <select 
                                        name="establishment" 
                                        className={`form-control ${errors.establishment ? 'is-invalid': ''}`}
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">{t('alerts.select_establishment')}</option>
                                        {establishments.filter(est=>parseInt(est.district) === parseInt(form.district)).map((estd, index)=>(
                                            <option key={index} value={estd.establishment_code}>{language === 'ta' ? estd.establishment_lname : estd.establishment_name}</option>
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">
                                        { errors.establishment }
                                    </div>
                                </div>
                            </div>
                            )}
                            { parseInt(form.judiciary) === 1 && (
                            <div className="col-md-8">
                                <div className="form-group">
                                    <label htmlFor="">{t('hc_bench')}</label>
                                    <select 
                                        name="seat" 
                                        className={`form-control ${errors.seat ? 'is-invalid': ''}`}
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">{t('alerts.select_bench_type')}</option>
                                        {seats.map((s, index)=>(
                                            <option key={index} value={s.seat_code}>{language === 'ta' ? s.seat_lname : s.seat_name}</option>
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">
                                        { errors.seat }
                                    </div>
                                </div>
                            </div>
                            )}
                            <div className="col-md-4">
                                <label htmlFor="case_type">{t('case_type')}</label>
                                <select 
                                    name="case_type" 
                                    id="case_type" 
                                    className={`form-control ${errors.case_type ? 'is-invalid' : null}`}
                                    onChange={(e)=> setForm({...form, [e.target.name]: e.target.value})}
                                >
                                    <option value="">{t('alerts.select_case_type')}</option>
                                    { casetypes.map((type, index) => (
                                    <option value={type.id} key={index}>{ language === 'ta' ? type.type_lfull_form : type.type_full_form}</option>
                                    ))}
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
                                                placeholder={t('registration_number')}
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
                                                placeholder={t('case_year')}
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
                                            {t('search')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                { isExist && (
                    <React.Fragment>
                        <table className="table table-bordered table-striped table-sm mt-3">
                            <tbody>
                                <tr>
                                    <td>{t('efile_number')}</td>
                                    <td>{petition.petition.efile_number}</td>
                                    <td>{t('efile_date')}</td>
                                    <td>{petition.petition.efile_date}</td>
                                </tr>
                                { petition.petition.judiciary.id== 2 && (
                                <>
                                <tr>
                                    <td>{t('state')}</td>
                                    <td>{ language === 'ta' ? petition.petition.state.state_lname : petition.petition.state.state_name }</td>
                                    <td>{t('district')}</td>
                                    <td>{ language === 'ta' ? petition.petition.district.district_lname : petition.petition.district.district_name }</td>
                                </tr>
                                <tr>
                                    <td>{t('establishment')}</td>
                                    <td>{ language === 'ta' ? petition.petition.establishment.establishment_lname : petition.petition.establishment.establishment_name }</td>
                                    <td>{t('court')}</td>
                                    <td>{ language === 'ta' ? petition.petition.court.court_lname : petition.petition.court.court_name }</td>
                                </tr>
                                </>
                                )}
                                {  petition.petition.judiciary.id === 1 && (
                                <>
                                    <tr>
                                        <td>Court Type</td>
                                        <td>{ language === 'ta' ? petition.petition.judiciary.judiciary_lname : petition.petition.judiciary.judiciary_name}</td>
                                        <td>High Court Bench</td>
                                        <td>{ language === 'ta' ? petition.petition.seat?.seat_lname : petition.petition.seat?.seat_name}</td>
                                    </tr>
                                </>
                                )}
                                <tr>
                                    <td>{t('filing_number')}</td>
                                    <td>{ petition.petition.filing_type ? `${petition.petition.filing_type.type_name}/${petition.petition.filing_number}/${petition.petition.filing_year}` : null}</td>
                                    <td>{t('filing_date')}</td>
                                    <td>{ petition.petition.filing_date }</td>
                                </tr>
                                <tr>
                                    <td>{t('case_number')}</td>
                                    <td>{ petition.petition.reg_type ? `${petition.petition.reg_type.type_name}/${ petition.petition.reg_number}/${ petition.petition.reg_year}` : null }</td>
                                    <td>{t('registration_date')}</td>
                                    <td>{  petition.petition.registration_date }</td>
                                </tr>
                            </tbody>
                        </table>
                        <h6 className="text-center text-danger"><strong>{t('petitioner_details')}</strong></h6>
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <td>
                                        { petition.litigant.filter((l) =>l.litigant_type ===1).map((p, index) => (
                                            <p key={index}>
                                                <strong>{index+1}. {p.litigant_name}</strong><br/>
                                                { p.address }
                                            </p>
                                        ))}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <h6 className="text-center text-danger"><strong>{t('respondent_details')}</strong></h6>
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <td>
                                    { petition.litigant.filter((l)=>l.litigant_type===2).map((res, index) => (
                                        <React.Fragment>
                                            <p key={index}>
                                                <strong>{index+1}. {res.litigant_name} { language === 'ta' ? res.designation?.designation_lname : res.designation?.designation_name }</strong><br/>
                                                { ` ${res.address}, ${ language === 'ta' ? res.police_station?.station_lname : res.police_station?.station_name}, 
                                                    ${ language === 'ta' ? res.district?.district_lname : res.district?.district_name}, 
                                                `}
                                            </p>
                                        </React.Fragment>
                                    ))}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </React.Fragment>
                )}
            </div>    
        </>
  )
}

export default RegistrationSearch