import React, { useContext } from 'react'
import { useState } from 'react'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import * as Yup from 'yup'
import api from 'api'
import { toast, ToastContainer } from 'react-toastify'
import { StateContext } from 'contexts/StateContext'
import { DistrictContext } from 'contexts/DistrictContext'
import { PoliceStationContext } from 'contexts/PoliceStationContext'
import { useTranslation } from 'react-i18next'


const FIRSearch = () => {

    const {states} = useContext(StateContext)
    const {districts} = useContext(DistrictContext)
    const {policeStations} = useContext(PoliceStationContext)
    const {t} = useTranslation()
    const[form, setForm] = useState({
        state:'',
        district:'',
        police_station:'',
        fir_number:'',
        fir_year:''
    })
    const[errors, setErrors] = useState({})
    const[petition, setPetition] = useState({})
    const validationSchema = Yup.object({
        state: Yup.string().required("Please select state"),
        district: Yup.string().required("Please select district"),
        police_station: Yup.string().required("Please select police station"),
        fir_number: Yup.number().typeError("This field should be numeric").required(),
        fir_year:   Yup.number().typeError("This field should be numeric").required()
    })
    const handleSubmit = async() => {
        try{
            await validationSchema.validate(form, { abortEarly: false})
            const {response} = await api.post("api/case/search/fir-number/", form)
            if(response.status === 200){
                setPetition(response.data)
            }
            if(response.status === 404){
                toast.error(response.data.message, {theme:"colored"})
            }
        }catch(error){
            if(error.inner){
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
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
                                <li className="breadcrumb-item text-primary">{t('home')}</li>
                                <li className="breadcrumb-item text-primary">{t('case_status')}</li>
                                <li className="breadcrumb-item active">{t('fir_number')}</li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-md-12 d-flex justify-content-center">
                        <div className="row">
                            <div className="col-md-8 offset-2">
                            <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="">{t('state')}</label>
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
                                            <label htmlFor="">{t('district')}</label>
                                            <select 
                                                name="district" 
                                                className={`form-control ${errors.district ? 'is-invalid' : ''}`}
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
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="">{t('police_station')}</label>
                                            <select 
                                                name="police_station" 
                                                className={`form-control ${errors.police_station ? 'is-invalid' : ''}`}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            >
                                                <option value="">Select police station</option>
                                                {policeStations.filter(p=>parseInt(p.revenue_district) === parseInt(form.district)).map((ps, index)=>(
                                                    <option key={index} value={ps.cctns_code}>{ps.station_name}</option>
                                                ))}
                                            </select>
                                            <div className="invalid-feedback">
                                                { errors.police_station }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-5">
                                        <FormControl fullWidth>
                                            <TextField
                                                error={errors.fir_number ? true : false}
                                                name="fir_number"
                                                label={t('fir_number')}
                                                value={form.fir_number}
                                                size="small"
                                                helperText={errors.fir_number}
                                                onChange={(e) => setForm({...form, fir_number:e.target.value})}
                                            />
                                        </FormControl>
                                    </div>
                                    <div className="col-md-4">
                                        <FormControl fullWidth>
                                            <TextField
                                                name="fir_year"
                                                error={errors.fir_year ? true : false }
                                                label={t('fir_year')}
                                                value={form.fir_year}
                                                size="small"
                                                helperText={errors.fir_year}
                                                onChange={(e) => setForm({...form, fir_year:e.target.value})}
                                            />
                                        </FormControl>
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
        </>
  )
}

export default FIRSearch