import React, {useState,useEffect, useContext} from 'react'
import { useLocation } from 'react-router-dom'
import api from '../../api'
import { LanguageContext } from 'contexts/LanguageContex'
import { useTranslation } from 'react-i18next'

const PetitionDetail = () => {

    const {state} = useLocation()
    const {t} = useTranslation()
    const[petition, setPetition] = useState({})
    const[petitioner, setPetitioner] = useState([])
    const[respondent, setRespondent] = useState([])
    const[crime, setCrime] = useState({})
    const[objection, setObjection] = useState([])
    const {language} = useContext(LanguageContext)
    useEffect(() => {
        async function fetchData(){
            const response = await api.get(`case/filing/detail/`, {params: {efile_no:state.efile_no}})
            if(response.status === 200){
                setPetition(response.data.petition)
                setCrime(response.data.crime)
                const filtered_petitioner = response.data.litigant.filter((l => {
                    return l.litigant_type === 1
                }))
                setPetitioner(filtered_petitioner)
                const filtered_respondent = response.data.litigant.filter((l => {
                    return l.litigant_type === 2
                }))
                setRespondent(filtered_respondent)
                setObjection(response.data.objection)
            }
        }
        fetchData()
    }, [])


    return (
        <>
            { Object.keys(petition).length > 0 && (
                <div className="container my-4">
                    <div className="row">
                        <div className="col-md-12">
                            <nav aria-label="breadcrumb" className="mt-2 mb-1">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                                    <li className="breadcrumb-item"><a href="#">Petition</a></li>
                                    <li className="breadcrumb-item"><a href="#">Detail</a></li>
                                    <li className="breadcrumb-item float-right">{petition.efile_number}</li>
                                </ol>
                            </nav>

                            <h6 className="text-center text-danger"><strong>{t('case_details')}</strong></h6>
                            <table className="table table-bordered table-striped table-sm">
                                <tbody>
                                    <tr>
                                        <td>e-File Number</td>
                                        <td>{petition.efile_number}</td>
                                        <td>e-File Date</td>
                                        <td>{petition.efile_date}</td>
                                    </tr>
                                    { petition.judiciary.id== 2 && (
                                    <>
                                    <tr>
                                        <td>{t('state')}</td>
                                        <td>{ language === 'ta' ? petition.state.state_lname : petition.state.state_name }</td>
                                        <td>{t('district')}</td>
                                        <td>{ language === 'ta' ? petition.district.district_lname : petition.district.district_name }</td>
                                    </tr>
                                    <tr>
                                        <td>{t('establishment')}</td>
                                        <td>{ language === 'ta' ? petition.establishment.establishment_lname : petition.establishment.establishment_name }</td>
                                        <td>{t('court')}</td>
                                        <td>{ language === 'ta' ? petition.court.court_lname : petition.court.court_name }</td>
                                    </tr>
                                    </>
                                    )}
                                    {  petition.judiciary.id === 1 && (
                                    <>
                                        <tr>
                                            <td>Court Type</td>
                                            <td>{ language === 'ta' ? petition.judiciary.judiciary_lname : petition.judiciary.judiciary_name}</td>
                                            <td>High Court Bench</td>
                                            <td>{ language === 'ta' ? petition.seat?.seat_lname : petition.seat?.seat_name}</td>
                                        </tr>
                                    </>
                                    )}
                                    <tr>
                                        <td>{t('filing_number')}</td>
                                        <td>{ petition.filing_type ? `${petition.filing_type.type_name}/${petition.filing_number}/${petition.filing_year}` : null}</td>
                                        <td>{t('filing_date')}</td>
                                        <td>{ petition.filing_date }</td>
                                    </tr>
                                    <tr>
                                        <td>{t('case_number')}</td>
                                        <td>{ petition.reg_type ? `${petition.reg_type.type_name}/${ petition.reg_number}/${ petition.reg_year}` : null }</td>
                                        <td>{t('registration_date')}</td>
                                        <td>{  petition.registration_date }</td>
                                    </tr>
                                </tbody>
                            </table>
                            <h6 className="text-center text-danger"><strong>{t('petitioner_details')}</strong></h6>
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <td>
                                        { petitioner.map((p, index) => (
                                        <p key={index}>
                                            <strong>{index+1}. {p.litigant_name}</strong><br/>
                                            { p.address }
                                        </p>
                                        ))}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <h6 className="text-center text-danger"><strong>{t('respondent_details')}</strong></h6>
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <td>
                                        { respondent.map((res, index) => (
                                            <>
                                                <p><strong>{index+1}. {res.litigant_name} {res.designation}</strong><br/>
                                                    { `${res.police_station.station_name}, ${res.district.district_name}, ${res.address}`}
                                                </p>
                                            </>
                                        ))}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            { Object.keys(objection).length > 0 && (
                            <>
                            <h6 className="text-center text-danger"><strong>Objections</strong></h6>
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <td>
                                        
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default PetitionDetail
