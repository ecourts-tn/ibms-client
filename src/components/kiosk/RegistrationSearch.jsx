import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import * as Yup from 'yup'
import api from 'api';
import { toast, ToastContainer } from 'react-toastify';
import { EstablishmentContext } from 'contexts/EstablishmentContext';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';
import Loading from 'components/utils/Loading';
import { MasterContext } from 'contexts/MasterContext';
import { useLocalizedNames } from 'hooks/useLocalizedNames';
import { truncateChars, formatDate } from 'utils'

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
    const {establishments} = useContext(EstablishmentContext)

    const { 
        getStateName,
        getDistrictName,
        getEstablishmentName,
        getCourtName,
        getJudiciaryName,
        getFilingNumber,
        getRegistrationNumber,
        getSeatName
    } = useLocalizedNames()

    const {language} = useContext(LanguageContext)
        const {masters:{
            states,
            districts, 
            seats, 
            casetypes
        }} = useContext(MasterContext)
    const {t} = useTranslation()

    const[petition, setPetition] = useState({})
    const[litigants, setLitigants] = useState([])
    const[objections, setObjections] = useState([])
    const[proceedings, setProceedings] = useState([])
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
                const { petition, litigants, objections, proceedings } = response.data
                setIsExist(true)
                setPetition(petition)
                setLitigants(litigants)
                setObjections(objections)
                setProceedings(proceedings)
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
                            <div className="col-md-8 offset-md-2">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <input 
                                                type="text" 
                                                className={`form-control ${errors.reg_number ? 'is-invalid': ''}`}
                                                name="reg_number"
                                                value={form.reg_number}
                                                onChange={(e)=> setForm({...form, [e.target.name]: e.target.value })}
                                                placeholder='Reg. No.'
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
                                    <div className="col-md-4">
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
                                    <td>{petition.efile_number}</td>
                                    <td>{t('efile_date')}</td>
                                    <td>{petition.efile_date}</td>
                                </tr>
                                { petition.judiciary.id== 2 && (
                                <>
                                <tr>
                                    <td>{t('state')}</td>
                                    <td>{ getStateName(petition?.state) }</td>
                                    <td>{t('district')}</td>
                                    <td>{ getDistrictName(petition?.district) }</td>
                                </tr>
                                <tr>
                                    <td>{t('establishment')}</td>
                                    <td>{ getEstablishmentName(petition?.establishment) }</td>
                                    <td>{t('court')}</td>
                                    <td>{ getCourtName(petition?.court) }</td>
                                </tr>
                                </>
                                )}
                                {  petition.judiciary.id === 1 && (
                                <>
                                    <tr>
                                        <td>Court Type</td>
                                        <td>{ getJudiciaryName(petition?.judiciary)}</td>
                                        <td>High Court Bench</td>
                                        <td>{ getSeatName(petition?.seat)}</td>
                                    </tr>
                                </>
                                )}
                                <tr>
                                    <td>{t('filing_number')}</td>
                                    <td>{ getFilingNumber(petition?.filing_number, petition?.filing_year)}</td>
                                    <td>{t('filing_date')}</td>
                                    <td>{ petition.filing_date }</td>
                                </tr>
                                <tr>
                                    <td>{t('registration_number')}</td>
                                    <td>{ getRegistrationNumber(petition?.reg_type, petition?.reg_number, petition?.reg_year) }</td>
                                    <td>{t('registration_date')}</td>
                                    <td>{  petition.registration_date }</td>
                                </tr>
                            </tbody>
                        </table>
                        <h6 className="text-center text-danger"><strong>{t('petitioner_details')}</strong></h6>
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <td>
                                        { litigants.filter((l) =>l.litigant_type ===1).map((p, index) => (
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
                                    { litigants.filter((l)=>l.litigant_type===2).map((res, index) => (
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
                        { Object.keys(objections).length > 0 && (
                        <React.Fragment>
                            <h6 className="text-center text-danger"><strong>Objections</strong></h6>
                            <table className="table table-bordered table-striped">
                                <thead className='bg-secondary'>
                                    <tr>
                                        <th>#</th>
                                        <th>Objection Date</th>
                                        <th>Remarks</th>
                                        <th>Complaince Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { objections.map((o, index) => (
                                    <tr>
                                        <td>{index+1}</td>
                                        <td>{o.objection_date}</td>
                                        <td>{o.remarks}</td>
                                        <td>{o.complaince_date}</td>
                                    </tr> 
                                    ))}
                                </tbody>
                            </table>
                        </React.Fragment>
                        )}
                        { Object.keys(proceedings).length > 0 && (
                        <React.Fragment>
                            <h6 className="text-center text-danger"><strong>Daily Proceedings</strong></h6>
                            <table className="table table-bordered table-striped table-sm">
                                <thead className='bg-info'>
                                    <tr>
                                        <th>#</th>
                                        <th>Business Date</th>
                                        <th>Business</th>
                                        <th>Next Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { proceedings.map((p, index) => (
                                    <tr>
                                        <td>{index+1}</td>
                                        <td>
                                            <Link to={`/proceeding/detail/`} state={{cino:p.cino, proceeding_id:p.proceeding_id}}>{ formatDate(p.order_date) }</Link>
                                        </td>
                                        <td>{ truncateChars(p.order_remarks, 100)}</td>
                                        <td>{ formatDate(p.next_date) }</td>
                                    </tr> 
                                    ))}
                                </tbody>
                            </table>
                        </React.Fragment>
                        )}
                    </React.Fragment>
                )}
            </div>    
        </>
  )
}

export default RegistrationSearch