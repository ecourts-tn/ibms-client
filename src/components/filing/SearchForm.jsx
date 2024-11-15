import React, {useState, useEffect, useContext} from 'react'
import { useTranslation } from 'react-i18next'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'
import * as Yup from 'yup'
import { StateContext } from 'contexts/StateContext'
import { DistrictContext } from 'contexts/DistrictContext'
import { EstablishmentContext } from 'contexts/EstablishmentContext'
import { BenchTypeContext } from 'contexts/BenchTypeContext'
import api from 'api'


const SearchForm = ({onSearch}) => {
    const {t} = useTranslation()
    const {states} = useContext(StateContext)
    const {districts} = useContext(DistrictContext)
    const {establishments} = useContext(EstablishmentContext)
    const {benchtypes} = useContext(BenchTypeContext)
    const[searchForm, setSearchForm] = useState({
        court_type:1,
        bench_type:'',
        state:'',
        district:'',
        establishment:'',
        case_type: '',
        reg_number: '',
        reg_year: ''
    })

    const searchSchema = Yup.object({
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
        case_type: Yup.string().required(t('errors.case_type_required')),
        reg_number: Yup.number().typeError(t('errors.numeric')).required(),
        reg_year: Yup.number().typeError(t('errors.numeric')).required()
    })

    const[errors, setErrors] = useState({})
    console.log(errors)
    const handleSubmit = async(e) => {
        e.preventDefault();
        await searchSchema.validate(searchForm, {abortEarly:false})
        try{
            const {response} = await api.post("case/search/registration-number/", searchForm)
            if(response.status === 200){
                onSearch(response.data)
            }
        }catch(error){
            console.error(error)
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
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-md-12 d-flex justify-content-center">
                    <div className="form-group">
                        <div className="icheck-success d-inline mx-2">
                            <input 
                                type="radio" 
                                name="court_type" 
                                id="court_type_hc" 
                                value={ searchForm.court_type }
                                checked={parseInt(searchForm.court_type) === 1 ? true : false }
                                onChange={(e) => setSearchForm({...searchForm, [e.target.name]: 1, state:'', district:'', establishment:''})} 
                            />
                            <label htmlFor="court_type_hc">{t('high_court')}</label>
                        </div>
                        <div className="icheck-success d-inline mx-2">
                            <input 
                                type="radio" 
                                id="court_type_dc" 
                                name="court_type" 
                                value={searchForm.court_type}
                                checked={parseInt(searchForm.court_type) === 2 ? true : false } 
                                onChange={(e) => setSearchForm({...searchForm, [e.target.name]: 2, bench_type:''})}
                            />
                            <label htmlFor="court_type_dc">{t('district_court')}</label>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 offset-md-3">
                    { parseInt(searchForm.court_type) === 2 && (
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="">{t('state')}</label>
                                    <select 
                                        name="state" 
                                        className={`form-control ${errors.state ? 'is-invalid': ''}`}
                                        onChange={(e) => setSearchForm({...searchForm, [e.target.name]: e.target.value})}
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
                                        className={`form-control ${errors.district ? 'is-invalid': ''}`}
                                        onChange={(e) => setSearchForm({...searchForm, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">Select district</option>
                                        { districts.filter(district => parseInt(district.state) === parseInt(searchForm.state)).map((district, index) => (
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
                        { parseInt(searchForm.court_type) === 2 && (
                        <div className="col-md-8">
                            <div className="form-group">
                                <label htmlFor="">{t('est_name')}</label>
                                <select 
                                    name="establishment" 
                                    className={`form-control ${errors.establishment ? 'is-invalid': ''}`}
                                    onChange={(e) => setSearchForm({...searchForm, [e.target.name]: e.target.value})}
                                >
                                    <option value="">Select establishment</option>
                                    {establishments.filter(est=>parseInt(est.district) === parseInt(searchForm.district)).map((estd, index)=>(
                                        <option key={index} value={estd.establishment_code}>{estd.establishment_name}</option>
                                    ))}
                                </select>
                                <div className="invalid-feedback">
                                    { errors.establishment }
                                </div>
                            </div>
                        </div>
                        )}
                        { parseInt(searchForm.court_type) === 1 && (
                        <div className="col-md-8">
                            <div className="form-group">
                                <label htmlFor="">{t('hc_bench')}</label>
                                <select 
                                    name="bench_type" 
                                    className={`form-control ${errors.bench_type ? 'is-invalid': ''}`}
                                    onChange={(e) => setSearchForm({...searchForm, [e.target.name]: e.target.value})}
                                >
                                    <option value="">Select bench</option>
                                    {benchtypes.map((b, index)=>(
                                        <option key={index} value={b.bench_code}>{b.bench_type}</option>
                                    ))}
                                </select>
                                <div className="invalid-feedback">
                                    { errors.bench_type }
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
                                onChange={(e)=> setSearchForm({...searchForm, [e.target.name]: e.target.value})}
                            >
                                <option value="">Select case type</option>
                                <option value="1">Bail Application</option>
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
                                            value={searchForm.reg_number}
                                            onChange={(e)=> setSearchForm({...searchForm, [e.target.name]: e.target.value })}
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
                                            value={searchForm.reg_year}
                                            onChange={(e)=> setSearchForm({...searchForm, [e.target.name]: e.target.value })}
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
                                        type='submit'
                                        // onClick={handleSearch}
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
    )
}

export default SearchForm