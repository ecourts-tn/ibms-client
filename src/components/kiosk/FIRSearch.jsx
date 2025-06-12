import React, { useContext } from 'react'
import { useState } from 'react'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import * as Yup from 'yup'
import api from 'api'
import { toast, ToastContainer } from 'react-toastify'
import { PoliceStationContext } from 'contexts/PoliceStationContext'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import Loading from 'components/utils/Loading'
import { Link } from 'react-router-dom'
import { MasterContext } from 'contexts/MasterContext'


const FIRSearch = () => {

    const {masters:{
        states,
        districts
    }} = useContext(MasterContext)
    const {policeStations} = useContext(PoliceStationContext)
    const {language} = useContext(LanguageContext)
    const {t} = useTranslation()
    const[form, setForm] = useState({
        state:'',
        district:'',
        police_station:'',
        fir_number:'',
        fir_year:''
    })
    const[errors, setErrors] = useState({})
    const[petitions, setPetitions] = useState([])
    const[isExist, setIsExist] = useState(false)
    const[loading, setLoading] = useState(false)
    const validationSchema = Yup.object({
        state: Yup.string().required("Please select state"),
        district: Yup.string().required("Please select district"),
        police_station: Yup.string().required("Please select police station"),
        fir_number: Yup.string().required('FIR number is required').matches(/^\d{1,6}$/, 'FIR number is required'),
        fir_year:   Yup.string().required('FIR year is required').matches(/^\d{4}$/, 'Year must be exactly 4 digits')
    })

    const handleSubmit = async() => {
        try{
            setLoading(true)
            await validationSchema.validate(form, { abortEarly: false})
            const response = await api.post("case/search/fir-number/", form)
            if(response.status === 200){
                setIsExist(true)
                setPetitions(response.data)
            }
        }catch(error){
            if(error.response?.status === 404){
                toast.error(error.response.data.message, {theme:"colored"})
            }
            if(error.inner){
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
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
                                <li className="breadcrumb-item active">{t('fir_number')}</li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-md-12 d-flex justify-content-center">
                        <div className="row">
                            <div className="col-md-10 offset-1">
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
                                            <label htmlFor="">{t('police_station')}</label>
                                            <select 
                                                name="police_station" 
                                                className={`form-control ${errors.police_station ? 'is-invalid' : ''}`}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            >
                                                <option value="">{t('alerts.select_station')}</option>
                                                {policeStations.filter(p=>parseInt(p.revenue_district) === parseInt(form.district)).map((ps, index)=>(
                                                    <option key={index} value={ps.cctns_code}>{language === 'ta' ? ps.station_lname : ps.station_name}</option>
                                                ))}
                                            </select>
                                            <div className="invalid-feedback">
                                                { errors.police_station }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-5">
                                        <input 
                                            type="text" 
                                            name="fir_number"
                                            className={`form-control ${errors.fir_number ? 'is-invalid' : ''} `}
                                            onChange={(e) => setForm({...form, [e.target.name]:e.target.value})}
                                            value={form.fir_number}
                                            placeholder='FIR Number'
                                        />
                                        <div className="invalid-feedback">
                                            { errors.fir_number }
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <input 
                                            type="text" 
                                            name="fir_year"
                                            className={`form-control ${errors.fir_year ? 'is-invalid' : ''} `}
                                            onChange={(e) => setForm({...form, [e.target.name]:e.target.value})}
                                            value={form.fir_year}
                                            placeholder='FIR Number'
                                        />
                                        <div className="invalid-feedback">
                                            { errors.fir_year }
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
                { Object.keys(petitions).length > 0 && (
                <table className="table table-bordered table-striped mt-5 table-sm">
                    <thead className="bg-info">
                        <tr>
                            <th>Filing Number</th>
                            <th>Litigants</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        { petitions.map((p, index) => (
                            <tr key={index}>
                                <td>
                                    <Link to={`/filing/detail/`} state={{ efile_no: p.petition.efile_number }}>
                                        {`${p.petition.filing_type?.type_name}/${p.petition.filing_number}/${p.petition.filing_year}`}
                                    </Link>        
                                </td>
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

export default FIRSearch