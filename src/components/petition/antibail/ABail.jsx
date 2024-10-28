import React, { useState, useEffect, useRef, useContext } from 'react';
import Button from '@mui/material/Button'
import api from 'api';
import Payment from '../../pages/Payment';
import 'bs-stepper/dist/css/bs-stepper.min.css';
import Stepper from 'bs-stepper';
import ArrowForward from '@mui/icons-material/ArrowForward'
import ArrowBack  from '@mui/icons-material/ArrowBack';
import { toast, ToastContainer } from 'react-toastify';
import GroundsContainer from '../../grounds/GroundsContainer';
import InitialInput from 'components/petition/intervene/InitialInput'
import Petitioner from 'components/petition/intervene/Petitioner'
import AccusedDetails from 'components/petition/intervene/AccusedDetails'
import Respondent from 'components/petition/intervene/Respondent'
import Documents from 'components/petition/intervene/Documents'
import { BaseContext } from 'contexts/BaseContext';
import { DistrictContext } from 'contexts/DistrictContext';
import { StateContext } from 'contexts/StateContext';
import { EstablishmentContext } from 'contexts/EstablishmentContext';
import { CourtContext } from 'contexts/CourtContext';
import { JudiciaryContext } from 'contexts/JudiciaryContext';
import { SeatContext } from 'contexts/SeatContext';
import { BailTypeContext } from 'contexts/BailTypeContext';
import { ComplaintTypeContext } from 'contexts/ComplaintTypeContext';
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next';


