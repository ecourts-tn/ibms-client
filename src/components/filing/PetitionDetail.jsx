import React, {useState,useEffect, useContext} from 'react'
import { useLocation, Link } from 'react-router-dom'
import api from 'api'
import { LanguageContext } from 'contexts/LanguageContex'
import { useTranslation } from 'react-i18next'
import Loading from 'components/utils/Loading'
import { getPetitionByeFileNo } from 'services/petitionService'
import { truncateChars } from 'utils'
import { useLocalizedNames } from 'hooks/useLocalizedNames'

const PetitionDetail = () => {

    const {state} = useLocation()
    const {t} = useTranslation()
    const[loading, setLoading] = useState(true)
    const[petition, setPetition] = useState({})
    const[petitioner, setPetitioner] = useState([])
    const[respondent, setRespondent] = useState([])
    const[proceedings, setProceedings] = useState([])
    const[crime, setCrime] = useState({})
    const[objection, setObjection] = useState([])
    const {language} = useContext(LanguageContext)
    const { 
        getStateName, 
        getDistrictName,
        getEstablishmentName,
        getCourtName,
        getJudiciaryName,
        getFilingNumber,
        getRegistrationNumber

    } = useLocalizedNames()

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await getPetitionByeFileNo(state.efile_no)
                setPetition(response.petition)
                setCrime(response.crime)
                const { petitioners, respondents } = response.litigants?.reduce((acc, litigant) => {
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
                setObjection(response.objections)
                setProceedings(response.proceedings)
            }catch(error){
                console.error(error)
            }finally{
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return (
        <React.Fragment>
            { loading && <Loading />}
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
                            <div className="d-none d-md-block">
                                <table className="table table-bordered table-striped table-sm">
                                <tbody>
                                    <tr>
                                    <td>{t("efile_number")}</td>
                                    <td>{petition.efile_number}</td>
                                    <td>{t("efile_date")}</td>
                                    <td>{petition.efile_date}</td>
                                    </tr>
                                    {(petition.judiciary.id === 2 || petition.judiciary.id === 3) && (
                                    <>
                                        <tr>
                                        <td>{t("state")}</td>
                                        <td>{ getStateName(petition.state)}</td>
                                        <td>{t("district")}</td>
                                        <td>{ getDistrictName(petition.district)}</td>
                                        </tr>
                                        <tr>
                                        <td>{t("establishment")}</td>
                                        <td>{ getEstablishmentName(petition.establishment)}</td>
                                        <td>{t("court")}</td>
                                        <td>{ getCourtName(petition.court)}</td>
                                        </tr>
                                    </>
                                    )}
                                    {petition.judiciary.id === 1 && (
                                    <tr>
                                        <td>{t("court_type")}</td>
                                        <td>{ getJudiciaryName(petition.judiciary)}</td>
                                        <td>{t("hc_bench")}</td>
                                        <td>{language === "ta" ? petition.seat?.seat_lname : petition.seat?.seat_name}</td>
                                    </tr>
                                    )}
                                    <tr>
                                    <td>{t("filing_number")}</td>
                                    <td>{ getFilingNumber(petition.filing_number, petition.filing_year)}</td>
                                    <td>{t("filing_date")}</td>
                                    <td>{petition.filing_date || '---'}</td>
                                    </tr>
                                    <tr>
                                    <td>{t("case_number")}</td>
                                    <td>{ getRegistrationNumber(petition.reg_type, petition.reg_number, petition.reg_year)}</td>
                                    <td>{t("registration_date")}</td>
                                    <td>{petition.registration_date || '---'}</td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                            <div className="d-md-none">
                                <div className="card shadow-sm rounded border">
                                    <div className="card-body p-0">
                                        <table className="table table-bordered m-0">
                                            <tbody>
                                            {[
                                                { label: t("efile_number"), value: petition.efile_number },
                                                { label: t("efile_date"), value: petition.efile_date },
                                                ...(petition.judiciary.id === 2 || petition.judiciary.id === 3
                                                ? [
                                                    { label: t("state"), value: language === "ta" ? petition.state.state_lname : petition.state.state_name },
                                                    { label: t("district"), value: language === "ta" ? petition.district.district_lname : petition.district.district_name },
                                                    { label: t("establishment"), value: language === "ta" ? petition.establishment.establishment_lname : petition.establishment.establishment_name },
                                                    { label: t("court"), value: language === "ta" ? petition.court.court_lname : petition.court.court_name },
                                                    ]
                                                : []),
                                                ...(petition.judiciary.id === 1
                                                ? [
                                                    { label: t("court_type"), value: language === "ta" ? petition.judiciary.judiciary_lname : petition.judiciary.judiciary_name },
                                                    { label: t("hc_bench"), value: language === "ta" ? petition.seat?.seat_lname : petition.seat?.seat_name },
                                                    ]
                                                : []),
                                                { label: t("filing_number"), value: `${petition.filing_number}/${petition.filing_year}` },
                                                { label: t("filing_date"), value: petition.filing_date },
                                                { label: t("case_number"), value: petition.reg_type ? `${petition.reg_type.type_name}/${petition.reg_number}/${petition.reg_year}` : null },
                                                { label: t("registration_date"), value: petition.registration_date },
                                            ].map((item, index) => (
                                                <tr key={index}>
                                                    <td className="fw-bold">{item.label}</td>
                                                    <td>{item.value}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

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
                                            <React.Fragment>
                                                <p key={index}>
                                                    <strong>{index+1}. {res.litigant_name} { language === 'ta' ? res.designation?.designation_lname : res.designation?.designation_name }</strong><br/>
                                                    { ` ${res.address}, , 
                                                        ${getDistrictName(res.district, language)}, 
                                                    `}
                                                </p>
                                            </React.Fragment>
                                        ))}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            { Object.keys(objection).length > 0 && (
                            <>
                            <h6 className="text-center text-danger"><strong>Objections</strong></h6>
                            <table className="table table-bordered table-striped">
                                <thead className='bg-secondary'>
                                    <tr>
                                        <th>#</th>
                                        <th>Objection Date</th>
                                        <th>Remarks</th>
                                        <th>Complaince Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { objection.map((o, index) => (
                                    <tr>
                                        <td>{index+1}</td>
                                        <td>{o.objection_date}</td>
                                        <td>{o.remarks}</td>
                                        <td>{o.complaince_date}</td>
                                    </tr> 
                                    ))}
                                </tbody>
                            </table>
                            </>
                            )}
                            { Object.keys(proceedings).length > 0 && (
                            <>
                            <h6 className="text-center text-danger"><strong>Daily Proceedings</strong></h6>
                            <table className="table table-bordered table-striped">
                                <thead className='bg-secondary'>
                                    <tr>
                                        <th>#</th>
                                        <th>Business Date</th>
                                        <th>Business</th>
                                        <th>Next Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { proceedings.map((p, index) => (
                                    <tr>
                                        <td>{index+1}</td>
                                        <td>
                                            <Link to={`/proceeding/detail/`} state={{efile_no:p.efile_no, id:p.id}}>{p.order_date}</Link>
                                        </td>
                                        <td>{ truncateChars(p.order_remarks, 100)}</td>
                                        <td>{p.next_date}</td>
                                    </tr> 
                                    ))}
                                </tbody>
                            </table>
                            </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    )
}

export default PetitionDetail
