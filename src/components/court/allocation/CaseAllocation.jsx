import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../../../api'
import '../style.css'
import Button from '@mui/material/Button'
import CheckIcon from '@mui/icons-material/CheckCircleRounded'
import CancelIcon from '@mui/icons-material/CancelRounded'
import BasicDetails from 'components/court/common/BasicDetails'
import Petitioner from 'components/court/common/Petitioner'
import Respondent from 'components/court/common/Respondent'
import Grounds from 'components/court/common/Grounds'
import AdvocateDetails from 'components/court/common/AdvocateDetails'
import FeesDetails from 'components/court/common/FeesDetails'
import CrimeDetails from 'components/court/common/CrimeDetails'
import { toast, ToastContainer } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import DocumentList from 'components/court/common/DocumentList'
import Loading from 'components/utils/Loading'
import { CourtContext } from 'contexts/CourtContext'
import { LanguageContext } from 'contexts/LanguageContex'
import { AuthContext } from 'contexts/AuthContext'
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";


const CaseAllocation = () => {

    const {state} = useLocation();
    const navigate = useNavigate()
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)

    const[petition, setPetition] = useState({})
    const[crime, setCrime] = useState({})
    const[litigant, setLitigant] = useState([])
    const[grounds, setGrounds] = useState([])
    const[advocates, setAdvocates] = useState([])
    const[documents, setDocuments] = useState([])
    const[fees, setFees] = useState([])
    const[loading, setLoading] = useState(false)
    const {courts} = useContext(CourtContext)
    const {user} = useContext(AuthContext)


    const initialState = {
        verification_date: null,
        complaince_date: null,
        remarks: '',
        status:1
    }
    const[form, setForm] = useState(initialState)

    const allocation_date_Display = (date) => {
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    
    const allocation_date_Backend = (date) => {
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    };
    
    useEffect(() => {
        const allocation_date = flatpickr(".allocation_date-date-picker", {
            dateFormat: "d-m-Y",
            // maxDate: "today",
            defaultDate: form.allocation_date ? allocation_date_Display(new Date(form.allocation_date)) : '',
            onChange: (selectedDates) => {
                const formattedDate = selectedDates[0] ? allocation_date_Backend(selectedDates[0]) : "";
                setForm({ ...form, allocation_date: formattedDate });
            },
        });

        return () => {
            if (allocation_date && typeof allocation_date.destroy === "function") {
                allocation_date.destroy();
            }
        };
    }, [form]);

    useEffect(() => {
        async function fetchPetitionDetail(){
            try{
                const response = await api.post("court/petition/detail/", {efile_no:state.efile_no})
                if(response.status === 200){
                    const { petition, litigants, grounds, advocates, fees, crime, documents} = response.data
                    setPetition(petition)
                    setLitigant(litigants)
                    setGrounds(grounds)
                    setAdvocates(advocates)
                    setDocuments(documents)
                    setFees(fees)
                    setCrime(crime)
                }
            }catch(err){
                console.log(err)
            }
        }
        fetchPetitionDetail();
    },[])

    const handleSubmit = async() => {
        try{
            setLoading(true)
            form.efile_no = state.efile_no
            const response = await api.post(`court/case/scrutiny/`, form)
            if(response.status === 200){
                toast.success("Petition scrutinized successfully", {
                    theme:"colored"
                })
                setTimeout(() => {
                    navigate("/court/case/scrutiny")
                }, 1000)
            }
        }catch(error){
            toast.error("Something went wrong", {theme:"colored"})
        }finally{
            setLoading(false)
        }
    }
 
    return (
        <div className="card card-outline card-primary mt-3">
            <ToastContainer/>
            {loading && <Loading />}
            <div className="card-header">
                <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>{t('case_allocation')} - {state.efile_no} </strong></h3>
            </div>
            <div className="card-body p-2">
                <div id="accordion">
                    <div className="card m-1">
                        <div className="card-header" id="headingOne">
                            <a data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" href="/#">
                                {t('basic_details')}
                            </a>
                        </div>
                        <div className="card-body p-2">
                            <div id="accordion">
                                <div className="card m-1">
                                    <div className="card-header" id="headingOne">
                                        <a data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" href="/#">
                                            {t('basic_details')}
                                        </a>
                                    </div>
                                    <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                                        <div className="card-body">
                                            <BasicDetails petition={petition}/>
                                            {/* { crime && (<CrimeDetails crime={crime} />)} */}
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="card m-1">
                                    <div className="card-header" id="headingTwo">
                                        <a data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo" href="/#">
                                            {t('litigants')}
                                        </a>
                                    </div>
                                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                                        <div className="card-body p-2">
                                            <Petitioner litigant={litigant} />
                                            <Respondent litigant={litigant} />
                                         </div>
                                    </div>
                                </div>
                                <div className="card m-1">
                                    <div className="card-header" id="headingThree">
                                        <a data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree" href="/#">
                                            {t('ground')}
                                        </a>
                                    </div>
                                    <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                                        <div className="card-body p-2">
                                            <Grounds grounds={grounds} />
                                        </div>
                                    </div>
                                </div>
                                <div className="card m-1">
                                    <div className="card-header" id="headingThree1">
                                        <a data-toggle="collapse" data-target="#collapseThree1" aria-expanded="false" aria-controls="collapseThree1" href="/#">
                                            {t('previous_case_details')}
                                        </a>
                                    </div>
                                    <div id="collapseThree1" className="collapse" aria-labelledby="headingThree1" data-parent="#accordion">
                                        <div className="card-body p-2">
                                            {/* <Grounds grounds={grounds} /> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="card m-1">
                                    <div className="card-header" id="headingFour">
                                        <a data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour" href="/#">
                                            {t('advocate_details')} & {t('documents')}
                                        </a>
                                    </div>
                                    <div id="collapseFour" className="collapse" aria-labelledby="headingFour" data-parent="#accordion">
                                        <div className="card-body p-2">
                                            <AdvocateDetails 
                                                advocates={advocates} 
                                                petition={petition}
                                            />
                                            <DocumentList documents={documents} />
                                        </div>
                                    </div>
                                </div>
                                <div className="card m-1">
                                    <div className="card-header" id="headingFive">
                                        <a data-toggle="collapse" data-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive" href="/#">
                                            {t('payment_details')}
                                        </a>
                                    </div>
                                    <div id="collapseFive" className="collapse" aria-labelledby="headingFour" data-parent="#accordion">
                                        <div className="card-body p-2">
                                            <FeesDetails fees={fees}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row my-4">
                                <div className="col-md-8 offset-md-2">
                                    { user.seat?.seat_code && (
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-2">Select Bench</label>
                                        <div className="col-md-6">
                                            <select name="bench" className="form-control">
                                                
                                            </select>
                                        </div>
                                    </div>
                                    )}
                                    { user.court?.court_code && (
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-2">Select Court</label>
                                        <div className="col-md-6">
                                            <select name="bench" className="form-control">
                                                <option value="">Select Court</option>
                                                { courts.filter((c) => c.establishment === user.establishment?.establishment_code).map((c, index) => (
                                                    <option key={index} value={c.court_code}>{ language === 'ta' ? c.court_lname : c.court_name }</option>
                                                ))}  
                                            </select>
                                        </div>
                                    </div>
                                    )}
                                    <div className="form-group row">
                                        <label htmlFor="" className="col-sm-2">Allocation Date</label>
                                        <div className="col-md-3">
                                            <input 
                                                type="date" 
                                                name="allocation_date"
                                                value={form.allocation_date ? form.allocation_date : ''}
                                                className="form-control allocation_date-date-picker ${errors.joining_date ? 'is-invalid' : ''}" 
                                                placeholder="DD-MM-YYYY"
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    border: '1px solid #ccc', 
                                                    padding: '8px',            
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-2 offset-md-2">
                                            <button 
                                                className="btn btn-success"
                                                onClick={handleSubmit}
                                            >Submit</button>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </div>
                    <div className="card m-1">
                        <div className="card-header" id="headingThree">
                            <a data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree" href="/#">
                                {t('ground')} & {t('previous_case_details')}
                            </a>
                        </div>
                        <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                            <div className="card-body p-2">
                                <Grounds grounds={grounds} />
                            </div>
                        </div>
                    </div>
                    <div className="card m-1">
                        <div className="card-header" id="headingFour">
                            <a data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour" href="/#">
                                {t('advocate_details')} & {t('documents')}
                            </a>
                        </div>
                        <div id="collapseFour" className="collapse" aria-labelledby="headingFour" data-parent="#accordion">
                            <div className="card-body p-2">
                                <AdvocateDetails 
                                    advocates={advocates} 
                                    petition={petition}
                                />
                                <DocumentList documents={documents} />
                            </div>
                        </div>
                    </div>
                    <div className="card m-1">
                        <div className="card-header" id="headingFive">
                            <a data-toggle="collapse" data-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive" href="/#">
                                {t('payment_details')}
                            </a>
                        </div>
                        <div id="collapseFive" className="collapse" aria-labelledby="headingFour" data-parent="#accordion">
                            <div className="card-body p-2">
                                <FeesDetails fees={fees}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row my-4">
                    <div className="col-md-8 offset-md-2">
                        { user.seat?.seat_code && (
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-2">Select Bench</label>
                            <div className="col-md-6">
                                <select name="bench" className="form-control">
                                    
                                </select>
                            </div>
                        </div>
                        )}
                        { user.court?.court_code && (
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-2">Select Court</label>
                            <div className="col-md-6">
                                <select name="bench" className="form-control">
                                    <option value="">Select Court</option>
                                    { courts.filter((c) => c.establishment === user.establishment?.establishment_code).map((c, index) => (
                                        <option key={index} value={c.court_code}>{ language === 'ta' ? c.court_lname : c.court_name }</option>
                                    ))}  
                                </select>
                            </div>
                        </div>
                        )}
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-2">Allocation Date</label>
                            <div className="col-md-3">
                                <input 
                                    type="date" 
                                    name="allocation_date"
                                    value={form.allocation_date}
                                    className="form-control" 
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-2 offset-md-2">
                                <button 
                                    className="btn btn-success"
                                    onClick={handleSubmit}
                                >Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default CaseAllocation
