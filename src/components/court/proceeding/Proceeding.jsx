import React, {useState, useEffect, useContext} from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { formatDBDate } from 'utils'
import api from 'api'
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form'
import * as Yup from 'yup'
import { AuthContext } from 'contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import { StateContext } from 'contexts/StateContext'
import { DistrictContext } from 'contexts/DistrictContext'
import { EstablishmentContext } from 'contexts/EstablishmentContext'
import { CourtContext } from 'contexts/CourtContext'
import { PoliceStationContext } from 'contexts/PoliceStationContext'
import { JudgeContext } from 'contexts/JudgeContext'
import { useNavigate } from 'react-router-dom'
import { MasterContext } from 'contexts/MasterContext'

const Proceeding = ({efile_no}) => {
    const {user} = useContext(AuthContext)
    const {t} = useTranslation()
    const navigate = useNavigate()
    const {language} = useContext(LanguageContext)
    const[petition, setPetition] = useState({})
    const[litigant, setLitigant] = useState([])
    const { masters: {
        states, 
        districts
    }} = useContext(MasterContext)
    const{establishments} = useContext(EstablishmentContext)
    const{courts} = useContext(CourtContext)
    const{policeStations} = useContext(PoliceStationContext)
    const {judge} = useContext(JudgeContext)
    const initialState = {
        efile_no: '',
        cino: '',
        case_number: '',
        proceeding: '',
        vakalath_filed: false,
        accused: '',
        condition: false,
        bond_type: 1,
        bond_amount:'',
        appear_location: '',
        condition_state:'',
        condition_district: '',
        condition_establishment: '',
        condition_court: '',
        police_station:'',
        establishment: '',
        court:'',
        jocode:'',
        condition_time:'',
        condition_duration:'',
        is_bond:false,
        is_surety:false,
        no_of_surety: 2,
        surety_amount:'',
        other_condition: '',
        todays_date: '2024-09-03',
        next_date:null,
        order_date: '2024-09-03',
        order_remarks: '',
    }
    const[form, setForm] = useState(initialState)
    const [errors, setErrors] = useState({})
    const [selectedItems, setSelectedItems] = useState([]);
    const validationSchema = Yup.object({
        vakalath_filed: Yup.boolean().required(),
        proceeding: Yup.string().required("Please select the proceeding type"),
        accused: Yup.string().required("Please select the accused"),
        bond_type: Yup.string().required("Please select the bond type"),
        no_of_surety: Yup.string().when("bond_type", (bond_type, schema) => {
            if(parseInt(bond_type) === 2){
                return schema.required("Please enter the no of surety")
            }
        }),
        surety_amount: Yup.string().when("proceeding", (proceeding, schema) => {
            if(parseInt(proceeding) === 1){
                return schema.required("Please enter the surety amount")
            }
        }),
        condition: Yup.boolean().required("Please select condition"),
        appear_location: Yup.string().when("condition", (condition, schema) => {
            if(parseInt(condition) === 1){
                return schema.required("Please select the place of condition")
            }
        }),
        condition_state: Yup.string().when("appear_location", (appear_location, schema) => {
            if(parseInt(appear_location) === 1 || parseInt(appear_location) === 2){
                return schema.required("Please select the state")
            }
        }),
        condition_district: Yup.string().when("appear_location", (appear_location, schema) => {
            if(parseInt(appear_location) === 1 || parseInt(appear_location) === 2){
                return schema.required("Please select the district")
            }
        }),
        condition_establishment: Yup.string().when("appear_location", (appear_location, schema) => {
            if(parseInt(appear_location) === 1){
                return schema.required("Please select the estacondition_establishment")
            }
        }),
        condition_court: Yup.string().when("appear_location", (appear_location, schema) => {
            if(parseInt(appear_location) === 1){
                return schema.required("Please select the court")
            }
        }),
        police_station: Yup.string().when("appear_location", (appear_location, schema) => {
            if(parseInt(appear_location) === 2){
                return schema.required("Please select the police station")
            }
        }),
        condition_time: Yup.string().when("condition", (condition, schema) => {
            if(condition){
                return schema.required("Please enter the condition time")
            }
        }),
        condition_duration: Yup.string().when("condition", (condition, schema) => {
            if(condition){
                return schema.required("Please select the condition duration")
            }
        }),
        next_date: Yup.date().when("proceeding", (proceeding, schema) => {
            if(parseInt(proceeding) === 3 || parseInt(proceeding) === 4){
                return schema.required("Please enter the next date")
            }
        }),
        order_remarks: Yup.string().required("Please enter the business remarks")
    })

    // console.log(judge)

    const handleCheckboxChange = (option) => {
        if (selectedItems.includes(option)) {
        setSelectedItems(selectedItems.filter((item) => item !== option));
        } else {
        setSelectedItems([...selectedItems, option]);
        }
    };

    useEffect(() => {
        async function fetchData(){
            if(efile_no){
                try{
                    const response = await api.post(`court/petition/detail/`, {efile_no})
                    if(response.status === 200){

                        setPetition(response.data.petition)
                        setLitigant(response.data.litigants)
                        setForm({
                            ...form, 
                            cino: response.data.petition.cino,
                            efile_no: response.data.petition.efile_number,
                            case_number: response.data.petition.case_no,
                            district: response.data.petition.district.district_code,
                            establishment: response.data.petition.establishment.establishment_code,
                            court: response.data.petition.court.court_code,
                            jocode: judge.judge.jocode
                        })
                    }
                }catch(error){
                    console.log(error)
                }
            }
        }
        fetchData();
    },[])


    const handleSubmit = async () => {
        try{
            // await validationSchema.validate(form, {abortEarly:false})
            // form.jocode = judge.jocode
            const response = await api.post("court/proceeding/create/", form)
            if(response.status === 201){
                setTimeout(() => {
                    toast.success("Proceedings details added successfully", {
                        theme: "colored"
                    })
                }, 1000)
                setForm(initialState)
                navigate("/court/case/proceeding/")
            }
        }catch(error){
            if(error.inner){
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
            }
            if(error.response?.status === 400){
                console.log("error")
                toast.error("Something went wrong",{
                    theme:"colored"
                })
            }

        }
    }

    const handleReset = () => {
        setForm(initialState)
    }

    return (
        <>
            <ToastContainer />
            <div className="card">
                <div className="card-header bg-info">
                    <strong>{t('case_proceedings')}</strong>
                </div>
                <div className="card-body" style={{ height:'700px', overflowY:"scroll"}}>
                    { Object.keys(petition).length > 0 && (
                        <>
                            <input 
                                type="hidden" 
                                name="petition"
                                value={petition}
                            />
                            <input 
                                type="hidden"
                                name="establishment"
                                value={form.establishment} 
                            />
                            <input 
                                type="hidden"
                                name="court"
                                value={form.court} 
                            />
                        </>
                    )}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group row">
                                <label className="col-sm-6">{t('vakalath_filed')}</label>
                                <div className="col-sm-6">
                                    <div className="icheck-success d-inline mx-2">
                                        <input 
                                            type="radio" 
                                            id="radioVakalathFiled1" 
                                            name="vakalath_filed" 
                                            onChange={(e) => setForm({...form, [e.target.name] : true})} 
                                            checked={form.vakalath_filed ? true : false}
                                        />
                                        <label htmlFor="radioVakalathFiled1">{t('yes')}</label>
                                    </div>
                                    <div className="icheck-danger d-inline mx-2">
                                        <input 
                                            type="radio" 
                                            id="radioVakalathFiled2" 
                                            name="vakalath_filed" 
                                            onChange={(e) => setForm({...form, [e.target.name] : false})} 
                                            checked={!form.vakalath_filed ? true : false}/>
                                        <label htmlFor="radioVakalathFiled2">{t('no')}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor="proceeding">{t('proceedings')}</label>
                                <select 
                                    name="proceeding" 
                                    value={form.proceeding} 
                                    className={`form-control ${errors.proceeding ? 'is-invalid' : ''}`}
                                    onChange={(e) => setForm({...form, [e.target.name]:e.target.value})}
                                >
                                    <option value="">Select Proceeding</option>
                                    <option value="1">Allowed</option>
                                    <option value="2">Dismissed</option>
                                    <option value="3">Interim Order</option>
                                    <option value="4">Adjournment</option>
                                </select>
                                <div className="invalid-feedback">
                                    { errors.proceeding }
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 mb-3">
                            <div className="form-group">
                                <label htmlFor="accused">Select Accused</label>
                                <Dropdown>
                                    <Dropdown.Toggle
                                        as="div"
                                        className="form-control d-flex justify-content-between align-items-center"
                                        style={{ cursor: "pointer" }}
                                    >
                                        <span>
                                        {selectedItems.length > 0
                                            ? selectedItems.join(", ")
                                            : "Select Accused"}
                                        </span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={{ width: "100%", backgroundColor:'white' }}>
                                        {litigant.filter(l=>l.litigant_type === 1).map((l, index) => (
                                        <Form.Check
                                            key={index}
                                            type="checkbox"
                                            label={l.litigant_name}
                                            checked={selectedItems.includes(l.litigant_name)}
                                            onChange={() => handleCheckboxChange(l.litigant_name)}
                                            style={{ marginLeft: "10px", marginRight: "10px", marginTop:'10px'}}
                                        />
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                        { parseInt(form.proceeding) !== 2 && (
                        <>
                        <div className="col-md-12">
                            <div className="form-group row">
                                <label className="col-sm-4">{t('bond_type')}</label>
                                <div className="col-sm-8">
                                    <div className="icheck-info d-inline mx-2">
                                        <input 
                                            type="radio" 
                                            id="radioBondType1" 
                                            name="bond_type" 
                                            onChange={(e) => setForm({...form, [e.target.name] : 1})} 
                                            checked={parseInt(form.bond_type) === 1 ? true : false}
                                        />
                                        <label htmlFor="radioBondType1">{t('own_bond')}</label>
                                    </div>
                                    <div className="icheck-info d-inline mx-2">
                                        <input 
                                            type="radio" 
                                            id="radioBondType2" 
                                            name="bond_type" 
                                            onChange={(e) => setForm({...form, [e.target.name] : 2})} 
                                            checked={parseInt(form.bond_type) === 2 ? true : false}/>
                                        <label htmlFor="radioBondType2">{t('surety_bond')}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        { form.bond_type === 2 && (
                        <div className="col-md-12">
                            <div className="form-group row">
                                <label htmlFor="" className="col-sm-4">{t('no_of_surety')}</label>
                                <div className="col-sm-2">
                                    <input 
                                        type="text" 
                                        className={`form-control ${errors.no_of_surety ? 'is-invalid' : ''}`}
                                        name="no_of_surety"
                                        value={form.no_of_surety} 
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    />
                                    <div className="invalid-feedback">
                                        { errors.no_of_surety }
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}
                        <div className="col-md-12">
                            <div className="form-group row">
                                <label htmlFor="" className="col-sm-4">{ form.bond_type === 1 ? t('own_bond_of_rs') : t('surety_bond_of_rs')}</label>
                                <div className="col-sm-4">
                                    <input 
                                        type="text" 
                                        className={`form-control ${errors.surety_amount ? 'is-invalid' : ''}`} 
                                        name="surety_amount"
                                        value={form.surety_amount}
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    />
                                    <div className="invalid-feedback">
                                        { errors.surety_amount }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="form-group row">
                                <label className="col-sm-4">{t('condition')}</label>
                                <div className="col-sm-8">
                                    <div className="icheck-success d-inline mx-2">
                                        <input 
                                            type="radio" 
                                            id="radioCondition1" 
                                            name="condition" 
                                            onChange={(e) => setForm({...form, [e.target.name] : true})} 
                                            checked={form.condition ? true : false}
                                        />
                                        <label htmlFor="radioCondition1">{t('yes')}</label>
                                    </div>
                                    <div className="icheck-danger d-inline mx-2">
                                        <input 
                                            type="radio" 
                                            id="radioCondition2" 
                                            name="condition" 
                                            onChange={(e) => setForm({...form, [e.target.name] : false})} 
                                            checked={!form.condition ? true : false}/>
                                        <label htmlFor="radioCondition2">{t('no')}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        { form.condition && (
                        <div className="col-md-12">
                            <div className="form-group row">
                                <label className="col-sm-4">{t('condition_place')}</label>
                                <div className="col-sm-8">
                                    <select 
                                        name="appear_location" 
                                        className={`form-control ${errors.appear_location ? 'is-invalid' : ''}`}
                                        value={form.appear_location}
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">{ language === 'ta' ? 'இடம் தேர்ந்தெடுக்கவும்' : 'Select place'}</option>
                                        <option value="1">{ language === 'ta' ? 'நீதிமன்றம்' : 'Court'}</option>
                                        <option value="2">{ language === 'ta' ? 'காவல் நிலையம்' : 'Police Station'}</option>
                                        <option value="3">{ language === 'ta' ? 'மற்றவை' : 'Other'}</option>
                                    </select>
                                    <div className="invalid-feedback">
                                        { errors.appear_location }
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}
                        { form.condition && form.appear_location !== '' && (
                        <>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="">{t('state')}</label>
                                    <select 
                                        name="condition_state"
                                        className={`form-control ${errors.condition_state ? 'is-invalid' : ''}`}
                                        value={form.condition_state}
                                        onChange={(e) => setForm({...form, [e.target.name] : e.target.value})}
                                    >
                                        <option value="">{t('alerts.select_state')}</option>
                                        {states.map((state, index) => (
                                        <option key={index} value={state.state_code}>{ language === 'ta' ? state.state_lname : state.state_name}</option>   
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">
                                        { errors.condition_state }
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="">{t('district')}</label>
                                    <select 
                                        name="condition_district" 
                                        className={`form-control ${errors.condition_district ? 'is-invalid' : ''}`}
                                        value={form.condition_district}
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value })}
                                    >
                                        <option value="">{t('alerts.select_district')}</option>
                                        {districts.filter(d => parseInt(d.state) === parseInt(form.condition_state)).map((district, index) => (
                                        <option key={index} value={district.district_code}>{ language === 'ta' ? district.district_lname : district.district_name}</option>    
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">
                                        { errors.condition_district }
                                    </div>
                                </div>
                            </div>
                        { parseInt(form.appear_location) === 1 && (
                        <>
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="">{t('est_name')}</label>
                                    <select 
                                        name="condition_establishment"
                                        className={`form-control ${errors.condition_establishment ? 'is-invalid' : ''}`}
                                        value={form.condition_establishment}
                                        onChange={(e) => setForm({...form, [e.target.name] : e.target.value })}
                                    >
                                        <option value="">{t('alerts.select_establishment')}</option>
                                        { establishments.filter(e=>parseInt(e.district) === parseInt(form.condition_district)).map((est, index)=>(
                                        <option key={index} value={est.establishment_code}>{language === 'ta' ? est.establishment_lname : est.establishment_name}</option>
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">
                                        { errors.condition_establishment }
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="">{t('court')}</label>
                                    <select 
                                        name="condition_court"
                                        className={`form-control ${errors.condition_court ? 'is-invalid' : ''}`}
                                        value={form.condition_court}
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">{t('alerts.select_court')}</option>
                                        {courts.filter(c=>c.establishment === form.condition_establishment).map((court, index) => (
                                        <option key={index} value={court.court_code} >{language === 'ta' ? court.court_lname : court.court_name}</option>
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">
                                        { errors.condition_court }
                                    </div>
                                </div>
                            </div>
                        </>
                        )}
                        { parseInt(form.appear_location) === 2 && (
                        <>
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="">{t('police_station')}</label>
                                    <select 
                                        name="police_station" 
                                        className={`form-control ${errors.police_station ? 'is-invalid' : ''}`}
                                        value={form.police_station}
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value })}
                                    >
                                        <option value="">{t('alerts.select_station')}</option>
                                        {policeStations.filter(p=>parseInt(p.revenue_district) === parseInt(form.condition_district)).map((ps, index)=>(
                                            <option key={index} value={ps.cctns_code}>{language === 'ta' ? ps.station_lname : ps.station_name}</option>
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">
                                        { errors.police_station }
                                    </div>
                                </div>
                            </div>
                        </>    
                        )}
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="">{t('condition_time')}</label>
                                    <input 
                                        type="text" 
                                        className={`form-control ${errors.condition_time ? 'is-invalid' : ''}`}
                                        name="condition_time"
                                        value={form.condition_time}
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} 
                                    />
                                    <div className="invalid-feedback">
                                        { errors.condition_time }
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="">{t('condition_duration')}</label>
                                    <select 
                                        name="condition_duration"
                                        className={`form-control ${errors.condition_duration ? 'is-invalid' : ''}`}
                                        value={form.condition_duration}
                                        onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                    >
                                        <option value="">Select station</option>
                                        <option value="1">Until Further Order</option>
                                        <option value="2">Whenever Need</option>
                                    </select>
                                    <div className="invalid-feedback">
                                        { errors.condition_duration }
                                    </div>
                                </div>
                            </div>
                        </>
                        )}
                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor="">{t('other_condition')}</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="other_condition"
                                    value={form.other_condition}
                                    onChange={(e)=>setForm({...form,[e.target.name]:e.target.value})}
                                />
                            </div>
                        </div>
                        { (parseInt(form.proceeding) === 3 || parseInt(form.proceeding) === 4) && (
                        <>
                            <div className="col-md-12">
                                <div className="form-group row">
                                    <label htmlFor="" className="col-sm-2 mt-2">{t('next_date')}</label>
                                    <div className="col-sm-4">
                                        <input 
                                            type="date" 
                                            className={`form-control ${errors.next_date ? 'is-invalid' : ''}`}
                                            name="next_date"
                                            value={form.next_date}
                                            onChange={(e) =>setForm({...form,[e.target.name]:e.target.value})}
                                        />
                                        <div className="invalid-feedback">
                                            { errors.next_date }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>    
                        )}
                        </>
                        )}

                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor="">{t('remarks')}</label>
                                <textarea 
                                    name="order_remarks" 
                                    cols="30" 
                                    rows="5" 
                                    className={`form-control ${errors.order_remarks ? 'is-invalid' : ''}`}
                                    value={form.order_remarks}
                                    onChange={(e)=>setForm({...form, [e.target.name]:e.target.value})}
                                ></textarea>    
                                <div className="invalid-feedback">
                                    { errors.order_remarks }    
                                </div>            
                            </div>
                        </div>
                        { efile_no && (
                        <div className="col-md-12">
                            <div className="form-group text-center">
                                <button 
                                    className="btn btn-success px-3"
                                    onClick={handleSubmit}
                                >{t('submit')}</button>
                                <button 
                                    className="btn btn-secondary px-3 ml-1"
                                    onClick={handleReset}
                                >{t('reset')}</button>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Proceeding
