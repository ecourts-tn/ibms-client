import api from 'api'
import * as Yup from 'yup'
import React, {useState, useEffect, useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import {toast, ToastContainer} from 'react-toastify'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import { MasterContext } from 'contexts/MasterContext'
import { RequiredField } from 'utils'
import Loading from 'components/utils/Loading'
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";
import { EstablishmentContext } from 'contexts/EstablishmentContext'
import { CourtContext } from 'contexts/CourtContext'

const ProsecutorForm = () => {

    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    const {masters: {
        states,
        districts,
        seats,
        benches,
    }} = useContext(MasterContext)
    const { establishments } = useContext(EstablishmentContext)
    const { courts } = useContext(CourtContext)
    const navigate = useNavigate()
    const initialState = {
        judiciary: 1,
        ppcode: '',
        seat: '',
        bench: '',
        state: '',
        district: '',
        establishment: '',
        court: '',
        prosecutor_name: '',
        designation:'',
        joining_date:null,
        releiving_date:null,
        is_incharge: false
    }
    const [form, setForm] = useState(initialState)
    const [search, setSearch] = useState('')
    const [advocateAvailable, setAdvocateAvailable] = useState(false)
    const [errors, setErrors] = useState({})
    const[loading, setLoading] = useState(false)
    const validationSchema = Yup.object({
        judiciary: Yup.string().required(),
        prosecutor_name: Yup.string().required(),
        designation: Yup.string().required(),
        joining_date: Yup.string().required(),
    })

    const joining_date_Display = (date) => {
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    
    const joining_date_Backend = (date) => {
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    };
    
    useEffect(() => {
        const joining_date = flatpickr(".joining_date-date-picker", {
            dateFormat: "d-m-Y",
            maxDate: "today",
            defaultDate: form.joining_date ? joining_date_Display(new Date(form.joining_date)) : '',
            onChange: (selectedDates) => {
                const formattedDate = selectedDates[0] ? joining_date_Backend(selectedDates[0]) : "";
                setForm({ ...form, joining_date: formattedDate });
            },
        });

        return () => {
            if (joining_date && typeof joining_date.destroy === "function") {
                joining_date.destroy();
            }
        };
    }, [form]);

    const releiving_date_Display = (date) => {
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    
    const releiving_date_Backend = (date) => {
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    };
    
    useEffect(() => {
        const releiving_date = flatpickr(".releiving_date-date-picker", {
            dateFormat: "d-m-Y",
            // maxDate: "today",
            defaultDate: form.releiving_date ? releiving_date_Display(new Date(form.releiving_date)) : '',
            onChange: (selectedDates) => {
                const formattedDate = selectedDates[0] ? releiving_date_Backend(selectedDates[0]) : "";
                setForm({ ...form, releiving_date: formattedDate });
            },
        });

        return () => {
            if (releiving_date && typeof releiving_date.destroy === "function") {
                releiving_date.destroy();
            }
        };
    }, [form]);

    const handleSearch = async(e) => {
        e.preventDefault();
        if(search === ''){
            alert("Search field should not be blank")
            return
        }
        try{
            setLoading(true)
            const response = await api.post("case/adv/search/", {search})
            if(response.status === 200){
                setForm({...form, prosecutor_name: response.data.username, ppcode: response.data.userlogin})
                setAdvocateAvailable(true)
            }
        }catch(error){
            if(error.response.status === 404){
                toast.error("Details not found", { theme: "colored"})
                setForm({...form, prosecutor_name: ''})
                setAdvocateAvailable(false)
            }
        }finally{
            setLoading(false)
        }
    }
    
    const handleSubmit =  async(e) => {
        e.preventDefault();
        try{
            setLoading(true)
            await validationSchema.validate(form, {abortEarly:false})
            const response = await api.post("base/prosecutor/", form)
            if(response.status === 201){
                toast.success("Prosecutor details added successfully", {
                    theme:"colored"
                })
                setForm(initialState)
            }
        }catch(error){
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
        <div className="card card-outline card-primary vh-100">
            { loading && <Loading />}
            <ToastContainer />
            <div className="card-header">
                <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>{t('prosecutor_details')}</strong></h3>
                <button 
                    className="btn btn-primary btn-sm float-right"
                    onClick={() => navigate('/court/admin/prosecutor/list/')}
                >Prosecutor List</button>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-4">{t('search')} <RequiredField /></label>
                            <div className="col-sm-6">
                                <input 
                                    type="text" 
                                    className={`form-control`}
                                    name="search"
                                    placeholder='Mobile/E-Mail/Bar.Reg. No.'
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <div className="invalid-feedback">
                                    { errors.search }
                                </div>
                            </div>
                            <div className="col-md-2">
                                <button
                                    className='btn btn-secondary'
                                    onClick={handleSearch}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                        { advocateAvailable && (
                        <React.Fragment>
                            <div className="form-group row">
                            <label htmlFor="" className="col-sm-4">{t('prosecutor_name')} <RequiredField /></label>
                            <div className="col-sm-8">
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.prosecutor_name ? 'is-invalid' : ''}`}
                                    name="prosecutor_name"
                                    value={form.prosecutor_name}
                                    readOnly={true}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                />
                                <div className="invalid-feedback">
                                    { errors.prosecutor_name }
                                </div>
                            </div>
                        </div>
                        <div className="form-group row mt-2 mb-3">
                            <div className="col-sm-4">
                                <label htmlFor="">Judiciary</label>
                            </div>
                            <div className="col-md-8">
                                <div className="icheck-success d-inline mx-2">
                                    <input 
                                        type="radio" 
                                        name="judiciary" 
                                        id="judiciaryHC" 
                                        checked={parseInt(form.judiciary) === 1 }
                                        onChange={(e) => setForm({...form, [e.target.name] : 1})} 
                                    />
                                    <label htmlFor="judiciaryHC">High Court</label>
                                </div>
                                <div className="icheck-success d-inline mx-2">
                                    <input 
                                        type="radio" 
                                        id="judiciaryDC" 
                                        name="judiciary" 
                                        value={form.judiciary}
                                        checked={ parseInt(form.judiciary) === 2 } 
                                        onChange={(e) => setForm({...form, [e.target.name] : 2})}
                                    />
                                    <label htmlFor="judiciaryDC">District Judiciary</label>
                                </div>
                            </div>
                        </div> 
                        { parseInt(form.judiciary) === 1 && (
                        <React.Fragment>
                            <div className="form-group row">
                                <label htmlFor="" className="col-sm-4">{t('seat')} <RequiredField /></label>
                                <div className="col-sm-8">
                                    <select
                                        className={`form-control ${errors.seat ? 'is-invalid' : ''}`}
                                        name="seat"
                                        value={form.seat}
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">Select seat</option>
                                        { seats.map((s, index) => (
                                        <option key={index} value={s.seat_code}>{s.seat_name}</option>
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">
                                        { errors.seat }
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="" className="col-sm-4">{t('bench')} <RequiredField /></label>
                                <div className="col-sm-8">
                                    <select
                                        className={`form-control ${errors.bench ? 'is-invalid' : ''}`}
                                        name="bench"
                                        value={form.bench}
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">Select bench</option>
                                        { benches.map((b, index) => (
                                        <option key={index} value={b.bench_code}>{b.bench_name}</option>
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">
                                        { errors.bench }
                                    </div>
                                </div>
                            </div>  
                        </React.Fragment>
                        )}
                        { parseInt(form.judiciary) === 2 && (
                        <React.Fragment>
                            <div className="form-group row">
                                <label htmlFor="" className="col-sm-4">{t('state')} <RequiredField /></label>
                                <div className="col-sm-8">
                                    <select
                                        className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                                        name="state"
                                        value={form.state}
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">Select state</option>
                                        { states.map((s, index) => (
                                        <option key={index} value={s.state_code}>{s.state_name}</option>
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">
                                        { errors.state }
                                    </div>
                                </div>
                            </div> 
                            <div className="form-group row">
                                <label htmlFor="" className="col-sm-4">{t('district')} <RequiredField /></label>
                                <div className="col-sm-8">
                                    <select
                                        className={`form-control ${errors.district ? 'is-invalid' : ''}`}
                                        name="district"
                                        value={form.district}
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">Select district</option>
                                        { districts.filter((d) => parseInt(d.state) === parseInt(form.state)).map((d, index) => (
                                        <option key={index} value={d.district_code}>{d.district_name}</option>
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">
                                        { errors.district }
                                    </div>
                                </div>
                            </div> 
                            <div className="form-group row">
                                <label htmlFor="" className="col-sm-4">{t('establishment')} <RequiredField /></label>
                                <div className="col-sm-8">
                                    <select
                                        className={`form-control ${errors.establishment ? 'is-invalid' : ''}`}
                                        name="establishment"
                                        value={form.establishment}
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">Select establishment</option>
                                        { establishments.filter((e) => parseInt(e.district) === parseInt(form.district)).map((e, index) => (
                                        <option key={index} value={e.establishment_code}>{e.establishment_name}</option>
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">
                                        { errors.establishment }
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="" className="col-sm-4">{t('court')} <RequiredField /></label>
                                <div className="col-sm-8">
                                    <select
                                        className={`form-control ${errors.court ? 'is-invalid' : ''}`}
                                        name="court"
                                        value={form.court}
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">Select court</option>
                                        { courts.filter(c => c.establishment === form.establishment).map((c, index) => (
                                        <option key={index} value={c.court_code}>{c.court_name}</option>
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">
                                        { errors.court }
                                    </div>
                                </div>
                            </div>                              
                        </React.Fragment>
                        )}  
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-4">Designation<RequiredField/></label>
                            <div className="col-sm-8">
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.joining_date ? 'is-invalid' : ''}`} 
                                    name="designation"
                                    value={form.designation}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                />
                                <div className="invalid-feedback">
                                    { errors.designation }
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-4">Joining Date<RequiredField/></label>
                            <div className="col-sm-3">
                                <input 
                                    type="date" 
                                    className={`form-control joining_date-date-picker ${errors.joining_date ? 'is-invalid' : ''}`} 
                                    name="joining_date"
                                    value={form.joining_date ? form.joining_date : ''}
                                    placeholder="DD-MM-YYYY"
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: '1px solid #ccc', 
                                        padding: '8px',            
                                    }}
                                />
                                <div className="invalid-feedback">
                                    { errors.joining_date }
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-4">Releiving Date</label>
                            <div className="col-sm-3">
                                <input 
                                    type="date" 
                                    className={`form-control releiving_date-date-picker ${errors.releiving_date ? 'is-invalid' : ''}`}
                                    name="releiving_date"
                                    value={form.releiving_date ? form.joining_date : ''}
                                    placeholder="DD-MM-YYYY"
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: '1px solid #ccc', 
                                        padding: '8px',            
                                    }}
                                />
                                <div className="invalid-feedback">
                                    { errors.releiving_date }
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-4">Incharge?</label>
                            <div className="col-sm-3">
                                <input 
                                    type="checkbox" 
                                    name="is_incharge"
                                    value={form.is_incharge}
                                    onChange={(e) => setForm({...form, [e.target.name]: !e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-4"></div>
                            <div className="col-sm-4">
                                <Button
                                    variant='contained'
                                    color='success'
                                    onClick={handleSubmit}
                                >{t('submit')}</Button>
                            </div>
                        </div> 
                        </React.Fragment>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProsecutorForm