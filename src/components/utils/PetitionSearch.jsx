import { DistrictContext } from 'contexts/DistrictContext'
import { EstablishmentContext } from 'contexts/EstablishmentContext'
import { LanguageContext } from 'contexts/LanguageContex'
import { StateContext } from 'contexts/StateContext'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import { SeatContext } from 'contexts/SeatContext'
import * as Yup from 'yup'
import Loading from 'components/utils/Loading'
import api from 'api'
import { ToastContainer, toast } from 'react-toastify'
import { CaseTypeContext } from 'contexts/CaseTypeContext'
import { MasterContext } from 'contexts/MasterContext'

const PetitionSearch = ({cases, mainNumber, setMainNumber}) => {

    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    // const {states} = useContext(StateContext)
    // const {districts} = useContext(DistrictContext)
    const {establishments} = useContext(EstablishmentContext)
    // const {seats} = useContext(SeatContext)
    // const {casetypes} = useContext(CaseTypeContext)
    const {masters: {states, districts, seats, casetypes}} = useContext(MasterContext)

    const [searchType, setSearchType] = useState(1)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        judiciary:1,
        seat:'',
        state:'',
        district:'',
        establishment:'',
        case_type: '',
        reg_number: '',
        reg_year: ''
    })
    const [errors, setErrors] = useState({}) 

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

    const handleSearch = async() => {
        try{
            setLoading(true)
            await validationSchema.validate(form, {abortEarly:false})
            const response = await api.post("case/approved/single/", form)
            if(response.status === 200){
                setMainNumber(response.data.efile_number)
            }
        }
        catch(error){
            if(error?.inner){
                const newErrors = {}
                error?.inner.forEach(element => {
                    newErrors[element.path] = element.message
                });
                setErrors(newErrors)
            }
            if(error.response?.status === 404){
                toast.error("Petition details not found", {theme:"colored"})
            }
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className="container-fluid">
            <ToastContainer />
            { loading && <Loading />}
            <div className="row">
                <div className="col-md-12 text-center">
                    <div className="form-group">
                        <div>
                            <div className="icheck-primary d-inline mx-2">
                            <input 
                                type="radio" 
                                name="search_type" 
                                id="searchTypeYes" 
                                value={searchType}
                                checked={ parseInt(searchType) === 1 ? true : false}
                                onChange={(e) => setSearchType(1)} 
                            />
                            <label htmlFor="searchTypeYes">{t('select_petition')}</label>
                            </div>
                            <div className="icheck-primary d-inline mx-2">
                            <input 
                                type="radio" 
                                id="searchTypeNo" 
                                name="search_type" 
                                value={searchType}
                                checked={ parseInt(searchType) === 2 ? true : false } 
                                onChange={(e) => setSearchType(2)}
                            />
                            <label htmlFor="searchTypeNo">{t('search_petition')}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    { parseInt(searchType) === 1 && (
                        <div className="form-group row">
                            <div className="col-sm-8 offset-md-2">
                                <select 
                                    name="efile_no" 
                                    className="form-control"
                                    value={mainNumber}
                                    onChange={(e) => setMainNumber(e.target.value)}
                                >
                                    <option value="">Select petition</option>
                                    { cases.map((c, index) => (
                                        <option value={c.petition.efile_number} key={index}><>{c.petition.efile_number}</> - { c.litigants.filter(l=>l.litigant_type===1).map((p, index) => (
                                            <>{index+1}. {p.litigant_name}</>
                                            ))}&nbsp;&nbsp;Vs&nbsp;&nbsp;
                                            { c.litigants.filter(l=>l.litigant_type===2).map((res, index) => (
                                            <span key={index}>{res.litigant_name} {res.designation?.designation_name}</span>
                                            ))} 
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>
                <div className="col-md-12">
                    { parseInt(searchType) === 2 && (
                    <form>
                        <div className="row">
                            <div className="col-md-12 d-flex justify-content-center">
                                <div className="form-group">
                                    <div className="icheck-success d-inline mx-2">
                                        <input 
                                            type="radio" 
                                            name="judiciary" 
                                            id="court_type_hc" 
                                            value={ form.judiciary }
                                            checked={parseInt(form.judiciary) === 1 ? true : false }
                                            onChange={(e) => setForm({...form, [e.target.name]: 1, state:'', district:'', establishment:''})} 
                                        />
                                        <label htmlFor="court_type_hc">{t('high_court')}</label>
                                    </div>
                                    <div className="icheck-success d-inline mx-2">
                                        <input 
                                            type="radio" 
                                            id="court_type_dc" 
                                            name="judiciary" 
                                            value={form.judiciary}
                                            checked={parseInt(form.judiciary) === 2 ? true : false } 
                                            onChange={(e) => setForm({...form, [e.target.name]: 2, seat:''})}
                                        />
                                        <label htmlFor="court_type_dc">{t('district_court')}</label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-8 offset-md-2">
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
                                                    <option value={state.state_code} key={index}>
                                                        { language === 'ta' ? state.state_lname : state.state_name}
                                                    </option>
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
                                                        <option value={district.district_code} key={index}>
                                                            { language === 'ta' ? district.district_lname : district.district_name }
                                                        </option>
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
                                                    <option key={index} value={estd.establishment_code}>
                                                        { language === 'ta' ? estd.establishment_lname : estd.establishment_name}
                                                    </option>
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
                                                    <option key={index} value={ s.seat_code}>{language === 'ta' ? s.seat_lname : s.seat_name }</option>
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
                                            {casetypes.map((c, index)=>(
                                                <option key={index} value={c.id}>{language === 'ta' ? c.type_lfull_form : c.type_full_form }</option>
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
                                                        placeholder={t('case_number')}
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
                                                    onClick={handleSearch}
                                                >
                                                    {t('search')}
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
            </div>
        </div>
    )
}

export default PetitionSearch