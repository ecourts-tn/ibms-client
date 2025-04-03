import { LanguageContext } from 'contexts/LanguageContex';
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next';
import { CreateMarkup } from 'utils';

const PetitionDetail = ({petition, crime}) => {

    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)

    return (
        <div className="card card-outline card-warning">
            <div className="card-header">
                <strong>Petition Detail</strong>
            </div>
            <div className="card-body p-1">
            <table className="table table-bordered table-striped table-sm">
                <tbody>
                    <tr>
                        <td>Petition&nbsp;Number</td>
                        <td>
                            { (petition.filing_type && petition.filing_number && petition.filing_year) ? (
                                <strong>
                                    {`${petition.filing_type?.type_name}/${petition.filing_number}/${petition.filing_year}`}
                                </strong>
                            ):(
                                null
                            )}
                            
                        </td>
                        <td>{t('court_type')}</td>
                        <td>{ language === 'ta' ? petition.judiciary?.judiciary_lname : petition.judiciary?.judiciary_name}</td>
                    </tr>
                    { (parseInt(petition.judiciary?.id) === 2 || parseInt(petition.judiciary?.id) === 3) && (
                        <React.Fragment>
                            <tr>
                                <td>{t('state')}</td>
                                <td>{ language === 'ta' ? petition.state?.state_lname : petition.state?.state_name}</td>
                                <td>{t('district')}</td>
                                <td>{ language === 'ta' ? petition.district?.district_lname : petition.district?.district_name }</td>
                            </tr>
                            <tr>
                                <td>{t('establishment')}</td>
                                <td>{ language === 'ta' ? petition.establishment?.establishment_lname : petition.establishment?.establishment_name}</td>
                                <td>{t('court')}</td>
                                <td>{ language === 'ta' ? petition.court?.court_lname : petition.court?.court_name }</td>
                            </tr>
                        </React.Fragment>
                    )}
                    { !crime?.fir_no > 0 ? (
                        <tr>
                            <td colSpan={6}>
                                <strong className="text-danger">FIR details not available</strong>
                            </td>
                        </tr>
                    ):(
                        <React.Fragment>
                            <tr> 
                                <td>Crime&nbsp;Number</td>
                                <td>{`${crime?.fir_no }/${ crime?.fir_year}`}</td>
                                <td>{t('fir_date_time')}</td>
                                <td>{crime.fir_date_time}</td>
                            </tr>
                            <tr>
                                <td>{t('police_station')}</td>
                                <td>{petition.police_station ? petition.police_station.station_name : null}</td>
                                <td>{t('date_of_occurence')}</td>
                                <td>{crime.date_of_occurrence}</td>
                            </tr>
                            <tr>
                                <td>{t('act')}</td>
                                <td>{crime.act}</td>
                                <td>{t('section')}</td>
                                <td>{crime.section.toString()}</td>
                            </tr>
                            <tr>
                                <td>{t('complaintant_name')}</td>
                                <td>{ crime.complainant_name }</td>
                                <td>{t('place_of_occurence')}</td>
                                <td>{ crime.place_of_occurrence }</td>
                            </tr>
                            <tr>
                                <td colSpan={4}>
                                    <p>
                                        <strong>{t('gist_of_fir')}</strong><br /><br />
                                        <span dangerouslySetInnerHTML={CreateMarkup(crime.gist_of_fir)}></span>
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={4}>
                                    <p>
                                        <strong>{t('gist_in_local')}</strong><br /><br />
                                        <span dangerouslySetInnerHTML={CreateMarkup(crime.gist_of_fir_in_local)}></span>
                                    </p>
                                </td>
                            </tr>
                        </React.Fragment>    
                    )}
                </tbody>
            </table>
            </div>
        </div>
    )
}

export default PetitionDetail