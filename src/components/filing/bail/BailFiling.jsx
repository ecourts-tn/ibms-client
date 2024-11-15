import '../style.css'
import api from 'api'
import React, {useState} from 'react'
import { Stepper } from 'react-form-stepper'
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import BasicContainer from 'components/basic/BasicContainer'
import CaseDetails from 'components/filing/CaseDetails'
import PetitionerContainer from 'components/petitioner/PetitionerContainer'
import RespondentContainer from 'components/respondent/RespondentContainer'
import GroundsContainer from 'components/grounds/GroundsContainer'
import AdvocateContainer from 'components/advocate/AdvocateContainer'
import PreviousCaseContainer from 'components/history/PreviousCaseContainer'
import DocumentContainer from 'components/documents/DocumentContainer'
import Payment from 'components/payment/Payment'
import PaymentForm from 'components/payment/PaymentForm'
import Advocate from 'components/filing/Advocate'
import Document from 'components/filing/Document'
import EFile from 'components/filing/efile/EFile'
import InitialInput from 'components/InitialInput'


function Litigants(props){
    const {
            petition,
            setPetition,
            petitioners, 
            addPetitioner, 
            deletePetitioner,
            respondents,
            addRespondent,
            deleteRespondent
        } = props



    return (
        <>
            <PetitionerContainer 
                petitioners={petitioners} 
                addPetitioner={addPetitioner}
                deletePetitioner={deletePetitioner}
            />
            <RespondentContainer 
                respondents={respondents}
                addRespondent={addRespondent}
                deleteRespondent={deleteRespondent}
            />
        </>
    )
}


