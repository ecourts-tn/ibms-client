import api from 'api'
import { CreateMarkup } from 'utils'
import React, {useState, useEffect, useContext} from 'react'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'

const EFileDetails = () => {

    const[petition, setPetition] = useState({})
    const[litigants, setLitigants] = useState([])
    const[respondents, setRespondents] = useState([])
    const[grounds, setGrounds] = useState([])
    const {language} = useContext(LanguageContext)
    const {t} = useTranslation()

    useEffect(() => {
        async function fetchData(){
            try{
                const efile_no = sessionStorage.getItem("efile_no")
                const response = await api.get(`case/filing/detail/`, {params:{efile_no}})
                if(response.status === 200){
                    setPetition(response.data.petition)
                    setLitigants(response.data.litigants)
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
                    <table className="table table-bordered table-striped table-sm">
                        { petition && (
                        <>
                            <tr>
                                <td>{t('court_type')}</td>
                                <td>{ language === 'ta' ? petition.judiciary?.judiciary_lname : petition.judiciary?.judiciary_name }</td>
                                <td>{t('hc_bench')}</td>
                                <td>{ language === 'ta' ? petition.seat?.seat_lname : petition.seat?.seat_name}</td>
                            </tr>
                            { petition.judiciary.id === 2 && (
                            <>
                                <tr>
                                    <td>{t('state')}</td>
                                    <td>{ language === 'ta' ? petition.state.state_lname : petition.state.state_name }</td>
                                    <td>{t('district')}</td>
                                    <td>{ language === 'ta' ? petition.district?.district_lname : petition.district?.district_name }</td>
                                </tr>
                                <tr>
                                    <td>{t('est_name')}</td>
                                    <td>{ language === 'ta' ? petition.establishment?.establishment_lname : petition.establishment?.establishment_name }</td>
                                    <td>{t('court')}</td>
                                    <td>{ language === 'ta' ? petition.court?.court_lname : petition.court?.court_name }</td>
                                </tr>
                            </>)}
                            <tr>
                                <td>{t('case_type')}</td>
                                <td>{ language === 'ta' ? petition.case_type?.type_lfull_form : petition.case_type?.type_full_form }</td>
                                <td>{t('bail_type')}</td>
                                <td>{ language === 'ta' ? petition.bail_type?.type_lname : petition.bail_type?.type_name }</td>
                            </tr>
                            <tr>
                                <td>{t('crime_registered')}</td>
                                <td>
                                    {(() => {
                                        const crimeStatus = parseInt(petition.crime_registered);
                                        if (crimeStatus === 1) return language === 'ta' ? 'ஆம்' : 'Yes';
                                        if (crimeStatus === 2) return language === 'ta' ? 'இல்லை' : 'No';
                                        if (crimeStatus === 3) return language === 'ta' ? 'தெரியவில்லை' : 'Not Known';
                                        return ''; // Return empty if none of the conditions are met
                                    })()}
                                </td>
                                <td>{t('complaint_type')}</td>
                                <td>{ language === 'ta' ? petition.complaint_type?.type_lname : petition.complaint_type?.type_name }</td>
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
                        <thead className="bg-info">
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
                        <thead className="bg-info">
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
                                    <td>{ litigant.designation?.designation_name }</td>
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