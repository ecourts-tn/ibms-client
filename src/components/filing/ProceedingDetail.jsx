import React, {useState,useEffect, useContext} from 'react'
import { useLocation, Link } from 'react-router-dom'
import api from 'api'
import { LanguageContext } from 'contexts/LanguageContex'
import { useTranslation } from 'react-i18next'
import Loading from 'components/utils/Loading'
import { useLocalizedNames } from 'hooks/useLocalizedNames'
import { formatDate } from 'utils'


const ProceedingDetail = () => {

    const {state} = useLocation()
    const {t} = useTranslation()
    const[loading, setLoading] = useState(true)
    const[petition, setPetition] = useState({})
    const[petitioner, setPetitioner] = useState([])
    const[respondent, setRespondent] = useState([])
    const[proceeding, setProceeding] = useState({})
    const {language} = useContext(LanguageContext)

    const {
        getStateName,
        getDistrictName,
        getEstablishmentName,
        getCourtName,
        getSeatName,
        getJudiciaryName,
        getFilingNumber,
        getRegistrationNumber
    } = useLocalizedNames()


    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.post(`court/proceeding/detail/`, {
                    cino:state.cino,
                    proceeding_id: state.proceeding_id
                })
                if(response.status === 200){
                    setPetition(response.data.petition)
                    const { petitioners, respondents } = response.data.litigants?.reduce((acc, litigant) => {
                        // Check if litigant_type is valid and push to appropriate array
                        if (litigant.litigant_type === 1) {
                            acc.petitioners.push(litigant);
                        } else if (litigant.litigant_type === 2) {
                            acc.respondents.push(litigant);
                        }
                        return acc;
                    }, { petitioners: [], respondents: [] });
                    setPetitioner(petitioners);
                    setRespondent(respondents);
                    setProceeding(response.data.proceeding)
                }
            }catch(error){
                console.error(error)
            }finally{
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return (
        <>
            { loading && <Loading /> }
            { Object.keys(petition).length > 0 && (
                <div className="container my-4">
                    <div className="row">
                        <div className="col-md-12">
                            <nav aria-label="breadcrumb" className="mt-2 mb-1">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="#">{t('home')}</a></li>
                                    <li className="breadcrumb-item"><a href="#">{t('petitions')}</a></li>
                                    <li className="breadcrumb-item"><a href="#">{t('detail')}</a></li>
                                    <li className="breadcrumb-item float-right">{petition.efile_number}</li>
                                </ol>
                            </nav>

                            <h6 className="text-center text-danger"><strong>{t('case_details')}</strong></h6>
                            <table className="table table-bordered table-striped table-sm">
                                <tbody>
                                    <tr>
                                        <td>{t('efile_number')}</td>
                                        <td>{petition.efile_number}</td>
                                        <td>{t('efile_date')}</td>
                                        <td>{ formatDate(petition.efile_date)}</td>
                                    </tr>
                                    { petition.judiciary.id== 2 && (
                                    <>
                                    <tr>
                                        <td>{t('state')}</td>
                                        <td>{ getStateName(petition?.state) }</td>
                                        <td>{t('district')}</td>
                                        <td>{ getDistrictName(petition?.district) }</td>
                                    </tr>
                                    <tr>
                                        <td>{t('establishment')}</td>
                                        <td>{ getEstablishmentName(petition?.establishment) }</td>
                                        <td>{t('court')}</td>
                                        <td>{ getCourtName(petition?.court) }</td>
                                    </tr>
                                    </>
                                    )}
                                    {  petition.judiciary.id === 1 && (
                                    <>
                                        <tr>
                                            <td>Court Type</td>
                                            <td>{ getJudiciaryName(petition?.judiciary) }</td>
                                            <td>High Court Bench</td>
                                            <td>{ getSeatName(petition?.seat)}</td>
                                        </tr>
                                    </>
                                    )}
                                    <tr>
                                        <td>{t('filing_number')}</td>
                                        <td>{ getFilingNumber(petition?.filing_number, petition?.filing_year)}</td>
                                        <td>{t('filing_date')}</td>
                                        <td>{ formatDate(petition.filing_date) }</td>
                                    </tr>
                                    <tr>
                                        <td>{t('case_number')}</td>
                                        <td>{ getRegistrationNumber(petition?.reg_type, petition?.reg_number, petition?.reg_year) }</td>
                                        <td>{t('registration_date')}</td>
                                        <td>{ formatDate(petition.registration_date) }</td>
                                    </tr>
                                </tbody>
                            </table>
                            <h6 className="text-center text-danger"><strong>Petitioner / Respondent</strong></h6>
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
                                    <tr>
                                        <td>
                                        { respondent.map((res, index) => (
                                            <React.Fragment>
                                                <p key={index}>
                                                    <strong>{index+1}. {res.litigant_name} { language === 'ta' ? res.designation?.designation_lname : res.designation?.designation_name }</strong><br/>
                                                    { ` ${res.address}, ${ language === 'ta' ? res.police_station.station_lname : res.police_station.station_name}, 
                                                        ${ language === 'ta' ? res.district.district_lname : res.district.district_name}, 
                                                    `}
                                                </p>
                                            </React.Fragment>
                                        ))}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table className="table table-bordered table-striped table-sm">
                                <thead className="bg-info">
                                    <tr>
                                        <th colSpan={2}>Proceeding</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Business&nbsp;Date:</strong></td>
                                        <td>{ proceeding.order_date}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Business:</strong></td>
                                        <td>{ proceeding.order_remarks }</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Next&nbsp;Date:</strong></td>
                                        <td>{ proceeding.next_date}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ProceedingDetail
