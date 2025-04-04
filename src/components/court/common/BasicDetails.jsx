import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';

const BasicDetails = ({ petition }) => {
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);
    const { judiciary, seat, establishment, state, district, court, case_type, bail_type, complaint_type, crime_registered } = petition;

    return (
        <div className="table-responsive">
            {Object.keys(petition).length > 0 && (
                <table className="table table-bordered table-striped table-sm">
                    <tbody>
                        <tr>
                            <th>{t('court_type')}</th>
                            <td>{language === 'ta' ? judiciary?.judiciary_lname : judiciary?.judiciary_name}</td>
                            <th>{t('case_type')}</th>
                            <td>{language === 'ta' ? case_type?.type_lfull_form : case_type?.type_full_form}</td>
                        </tr>
                        {judiciary?.id === 1 && (
                            <tr>
                                <th>{t('hc_bench')}</th>
                                <td>{language === 'ta' ? seat?.seat_lname || '' : seat?.seat_name || ''}</td>
                                <th>{t('bail_type')}</th>
                                <td>{language === 'ta' ? bail_type?.type_lname : bail_type?.type_name}</td>
                            </tr>
                        )}
                        {judiciary?.id === 2 && (
                            <>
                                <tr>
                                    <th>{t('state')}</th>
                                    <td>{language === 'ta' ? state?.state_lname : state?.state_name}</td>
                                    <th>{t('district')}</th>
                                    <td>{language === 'ta' ? district?.district_lname : district?.district_name}</td>
                                </tr>
                                <tr>
                                    <th>{t('est_name')}</th>
                                    <td>{language === 'ta' ? establishment?.establishment_lname : establishment?.establishment_name}</td>
                                    <th>{t('court')}</th>
                                    <td>{language === 'ta' ? court?.court_lname : court?.court_name}</td>
                                </tr>
                            </>
                        )}
                        <tr>
                            <th>{t('complaint_type')}</th>
                            <td>{language === 'ta' ? complaint_type?.type_lname : complaint_type?.type_name}</td>
                            <th>{t('crime_registered')}</th>
                            <td>
                                {crime_registered === "1" ? t('yes') : crime_registered === "2" ? t('no') : t('not_known')}
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default BasicDetails;