const BailFiling = () => {
    
    const navigate = useNavigate()

    const[searchParams] = useSearchParams()

    const[nextEnabled, setNextEnabled] = useState(false)
    const[activeStep, setActiveStep] = useState(0)
    const currentStep = searchParams.get("step")
    const {t} = useTranslation()

    const steps = [
        { label: t('basic_details'), onClick: () => setActiveStep(0) },
        { label: t('litigants'), onClick: () => setActiveStep(1) },
        { label: t('ground'), onClick: () => setActiveStep(2) },
        { label: t('previous_case_details'), onClick: () => setActiveStep(3)},
        { label: t('advocate_details'), onClick: () => setActiveStep(4)},
        { label: t('upload_documents'), onClick: () => setActiveStep(5)},
        { label: t('payment_details'), onClick: () => setActiveStep(6)},
        { label: 'eFile', onClick: () => setActiveStep(7)}
    ];

    const[petition, setPetition] = useState({
        cino: 123,
        case_no: 123,
        court_type: 1,
        bench_type:'',
        state: '',
        district:'',
        establishment: '',
        court:'',
        case_type: '',
        bail_type: '',
        complaint_type:'',
        crime_registered: '',
        search_type: 1,
        crime_state: null,
        crime_district: null,
        police_station:null,
        crime_number: null,
        crime_year: null,
        case_search: 1,
        case_state: null,
        case_district: null,
        case_establishment: null,
        case_court: null,
        case_case_type:  null,
        case_number: null,
        case_year: null,
        cnr_number: null,
        date_of_occurrence:'',
        fir_date_time:'',
        place_of_occurrence:'',
        investigation_officer:'',
        complaintant_name:'',
        gist_of_fir:'',
        gist_in_local:'',
        grounds:'',
        is_details_correct: true,
        remarks:'',
        is_previous_pending: false,
        advocate_name:'',
        enrolment_number: null,
        advocate_mobile: '',
        advocate_email:'',
        prev_case_number: '',
        prev_case_year: '',
        prev_case_status:'',
        prev_disposal_date:'',
        prev_proceedings:'',
        prev_is_correct:false,
        prev_remarks:'',
        prev_is_pending:false,
        vakalath: '',
        supporting_document:''
    })

    const[userrole, setUserRole] = useState(1)
    const[errors, setErrors] = useState({
        court_ype: null,
        bench_type:null,
        state: null,
        district:null,
        establishment: null,
        court:null,
        case_type: null,
        bail_type: null,
        compliant_type:null,
        crime_registered: null
    })

    const[petitioners, setPetitioners] = useState([])
    const[grounds, setGrounds] = useState([])
    const[respondents, setRespondents] = useState([])
    const[advocates, setAdvocates] = useState([])
    const[isFinalSubmit, setIsFinalSubmit] = useState(false)

    const addpetition = (petition) => {
        setPetition(petition)
        toast.success("petition details added successfully", {
            theme: "colored"
        })
    }

    const addPetitioner = (petitioner) => {
        setPetitioners(petitioners => [...petitioners, petitioner])
        toast.success("Petitioner details added successfully", {
            theme: "colored"
        })
    }

    const deletePetitioner =(petitioner) => {
        const newPetitioners = petitioners.filter((p) => {
            return p.id !== petitioner.id
        })
        setPetitioners(newPetitioners)
        toast.error("Petitioner details deleted successfuly", {
            theme: "colored"
        })
    }

    const addRespondent = (respondent) => {
        setRespondents(respondents => [...respondents, respondent])
        toast.success("Respondent details added successfully",{
            theme: "colored"
        })
    }

    const deleteRespondent = (respondent) => {
        const newRespondent = respondents.filter((res) => {
            return res.id !== respondent.id
        })
        setRespondents(newRespondent)
        toast.error("Respondent details deleted successfully",{
            theme:"colored"
        })
    }

    const addGround = (ground) => {
        setGrounds(grounds => [...grounds, ground])
        toast.success('Grounds added successfully', {
            theme: "colored"
        })
    }

    const deleteGround = (ground) => {
        const newGrounds = grounds.filter((g) => {
            return g.id !== ground.id
        })
        setGrounds(newGrounds)
        toast.error("Grounds deleted successfully", {
            theme: "colored"
        })
    }

    const addAdvocate = (advocate) => {
        setAdvocates(advocates => [...advocates, advocate])
        toast.success("Advocate details added successfully", {
            theme: "colored"
        })
    }

    const deleteAdvocate = (advocate) => {
        const newAdvocate = advocates.filter((a) => {
            return a.enrolment_number !== advocate.enrolment_number
        })
        setAdvocates(newAdvocate)
        toast.error("Advocate details deleted successfully", {
            theme: "colored"
        })
    }

    const handleSubmit = async () => {
        const efile_no = localStorage.getItem("efile_no")
        if(efile_no){
            try{
                const response = await api.get("api/bail/filing/final-submit/", {
                    params: {
                        efile_no
                    }
                })
                if(response.status === 200){
                    if(response.data.error){
                        response.data.message.forEach((error) => {
                            toast.error(error, {
                                theme:"colored"
                            })
                        })
                        setIsFinalSubmit(false)
                    }else{
                        try{
                            const result = await api.put(`api/bail/filing/${efile_no}/final-submit/`)
                            if(result.status === 200){
                                toast.success("Petition filed successfully", {
                                    theme:"colored"
                                })
                            }
                            localStorage.removeItem("cino")
                            navigate('/dashboard')
                        }catch(error){
                            console.error(error)
                        }
                    }
                }
            }catch(error){
                console.log(error)
            }
        }       
    }


    function getSectionComponent() {
        switch(activeStep) {
            case 0: {
                return (
                    <InitialInput 
                        setActiveStep={setActiveStep}
                    />
                )
            }  
            case 1: {   
                return (
                    <Litigants 
                        petition={petition}
                        setPetition={setPetition}
                        petitioners={petitioners} 
                        addPetitioner={addPetitioner}
                        deletePetitioner={deletePetitioner}
                        respondents={respondents}
                        addRespondent={addRespondent}
                        deleteRespondent={deleteRespondent}
                    />
                )
            }
            case 2: {
                return <GroundsContainer
                    grounds={grounds}
                    addGround={addGround}
                    deleteGround={deleteGround}
                />;
            }
            case 3: {
                return <PreviousCaseContainer
                    petition={petition}
                    setPetition={setPetition}
                />;
            }
            case 4: {
                return <Advocate
                    petition={petition}
                    setPetition={setPetition}
                    advocates={advocates}
                    addAdvocate={addAdvocate}
                    deleteAdvocate={deleteAdvocate}
                />;
            }                
            case 5: {
                return <Document 
                    swornRequired={true}
                />
            }
            case 6: {
                return <Payment />
            }
            case 7: {
                return <EFile
                    isFinalSubmit={isFinalSubmit}
                    setIsFinalSubmit={setIsFinalSubmit}
                    handleSubmit={handleSubmit}
                />;
            }
            default: return null;
        }
      }

    return (
        <>
            <div className="container-fluid" style={{ paddingLeft:'100px', paddingRight:'100px', minHeight:'800px'}}>
                <div className="card" style={{ boxShadow:'none', border:'none'}}>
                    <div className="card-body mt-4" style={{ minHeight:'600px', boxShadow:'none', borderColor:'none'}}>
                        <Stepper
                            steps={steps}
                            activeStep={activeStep}
                        />
                        <div className="container">
                            { getSectionComponent()  }
                        </div>
                    </div>
                    <div className="card-footer" style={{ backgroundColor:'inherit', border:'none'}}>
                        <div className="p-0">
                            <div className="d-flex justify-content-start">
                                { (activeStep !== 0)
                                    && <Button onClick={ () => setActiveStep(activeStep - 1) }><i className="fa fa-arrow-left mr-2"></i>{t('previous')}</Button>
                                }
                            </div>
                            <div className="d-flex justify-content-end">
                                { activeStep !== steps.length - 1 
                                && <Button 
                                        onClick={ () => setActiveStep(activeStep + 1)}><i className="fa fa-arrow-right mr-2"></i>{t('next')}</Button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BailFiling
