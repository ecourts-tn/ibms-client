import React, { useEffect } from 'react'
import { useState } from 'react'
import { Stepper, Step } from 'react-form-stepper'
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import BasicContainer from '../basic/BasicContainer'
import CaseDetails from './CaseDetails'
import PetitionerContainer from '../petitioner/PetitionerContainer'
import RespondentContainer from '../respondent/RespondentContainer'
import GroundsContainer from '../grounds/GroundsContainer'
import AdvocateContainer from '../advocate/AdvocateContainer'
import PreviousCaseContainer from '../history/PreviousCaseContainer'
import DocumentContainer from '../documents/DocumentContainer'
import Payment from '../pages/Payment'

import EFile from '../efile/EFile'
import api from '../../api'
import { useSearchParams } from 'react-router-dom'
import ComplainantDetails from '../petitioner/ComplainantDetails'

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
            <CaseDetails 
                petition={petition}
                setPetition={setPetition}
            />
            <PetitionerContainer 
                petitioners={petitioners} 
                addPetitioner={addPetitioner}
                deletePetitioner={deletePetitioner}
            />
            {/* <ComplainantDetails 
                petitioners={petitioners} 
                addPetitioner={addPetitioner}
                deletePetitioner={deletePetitioner}
            /> */}
            <RespondentContainer 
                respondents={respondents}
                addRespondent={addRespondent}
                deleteRespondent={deleteRespondent}
            />
        </>
    )
}


const BailFiling = () => {
    
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const[searchParams] = useSearchParams()

    const[nextEnabled, setNextEnabled] = useState(false)
    const[activeStep, setActiveStep] = useState(0)
    const currentStep = searchParams.get("step")

    const steps = [
        { label: 'Basic Details', onClick: () => setActiveStep(0) },
        { label: 'Litigants', onClick: () => setActiveStep(1) },
        { label: 'Ground', onClick: () => setActiveStep(2) },
        { label: 'Previous Case Details', onClick: () => setActiveStep(3)},
        { label: 'Advocate Details', onClick: () => setActiveStep(4)},
        { label: 'Upload Documents', onClick: () => setActiveStep(5)},
        { label: 'Payment', onClick: () => setActiveStep(6)},
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
    const[initialAdvocate, setInitialAdvocate] = useState({})

    useEffect(() => {
        if(userrole === 1){
            setPetition({...petition,
                advocate_name:'Deenadayalan',
                enrolment_number:'MS/123/456',
                advocate_mobile: '8344381139',
                advocate_email:'deenadayalan.mhc@gmail.com'
            })
            setAdvocates([...advocates, initialAdvocate])
        }
    },[])

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
        localStorage.removeItem("cino")
        navigate('/dashboard')
        // const data = {
        //     petition,
        //     petitioners, 
        //     respondents, 
        //     grounds
        // }
        // const response = await api.post("api/bail/filing/", data)
        // console.log(response.errors)
        
    }
    function getSectionComponent() {
        switch(activeStep) {
            case 0: {
                return <BasicContainer 
                    setActiveStep={setActiveStep}
                />;
            }  
            case 1: {   
                return <Litigants 
                    petition={petition}
                    setPetition={setPetition}
                    petitioners={petitioners} 
                    addPetitioner={addPetitioner}
                    deletePetitioner={deletePetitioner}
                    respondents={respondents}
                    addRespondent={addRespondent}
                    deleteRespondent={deleteRespondent}
                />;
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
                return <AdvocateContainer
                    petition={petition}
                    setPetition={setPetition}
                    advocates={advocates}
                    addAdvocate={addAdvocate}
                    deleteAdvocate={deleteAdvocate}
                />;
            }                
            case 5: {
                return <DocumentContainer 
                    petition={petition}
                    setPetition={setPetition}
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
                                    && <Button onClick={ () => setActiveStep(activeStep - 1) }><i className="fa fa-arrow-left mr-2"></i>Previous</Button>
                                }
                            </div>
                            <div className="d-flex justify-content-end">
                                { activeStep !== steps.length - 1 
                                && <Button 
                                        onClick={ () => setActiveStep(activeStep + 1)}><i className="fa fa-arrow-right mr-2"></i>Next</Button>
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
