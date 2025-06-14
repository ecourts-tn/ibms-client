import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from 'api'
import '../style.css'
import BasicDetails from 'components/court/common/BasicDetails'
import Petitioner from 'components/court/common/Petitioner'
import Respondent from 'components/court/common/Respondent'
import Grounds from 'components/court/common/Grounds'
import AdvocateDetails from 'components/court/common/AdvocateDetails'
import FeesDetails from 'components/court/common/FeesDetails'
import { toast, ToastContainer } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import DocumentList from 'components/court/common/DocumentList'
import Loading from 'components/utils/Loading'
import { CourtContext } from 'contexts/CourtContext'
import { LanguageContext } from 'contexts/LanguageContex'
import { AuthContext } from 'contexts/AuthContext'
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";
import { MasterContext } from 'contexts/MasterContext'
import * as Yup from 'yup'


const CaseAllocation = () => {

    const {state} = useLocation();
    const navigate = useNavigate()
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    const { masters: { benches }} = useContext(MasterContext)
    const [petition, setPetition] = useState({})
    const [crime, setCrime] = useState({})
    const [litigant, setLitigant] = useState([])
    const [grounds, setGrounds] = useState([])
    const [advocates, setAdvocates] = useState([])
    const [documents, setDocuments] = useState([])
    const [fees, setFees] = useState([])
    const [loading, setLoading] = useState(false)
    const {courts} = useContext(CourtContext)
    const {user} = useContext(AuthContext)


    const initialState = {
        judiciary: '',
        bench: '',
        court: '',
        allocation_date: '',
    }
    const[form, setForm] = useState(initialState)
    const[errors, setErrors] = useState({})

    const validationSchema = Yup.object({
        judiciary: Yup.string().required('Judiciary is required'),
    bench: Yup.string()
        .nullable()
        .when('judiciary', (judiciary, schema) => {
        if (parseInt(judiciary) === 1) {
            return schema.required('Bench is required');
        }
        return schema.notRequired();
        }),
    court: Yup.string()
        .nullable()
        .when('judiciary', (judiciary, schema) => { // fixed typo: `judiciay` → `judiciary`
        if (parseInt(judiciary) === 2) {
            return schema.required('Court is required');
        }
        return schema.notRequired(); // this line was missing
        }),
    allocation_date: Yup.string().required('Allocation date is required'),
});

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
            await validationSchema.validate(form, {abortEarly:false})
            setLoading(true)
            form.efile_no = state.efile_no
            const response = await api.post(`court/case/allocation/`, form)
            if(response.status === 200){
                toast.success("Case allocated successfully", {
                    theme:"colored"
                })
                setTimeout(() => {
                    navigate("/court/case/allocation")
                }, 1000)
            }
        }catch(error){
            if(error.inner){
                const newErrors = {}
                error.inner.forEach(err => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
            }
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=> {
        if(petition){
            setForm({...form,
                judiciary: petition.judiciary?.id || ''
            })
        }
    }, [petition])
 
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
                        { petition.judiciary?.id === 1 && (
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-2">Select Bench</label>
                            <div className="col-md-6">
                                <select 
                                    name="bench" 
                                    className={`form-control ${errors.bench ? 'is-invalid' : ''}`}
                                    value={form.bench}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                >
                                    <option value="">Select bench</option>
                                    { benches.map((b, index) => (
                                    <option key={index} value={b.bench_code}>{ b.bench_name }</option>    
                                    ))}
                                </select>
                                <div className="invalid-feedback">{ errors.bench }</div>
                            </div>
                        </div>
                        )}
                        { (petition.judiciary?.id === 2 || petition.judiciary?.id === 3) && (
                        <div className="form-group row">
                            <label htmlFor="" className="col-sm-2">Select Court</label>
                            <div className="col-md-6">
                                <select 
                                    name="court" 
                                    className={`form-control ${errors.court ? 'is-invalid' : ''}`}
                                    value={form.court}
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                >
                                    <option value="">Select Court</option>
                                    { courts.filter((c) => c.establishment === user.establishment?.establishment_code).map((c, index) => (
                                        <option key={index} value={c.court_code}>{ language === 'ta' ? c.court_lname : c.court_name }</option>
                                    ))}  
                                </select>
                                <div className="invalid-feedback">{ errors.court }</div>
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
                                    className={`form-control allocation_date-date-picker ${errors.allocation_date ? 'is-invalid' : ''}`} 
                                    placeholder="DD-MM-YYYY"
                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                />
                                <div className="invalid-feedback">{ errors.allocation_date }</div>
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
    )
}

export default CaseAllocation
