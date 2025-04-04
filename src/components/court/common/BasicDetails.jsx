import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'

const BasicDetails = ({ petition }) => {
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);

    return (
        <div>
            { Object.keys(petition).length > 0 && (
            <table className="table table-bordered table-striped table-sm">
                <tbody>
                    <tr className='bg-secondary'>
                        <td colSpan={4}><strong>Case Details</strong></td>
                    </tr>
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
                    <tr>
                        <td>{t('case_type')}</td>
                        <td>{ language === 'ta' ? petition.case_type?.type_lfull_form : petition.case_type?.type_full_form}</td>
                        <td>{t('bail_type')}</td>
                        <td>{ language === 'ta' ? petition.bail_type?.type_lname : petition.bail_type?.type_name }</td>
                    </tr>
                    <tr>
                        <td>{t('complaint_type')}</td>
                        <td>{ language === 'ta' ? petition.complaint_type?.type_lname : petition.complaint_type?.type_name }</td>
                        <td>{t('crime_registered')}</td>
                        <td>
                            {language === "ta" &&
                                (petition.crime_registered === 1
                                ? t('yes')
                                : petition.crime_registered === 2
                                ? t('no')
                                : petition.crime_registered === 3
                                ? t('not_known')
                                : null)}
                        </td>
                    </tr>
                </tbody>
            </table>
            )}
        </div>
    );
};

export default BasicDetails;