const ABail = () => {

    const{efile_no, setEfileNo, fir} = useContext(BaseContext)
    const {states}          = useContext(StateContext)
    const {districts}       = useContext(DistrictContext)
    const {establishments}  = useContext(EstablishmentContext)
    const {courts}          = useContext(CourtContext)
    const {courttypes}      = useContext(JudiciaryContext)
    const {benchtypes}      = useContext(SeatContext)
    const {bailtypes}       = useContext(BailTypeContext)
    const {complainttypes}  = useContext(ComplaintTypeContext)
    const {t} = useTranslation()

    const[grounds, setGrounds] = useState([])
    const[petition, setPetition] = useState({})
    const[petitioners, setPetitioners] = useState([])
    const[respondents, setRespondents] = useState([])
    const[advocates, setAdvocates]     = useState([])
    const[errors, setErrors] = useState({})

    const initialState = {
        efile_no: '',
    }

    const[form, setForm] = useState(initialState);
    const[cases, setCases] = useState([])
    const[searchPetition, setSearchPetition] = useState(1)
    const[searchForm, setSearchForm] = useState({
        case_type:null,
        case_number: undefined,
        case_year: undefined
    })
    const searchSchema = Yup.object({
        case_type: Yup.string().required("Please select the case type"),
        case_number: Yup.number().required("Please enter case number"),
        case_year: Yup.number().required("Please enter the case year")
    })

    const[searchErrors, setSearchErrors]            = useState({})

    const stepperRef = useRef(null);

    useEffect(() => {
        stepperRef.current = new Stepper(document.querySelector('#stepper1'), {
        linear: false,
        animation: true,
        });
    }, []);

    console.log(petition)
    

    const handleChange = (e) => {
            const {name, value} = e.target
            setForm({...form, [name]:value})
    }

    const deleteAdvocate = (advocate) => {
        const newAdvocate = advocates.filter((adv) => { return adv.id !== advocate.id})
        setAdvocates(newAdvocate)
    }

    const deleteRespondent = (respondent) => {
        const newRespondent = respondents.filter((res) => { return res.id !== respondent.id })
        setRespondents(newRespondent)
    }


    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get(`case/filing/submitted-list/`)
                if(response.status === 200){
                    setCases(response.data)
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchData();
    },[])

    console.log(cases)

    useEffect(() => {
        async function fetchDetails(){
            try{
                const response = await api.get("case/filing/detail/", {params: {efile_no:form.efile_no}})
                if(response.status === 200){
                    setPetition(response.data.petition)
                    setPetitioners(response.data.litigant.filter(l=>l.litigant_type===1))
                    setRespondents(response.data.litigant.filter(l=>l.litigant_type===2))
                    setAdvocates(response.data.advocate)
                }
            }catch(error){
                console.log(error)
            }
        }
        if(form.efile_no!== ''){
            fetchDetails()
        }
    },[form.efile_no])

    console.log(petition)
    const handleSearch = async(e) => {
        e.preventDefault()
        try{
            // await searchSchema.validate(searchForm, { abortEarly:false})
            const response = await api.get("api/bail/petition/detail/", { params: searchForm})
            if(response.status === 200){
                console.log(response.data)
                setForm({...form, cino:response.data.petition.cino})
            }
            if(response.status === 404){
                toast.error("Petition details not found",{
                    theme:"colored"
                })
            }
        }catch(error){
            const newError = {}
            if(error.inner){
                error.inner.forEach((err) => {
                    newError[err.path] = err.message
                });
                setSearchErrors(newError)
            }
            if(error){
                toast.error(error.response.message,{
                    theme:"colored"
                })
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await api.post("api/bail/surety/create/", form, {
                headers: {
                    'content-type': 'multipart/form-data',
                    // 'X-CSRFTOKEN': CSRF_TOKEN
                  }
            })
            if(response.status === 201){
                toast.success("Petition submitted successfully", {
                    theme:'colored'
                })
                setForm(initialState)
            }
        }catch(error){
            console.log(error)
        }
    }

    return(
        <>
            <ToastContainer />
            <div className="container-fluid px-md-5">
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb" className="mt-2 mb-1">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="#">{t('home')}</a></li>
                                <li className="breadcrumb-item"><a href="#">{t('filing')}</a></li>
                                <li className="breadcrumb-item active" aria-current="page">{t('abail')}</li>
                            </ol>
                        </nav>
                        <div className="card">
                            <div className="card-body p-1" style={{minHeight:'500px'}}>
                                <div id="stepper1" className="bs-stepper">
                                    <div className="bs-stepper-header mb-3">
                                        <div className="step" data-target="#initial-input">
                                            <button className="step-trigger">
                                            <span className="bs-stepper-circle">1</span>
                                            <span className="bs-stepper-label">{t('basic_details')}</span>
                                            </button>
                                        </div>
                                        <div className="line"></div>
                                        <div className="step" data-target="#petitioner">
                                            <button className="step-trigger">
                                            <span className="bs-stepper-circle">2</span>
                                            <span className="bs-stepper-label">{t('petitioner_details')}</span>
                                            </button>
                                        </div>
                                        <div className="line"></div>
                                        <div className="step" data-target="#accused">
                                            <button className="step-trigger">
                                            <span className="bs-stepper-circle">3</span>
                                            <span className="bs-stepper-label">{t('accused_details')}</span>
                                            </button>
                                        </div>
                                        <div className="line"></div>
                                        <div className="step" data-target="#respondent">
                                            <button className="step-trigger">
                                            <span className="bs-stepper-circle">4</span>
                                            <span className="bs-stepper-label">{t('respondent_details')}</span>
                                            </button>
                                        </div>
                                        <div className="line"></div>
                                        <div className="step" data-target="#grounds">
                                            <button className="step-trigger">
                                            <span className="bs-stepper-circle">5</span>
                                            <span className="bs-stepper-label">{t('ground')}</span>
                                            </button>
                                        </div>
                                        <div className="line"></div>
                                        <div className="step" data-target="#documents">
                                            <button className="step-trigger">
                                            <span className="bs-stepper-circle">6</span>
                                            <span className="bs-stepper-label">{t('upload_documents')}</span>
                                            </button>
                                        </div>
                                        <div className="line"></div>
                                        <div className="step" data-target="#payment">
                                            <button className="step-trigger">
                                            <span className="bs-stepper-circle">7</span>
                                            <span className="bs-stepper-label">{t('payment_details')}</span>
                                            </button>
                                        </div>
                                        <div className="line"></div>
                                        <div className="step" data-target="#efile">
                                            <button className="step-trigger">
                                            <span className="bs-stepper-circle">8</span>
                                            <span className="bs-stepper-label">{t('efile')}</span>
                                            </button>
                                        </div> 
                                    </div>
                                    <div className="bs-stepper-content">
                                        <div id="initial-input" className="content">
                                            <InitialInput></InitialInput>
                                        </div>
                                        <div id="petitioner" className="content">
                                            <Petitioner />
                                        </div>
                                        <div id="accused" className="content">
                                            <AccusedDetails />
                                        </div>
                                        <div id="respondent" className="content">
                                            <Respondent />
                                        </div>
                                        <div id="grounds" className="content">
                                            <GroundsContainer />
                                        </div>
                                        <div id="documents" className="content">
                                            <Documents />
                                        </div>
                                        <div id="payment" className="content">
                                            <Payment />
                                        </div>
                                        <div id="efile" className="content text-center">
                                            <Button
                                                variant='contained'
                                                color='success'
                                                className="mt-4"
                                            >Final Submit</Button>
                                        </div>
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

export default ABail;