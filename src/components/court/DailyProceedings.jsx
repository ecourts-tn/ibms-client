import React, { useState, useEffect, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Proceeding from './Proceeding'
import { CreateMarkup } from '../../utils'
import api from '../../api'
import './style.css'
import PPRemarks from './PPRemarks'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import BasicDetails from './scrutiny/BasicDetails'
import CrimeDetails from './scrutiny/CrimeDetails'
import AdvocateDetails from './scrutiny/AdvocateDetails'
import Petitioner from './scrutiny/Petitioner'
import Respondent from './scrutiny/Respondent'


const DailyProceedings = () => {

    const {state} = useLocation();
    const navigate = useNavigate()
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    if(!state){
        navigate("/petition/proceedings")
    }

    const[petition, setPetition]        = useState({})
    const[litigant, setLitigant]    = useState([])
    const[crime, setCrime] = useState({})
    const[grounds, setGrounds] = useState([])
    const[advocates, setAdvocates] = useState([])
    const[policeResponse, setPoliceResponse] = useState([])
    const[prosecutionRemarks, setProsecutionRemarks] = useState({})

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.post(`court/petition/detail/`, {efile_no:state.efile_no})
                if(response.status === 200){
                    const { petition, grounds, advocate, police_response, ppremarks, crime, litigant } = response.data
                    setPetition(petition)
                    setLitigant(litigant)
                    setAdvocates(advocate)
                    setGrounds(grounds)
                    setCrime(crime)
                    setProsecutionRemarks(ppremarks)
                }
            }catch(err){
                console.log(err)
            }
        }
        fetchData();
    }, [state.efile_no])

    const { judiciary, seat, state:astate, district, establishment, court, case_type, bail_type, complaint_type, crime_registered } = petition
    return (
        <div className="content-wrapper">
            <div className="container-fluid mt-3">
                <div className="card card-outline card-primary">
                    <div className="card-header">
                        <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>{t('daily_proceedings')}</strong></h3>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-7 h-100">
                                <div id="accordion">
                                    <div className="card m-1">
                                        <div className="card-header" id="headingOne">
                                            <a data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" href="/#">{t('petition_details')}</a>
                                        </div>
                                        <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                                            <div className="card-body p-2">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        { Object.keys(petition).length > 0 && (
                                                            <>
                                                                <BasicDetails petition={petition}/>
                                                                <AdvocateDetails advocates={advocates}/>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card m-1">
                                        <div className="card-header" id="headingTwo">
                                            <a data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo" href="/#">{t('crime_details')}</a>
                                        </div>
                                        <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                                            <div className="card-body p-2">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        { Object.keys(petition).length > 0 && (
                                                            <CrimeDetails crime={crime} />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card m-1">
                                        <div className="card-header" id="headingThree">
                                            <a data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree" href="/#">
                                                {t('litigants')}
                                            </a>
                                        </div>
                                        <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                                            <div className="card-body p-2">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <Petitioner litigant={litigant}/>
                                                        <Respondent litigant={litigant} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card m-1">
                                        <div className="card-header" id="headingFour">
                                            <a data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour" href="/#">
                                                {t('ground')}
                                            </a>
                                        </div>
                                        <div id="collapseFour" className="collapse" aria-labelledby="headingFour" data-parent="#accordion">
                                            <div className="card-body p-2">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        { grounds.map((ground, index) => (
                                                            <div className="card" key={index}>
                                                                <div className="card-body">
                                                                        <p dangerouslySetInnerHTML={CreateMarkup(ground.description)}></p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card m-1">
                                        <div className="card-header" id="headingFive">
                                            <a data-toggle="collapse" data-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive" href="/#">
                                                {t('police_response')}
                                            </a>
                                        </div>
                                        <div id="collapseFive" className="collapse" aria-labelledby="headingFive" data-parent="#accordion">
                                            <div className="card-body p-2">
                                            { policeResponse.map((r, index) => (
                                            <table className="table table-bordered table-striped table-sm mt-2" key={index}>
                                                <tbody>
                                                    <tr>
                                                        <td>Offences</td>
                                                        <td>{r.offences}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Date of Arrest</td>
                                                        <td>{ r.date_of_arrest }</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Name of the accused/suspected person(s)</td>
                                                        <td>{r.accused_name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Specific Allegations /Overt Acts against the Petitioner(s)</td>
                                                        <td>{ r.specific_allegations}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Materials & Circumstances against the Petitioner</td>
                                                        <td>{ r.materials_used}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Injured discharged</td>
                                                        <td>{r.discharged}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Hospital Name</td>
                                                        <td>{r.hospital_name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Condition of Victim</td>
                                                        <td>{r.victim_condition}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Particulars of Injury</td>
                                                        <td>{r.injury_particulars}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Stage of Investigation / Trial</td>
                                                        <td>{r.investigation_stage}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>CNR Number</td>
                                                        <td>{r.cnr_number}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Court</td>
                                                        <td>{r.court}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Stage of the Case</td>
                                                        <td>{r.case_stage}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card m-1">
                                        <div className="card-header" id="headingSix">
                                            <a data-toggle="collapse" data-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix" href="/#">
                                                {t('pp_remarks')}
                                            </a>
                                        </div>
                                        <div id="collapseSix" className="collapse" aria-labelledby="headingSix" data-parent="#accordion">
                                            <div className="card-body p-3">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        {prosecutionRemarks.length < 1 ?(
                                                            <PPRemarks accused={litigant}/>
                                                        ): (
                                                            <>
                                                                {/* { prosecutionRemarks.map((p, index) => (
                                                                    <table className="table table-bordered table-striped table-sm mt-2" key={index}>
                                                                        <tbody>
                                                                            <tr>
                                                                                <td>Accused Name</td>
                                                                                <td>{ p.accused_name }</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Accused Type</td>
                                                                                <td>{ p.accused_type }</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Response Type</td>
                                                                                <td>{ p.response_type === 'c' ? 'Contested' : 'Uncontested' }</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Discharged</td>
                                                                                <td>{ p.discharged ? 'Yes' : 'No'}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Hospital Name</td>
                                                                                <td>{ p.hospital_name }</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Victim Condition</td>
                                                                                <td>{ p.victim_condition }</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Remarks</td>
                                                                                <td>{p.remarks}</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                ))} */}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-5">
                                <Proceeding efile_no={state.efile_no}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DailyProceedings