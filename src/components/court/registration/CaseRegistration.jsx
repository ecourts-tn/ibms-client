import api from 'api'
import React from 'react'
import * as Yup from 'yup'
import { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
<<<<<<< HEAD
import BasicDetails from 'components/court/scrutiny/BasicDetails';
import Petitioner from 'components/court/scrutiny/Petitioner';
import Respondent from 'components/court/scrutiny/Respondent';
import Grounds from 'components/court/scrutiny/Grounds';
import AdvocateDetails from 'components/court/scrutiny/AdvocateDetails';
import DocumentList from 'components/court/scrutiny/DocumentList';
import CrimeDetails from 'components/court/scrutiny/CrimeDetails';
=======
import BasicDetails from 'components/court/common/BasicDetails';
import Petitioner from 'components/court/common/Petitioner';
import Respondent from 'components/court/common/Respondent';
import Grounds from 'components/court/common/Grounds';
import AdvocateDetails from 'components/court/common/AdvocateDetails';
import DocumentList from 'components/court/common/DocumentList';
import CrimeDetails from 'components/court/common/CrimeDetails';
>>>>>>> deena

const CaseRegistration = () => {

    const {state} = useLocation();
    const navigate = useNavigate()
    const {t} = useTranslation()

    const[petition, setPetition] = useState({})
    const[crime, setCrime] = useState({})
    const[litigant, setLitigant] = useState([])
    const[advocates, setAdvocates] = useState([])
    const[grounds, setGrounds] = useState([])
    const[documents, setDocuments] = useState([])

    const initialState = {
        date_of_registration: '',
        first_hearing: ''
    }
    const[form, setForm] = useState(initialState)
    const[errors, setErrors] = useState({})

    const validationSchema = Yup.object({
        date_of_registration: Yup.string().required("Registration date cannot be empty"),
        first_hearing : Yup.string().required("Hearing date cannot be empty")
    })

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.post(`court/petition/detail/`, {efile_no:state.efile_no})
                if(response.status === 200){
                    const { petition, litigants, grounds, advocates, crime, documents} = response.data
                    setPetition(petition)
                    setLitigant(litigants)
                    setCrime(crime)
                    setGrounds(grounds)
                    setAdvocates(advocates)
                    setDocuments(documents)
                }
            }catch(err){
                console.log(err)
            }
        }
        fetchData()
    }, [])

    const handleSubmit = async() => {
        try{
            await validationSchema.validate(form, {abortEarly:false})
            const response = await api.post(`court/registration/`, form, {params:{efile_no:state.efile_no}})
            if(response.status === 200){
                toast.success("Petition registered successfully", {
                    theme:"colored"
                })
                setForm(initialState)
                setTimeout(() => {
                    navigate("/court/case/registration/")
                }, 2000)
            }
        }catch(error){
            if(error.inner){
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors);
            }
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="content-wrapper">
                <div className="container-fluid">
                    <div className="card card-outline card-primary" style={{minHeight:'600px'}}>
                        <div className="card-header">
                            <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>{t('registration')}</strong></h3>
                        </div>
                        <div className="card-body">
                            <div>
                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                    <li className="nav-item">
                                        <a className="nav-link active" id="basic-tab" data-toggle="tab" href="#basic" role="tab" aria-controls="basic" aria-selected="true">{t('basic_details')}</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="litigant-tab" data-toggle="tab" href="#litigant" role="tab" aria-controls="litigant" aria-selected="false">{t('litigants')}</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="grounds-tab" data-toggle="tab" href="#grounds" role="tab" aria-controls="grounds" aria-selected="false">{t('ground')}</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="previous-tab" data-toggle="tab" href="#previous" role="tab" aria-controls="previous" aria-selected="false">{t('previous_case_details')}</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="advocate-tab" data-toggle="tab" href="#advocate" role="tab" aria-controls="advocate" aria-selected="false">{t('advocate_details')} & {t('documents')}</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="registration-tab" data-toggle="tab" href="#registration" role="tab" aria-controls="registration" aria-selected="false">{t('registration')}</a>
                                    </li>
                                </ul>
                                <div className="tab-content" id="myTabContent">
                                    <div className="tab-pane fade show active mt-3" id="basic" role="tabpanel" aria-labelledby="basic-tab">
                                        <BasicDetails petition={petition} />
                                        <CrimeDetails crime={crime} />
                                    </div>
                                    <div className="tab-pane fade" id="litigant" role="tabpanel" aria-labelledby="litigant-tab">
                                        <div className="my-3">
                                            <Petitioner litigant={litigant} />
                                            <Respondent litigant={litigant} />
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="grounds" role="tabpanel" aria-labelledby="grounds-tab">
                                        <div className="my-2">
                                            <Grounds grounds={grounds} />
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="previous" role="tabpanel" aria-labelledby="previous-tab">

                                    </div>
                                    <div className="tab-pane fade" id="advocate" role="tabpanel" aria-labelledby="advocate-tab">
                                        <AdvocateDetails 
                                            advocates={advocates} 
                                            petition={petition}
                                        />
                                        <DocumentList 
                                            documents={documents}
                                        />
                                    </div>
                                    <div className="tab-pane fade" id="registration" role="tabpanel" aria-labelledby="registration-tab">
                                        <form>
                                            <div className="row mt-5">
                                                <div className="col-md-6 offset-3">
                                                    <div className="form-group row">
                                                        <label htmlFor="date_of_registration" className="col-sm-3">{t('date_of_registration')}</label>
                                                        <div className="col-sm-4">
                                                            <input 
                                                                type="date" 
                                                                className={`form-control ${errors.date_of_registration ? 'is-invalid' : null}`}
                                                                name="date_of_registration"
                                                                value={form.date_of_registration}
                                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value })}
                                                            />
                                                            <div className="invalid-feedback">
                                                                { errors.date_of_registration }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label htmlFor="first_hearing" className="col-sm-3">{t('date_of_hearing')}</label>
                                                        <div className="col-sm-4">
                                                            <input 
                                                                type="date" 
                                                                className={`form-control ${errors.first_hearing ? 'is-invalid' : null }`}
                                                                name="first_hearing"
                                                                value={form.first_hearing}
                                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})} 
                                                            />
                                                            <div className="invalid-feedback">
                                                                { errors.first_hearing }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 offset-md-4">
                                                    <Button 
                                                        variant="contained" 
                                                        color="success"
                                                        onClick={handleSubmit}
                                                    >{t('submit')}</Button>
                                                </div>
                                            </div>
                                        </form>
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

export default CaseRegistration








