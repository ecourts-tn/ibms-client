import React, { useEffect, useState } from 'react'
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


const CaseScrutiny = () => {

    const {state} = useLocation();
    const navigate = useNavigate()
    const {t} = useTranslation()

    const[petition, setPetition] = useState({})
    const[crime, setCrime] = useState({})
    const[litigant, setLitigant] = useState([])
    const[grounds, setGrounds] = useState([])
    const[advocates, setAdvocates] = useState([])
    const[documents, setDocuments] = useState([])
    const[fees, setFees] = useState([])

    const initialState = {
        verification_date: null,
        complaince_date: null,
        remarks: '',
        status:1
    }
    const[form, setForm] = useState(initialState)

    const statusOptions = [
        { status: 1, color: "success", icon: <CheckIcon />, label: t('approve') },
        { status: 2, color: "warning", icon: <CancelIcon />, label: t('return') },
        { status: 3, color: "error", icon: <CancelIcon />, label: "Reject" }
    ];

    const renderButton = (status, color, icon, label) => (
        form.status === status && (
          <div className="col-md-2 offset-5">
            <Button
              variant="contained"
              color={color}
              startIcon={icon}
              onClick={handleSubmit}
            >
              {label}
            </Button>
          </div>
        )
    );

    useEffect(() => {
        async function fetchData(){
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
        fetchData();
    },[])
 
    const handleSubmit = async () => {
        if(form.status === 1){
            // update main table only
            try{
                const response = await api.post(`court/case/registration/`, {
                    efile_no: state.efile_no,
                    verification_date: form.verification_date,
                    status:form.status,
                    is_verified:true
                })
                if(response.status === 200){
                    toast.success("Petition verified successfully", {
                        theme:"colored"
                    })
                    setTimeout(() => {
                        navigate("/court/case/scrutiny")
                    }, 2000)
                }
            }catch(error){
                console.log(error)
            }
        }
        else if(form.status === 2){
            // update main table and add objection history
            try{
                const response = await api.post(`court/case/objection/`, {
                    efile_no : state.efile_no,
                    objection_date: form.verification_date,
                    complaince_date: form.complaince_date,
                    remarks: form.remarks
                })
                if(response.status === 201){
                    toast.success("Petition verified successfully", {
                        theme:"colored"
                    })
                    setTimeout(() => {
                        navigate("/court/case/scrutiny/")
                    }, 2000)
                }
            }catch(error){
                console.log(error)
            }
        }
    }

    return (
        <>
            <ToastContainer/>
            <div className="content-wrapper">
                <div className="container-fluid">
                    <div className="card card-outline card-primary mt-3">
                        <div className="card-header">
                            <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>{t('case_scrutiny')} - {state.efile_no} </strong></h3>
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
                                            { crime && (<CrimeDetails crime={crime} />)}
                                            
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
                            { !petition.is_verified && (
                            <div className="row my-3">
                                <div className="col-md-8 offset-2">
                                    <div className="form-group row mt-4">
                                        <label htmlFor="verify" className="col-sm-3">{t('verify')}</label>
                                        <div className="col-sm-9">
                                            <div className="icheck-success d-inline mx-2">
                                                <input 
                                                    type="radio" 
                                                    id="radioVerify1" 
                                                    name="status" 
                                                    onChange={(e) => setForm({...form, status:1})}
                                                    checked={form.status === 1 ? true : false}

                                                />
                                                <label htmlFor="radioVerify1">{t('accept')}</label>
                                            </div>
                                            <div className="icheck-warning d-inline mx-2">
                                                <input 
                                                    type="radio" 
                                                    id="radioVerify2"
                                                    name="status"
                                                    onChange={(e) => setForm({...form, status:2 })}
                                                    checked={form.status === 2 ? true : false }
                                                />
                                                <label htmlFor="radioVerify2">Return</label>
                                            </div>
                                            <div className="icheck-danger d-inline mx-2">
                                                <input 
                                                    type="radio" 
                                                    id="radioVerify3" 
                                                    name="status" 
                                                    onChange={(e) => setForm({...form, status:3})}
                                                    checked={form.status === 3 ? true : false }
                                                />
                                                <label htmlFor="radioVerify3">{'Reject'}</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="date" className="col-sm-3">{form.status === 2 ? t('objection_date') : t('verification_date')}</label>
                                        <div className="col-sm-4">
                                            <input 
                                                type="date" 
                                                className="form-control" 
                                                name="verification_date"
                                                value={form.verification_date}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>
                                { form.status === 2 && (
                                <React.Fragment>
                                    <div className="col-md-8 offset-2">
                                        <div className="form-group row">
                                            <label htmlFor="date" className="col-sm-3">{t('compliance_date')}</label>
                                            <div className="col-sm-4">
                                                <input 
                                                    type="date" 
                                                    className="form-control" 
                                                    name="complaince_date"
                                                    value={form.complaince_date}
                                                    onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-8 offset-2">
                                        <div className="form-group">
                                            <label htmlFor="remarks">{t('remarks')}</label>
                                            <textarea 
                                                name="remarks" 
                                                className="form-control" 
                                                rows="2"
                                                value={form.remarks}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            ></textarea>
                                        </div>
                                    </div>
                                </React.Fragment>
                                )}
                                { form.status === 3 && (
                                <React.Fragment>
                                    <div className="col-md-8 offset-2">
                                        <div className="form-group">
                                            <label htmlFor="remarks">Reason for reject</label>
                                            <textarea 
                                                name="remarks" 
                                                className="form-control" 
                                                rows="2"
                                                value={form.remarks}
                                                onChange={(e) => setForm({...form, [e.target.name]: e.target.value})}
                                            ></textarea>
                                        </div>
                                    </div>
                                </React.Fragment>
                                )}
                                {statusOptions.map((option) =>
                                    renderButton(option.status, option.color, option.icon, option.label)
                                )}
                            </div>
                            )}
                            { petition.is_verified && (
                            <div className="row">
                                <div className="col-md-12 d-flex justify-content-center mt-3">
                                    <p className="text-success">
                                        <CheckIcon /><span className="text-bold">Case verified at {petition.created_at}</span>
                                    </p>
                                </div>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
  )
}

export default CaseScrutiny
