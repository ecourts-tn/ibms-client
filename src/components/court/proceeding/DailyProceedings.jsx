import api from 'api'
import '../style.css'
import React, { useState, useEffect, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CreateMarkup } from 'utils'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import Proceeding from 'components/court/proceeding/Proceeding'
import PPRemarks from 'components/court/common/PPRemarks'
import BasicDetails from 'components/court/common/BasicDetails'
import CrimeDetails from 'components/court/common/CrimeDetails'
import AdvocateDetails from 'components/court/common/AdvocateDetails'
import Petitioner from 'components/court/common/Petitioner'
import Respondent from 'components/court/common/Respondent'
import PoliceResponse from 'components/court/common/PoliceResponse'


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

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.post(`court/petition/detail/`, {efile_no:state.efile_no})
                if(response.status === 200){
                    const { petition, grounds, advocates, ppremarks, crime, litigants } = response.data
                    setPetition(petition)
                    setLitigant(litigants)
                    setAdvocates(advocates)
                    setGrounds(grounds)
                    setCrime(crime)
                }
            }catch(err){
            }
        }
        fetchData();
    }, [state.efile_no])

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
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <PoliceResponse />
                                                    </div>
                                                </div>
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
                                            <div className="card-body p-2">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <PPRemarks efile_no={petition.efile_number}/>
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