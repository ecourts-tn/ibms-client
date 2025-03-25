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
import Loading from 'components/utils/Loading'
import { Link } from 'react-router-dom'
import { MasterContext } from 'contexts/MasterContext'

const FilingSearch = () => {

    const[form, setForm] = useState({
        judiciary:1,
        seat:'',
        state: '', 
        district: '',
        establishment: '',
        filing_number:'',
        filing_year:'',
    })
    const {t} = useTranslation()
    // const {states} = useContext(StateContext)
    // const {districts} = useContext(DistrictContext)
    // const {seats} = useContext(SeatContext)
    const {establishments} = useContext(EstablishmentContext)
    const {masters:{
        states,
        districts, 
        seats
    }} = useContext(MasterContext)
    const {language} = useContext(LanguageContext)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [petitions, setPetitions] = useState([])

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
        filing_number: Yup.number().typeError(t('errors.numeric')).required(),
        filing_year: Yup.number().typeError(t('errors.numeric')).required()
    })

    const handleSubmit = async() => {
        try{
            setLoading(true)
            await validationSchema.validate(form, {abortEarly:false})
            const response = await api.post("case/search/filing-number/", form)
            if(response.status === 200){
                setPetitions(response.data)
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


    return (
        <>
            { loading && <Loading />}
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
                                    onChange={(e) => setForm({...form, [e.target.name]: 2, bench_type:''})}
                                />
                                <label htmlFor="judiciary_dc">{t('district_court')}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">
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
                                { parseInt(form.judiciary) === 1 && (
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="">{t('hc_bench')}</label>
                                            <select 
                                                name="seat" 
                                                className={`form-control ${errors.seat ? 'is-invalid' : ''}`}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            >
                                                <option value="">{t('alerts.select_bench_type')}</option>
                                                { seats.map((b, index)=>(
                                                    <option key={index} value={b.seat_code}>{language === 'ta' ? b.seat_lname : b.seat_name}</option>
                                                ))}
                                            </select>
                                            <div className="invalid-feedback">
                                                { errors.seat }
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
                { Object.keys(petitions).length > 0 && (
                <table className="table table-bordered table-striped mt-5">
                    <thead className="bg-secondary">
                        <tr>
                            <th>Filing Number</th>
                            <th>Litigants</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        { petitions.map((p, index) => (
                            <tr key={index}>
                                <td>{`${p.petition.filing_type?.type_name}/${p.petition.filing_number}/${p.petition.filing_year}`}</td>
                                <td>
                                    {p.litigants
                                        .filter((l) => parseInt(l.litigant_type) === 1)
                                        .map((l, index) => (
                                            <span key={index}>
                                                {index + 1}. {l.litigant_name}
                                            </span>
                                        ))}
                                    <span className="text-danger mx-2">Vs</span>
                                    {p.litigants
                                        .filter((l) => parseInt(l.litigant_type) === 2)
                                        .map((l, index) => (
                                            <span key={index}>
                                                {index + 1}. {l.litigant_name}{' '}
                                                {language === 'ta'
                                                    ? l.designation?.designation_lname
                                                    : l.designation?.designation_name}
                                            </span>
                                    ))}
                                </td>
                                <td>
                                    <Link to={`/filing/detail/`} state={{ efile_no: p.petition.efile_number }}>View</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                )}
            </div>  
        </>
  )
}

export default FilingSearch