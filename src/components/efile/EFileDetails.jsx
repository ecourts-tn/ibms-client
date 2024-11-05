import React, {useState, useEffect} from 'react'
import { CreateMarkup } from '../../utils'
import api from '../../api'
import { useTranslation } from 'react-i18next'

const EFileDetails = () => {

    const[petition, setPetition] = useState({})
    const[litigants, setLitigants] = useState([])
    const[respondents, setRespondents] = useState([])
    const[grounds, setGrounds] = useState([])
    const {t} = useTranslation()

    useEffect(() => {
        async function fetchData(){
            try{
                const efile_no = sessionStorage.getItem("efile_no")
                const response = await api.get(`case/filing/detail/`, {params:{efile_no}})
                if(response.status === 200){
                    setPetition(response.data.petition)
                    setLitigants(response.data.litigant)
                    setGrounds(response.data.grounds)
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchData();
    }, [])

    return (
        <>
            <div className="card card-outline card-info">
                <div className="card-header pb-0">
                    <h3 className="card-title"><strong>{t('basic_details')}</strong></h3>
                </div>
                <div className="card-body p-2">
                    { Object.keys(petition).length > 0 && (
                    <table className="custom-table table-sm">
                        { petition && (
                        <>
                            <tr>
                                <td>Court Type</td>
                                <td>{ petition.judiciary.judiciary_name }</td>
                                <td>Bench Type</td>
                                <td>{ petition.seat ?  petition.seat.seat_name : null}</td>
                            </tr>
                            { petition.judiciary.id === 2 && (
                            <>
                                <tr>
                                    <td>State</td>
                                    <td>{ petition.state.state_name }</td>
                                    <td>District</td>
                                    <td>{ petition.district.district_name }</td>
                                </tr>
                                <tr>
                                    <td>Establishment</td>
                                    <td>{ petition.establishment.establishment_name }</td>
                                    <td>Court</td>
                                    <td>{ petition.court.court_name }</td>
                                </tr>
                            </>)}
                            <tr>
                                <td>Case Type</td>
                                <td>{ petition.case_type.type_name }</td>
                                <td>Bail Type</td>
                                <td>{ petition.bail_type.type_name }</td>
                            </tr>
                            <tr>
                                <td>Crime Registered</td>
                                <td>{ petition.crime_registered === 1 ? 'Yes' : 'No' }</td>
                                <td>Compliant Type</td>
                                <td>{ petition.complaint_type.type_name }</td>
                            </tr>
                        </>
                        )}
                    </table>
                    )}
                </div>
            </div>
            <div className="card card-outline card-success">
                <div className="card-header pb-0">
                    <h3 className="card-title"><strong>{t('petitioners')}</strong></h3>
                </div>
                <div className="card-body p-2">
                    <table className="table table-bordered table-striped table-sm">
                        <thead className="bg-dark">
                            <tr>
                                <th>{t('sl_no')}</th>
                                <th>{t('petitioner_name')}</th>
                                <th>{t('gender')}</th>
                                <th>{t('age')}</th>
                                <th width="500">{t('address')}</th>
                                <th>{t('act')}</th>
                                <th>{t('section')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            { litigants.filter(litigant=>litigant.litigant_type===1).map((litigant, index) => (
                                <tr key={index}>
                                    <td>{ index+1 }</td>
                                    <td>{ litigant.litigant_name }</td>
                                    <td>{ litigant.gender }</td>
                                    <td>{ litigant.age }</td>
                                    <td>{ litigant.address }</td>
                                    <td>{ litigant.act }</td>
                                    <td>{ litigant.section }</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="card card-outline card-info">
                <div className="card-header pb-0">
                    <h3 className="card-title"><strong>{t('respondents')}</strong></h3>
                </div>
                <div className="card-body p-2">
                    <table className="table table-bordered table-striped table-sm">
                        <thead className="bg-dark">
                            <tr>
                                <th>{t('sl_no')}</th>
                                <th>{t('respondent_name')}</th>
                                <th>{t('designation')}</th>
                                <th>{t('address')}</th>
                                {/* <th>District</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            { litigants.filter(litigant=>litigant.litigant_type===2).map((litigant, index) => (
                                <tr key={index}>
                                    <td>{ index+1 }</td>
                                    <td>{ litigant.litigant_name }</td>
                                    <td>{ litigant.designation }</td>
                                    <td>{ litigant.address }</td>
                                    {/* <td>{ litigant.district }</td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="card card-outline card-primary">
                <div className="card-header pb-0">
                    <h3 className="card-title"><strong>{t('ground')}</strong></h3>
                </div>
                <div className="card-body p-2">
                    { grounds.map((ground, index) => (
                    <div className="card" key={index}>
                        <div className="card-body">
                            <p dangerouslySetInnerHTML={CreateMarkup(ground.description)}></p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default EFileDetails