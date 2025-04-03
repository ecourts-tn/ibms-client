import { LanguageContext } from 'contexts/LanguageContex'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'

const Respondent = ({litigant}) => {
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    return (
        <>
            { litigant.filter(l=>l.litigant_type===2).map((res, index) => (
            <table className="table table-bordered table-striped mb-2 table-sm" key={index}>
                <thead className="bg-olive">
                    <tr>
                        <td colSpan={4}><strong>{t('respondent')} - {index+1}. { res.litigant_name }</strong></td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{t('respondent_name')}</td>
                        <td>
                            { res.litigant_name } &nbsp;
                            { language === 'ta' ? res.designation?.designation_lname : res.designation?.designation_name }
                        </td>
                        <td>{t('address')}</td>
                        <td>{ res.address }</td>
                    </tr>
                    <tr>
                        <td>{t('district')}</td>
                        <td>{ language === 'ta' ? res.district.district_lname : res.district.district_name }</td>
                        <td>{t('police_station')}</td>
                        <td>{ language === 'ta' ? res.police_station.station_lname : res.police_station.station_name }</td>
                    </tr>
                </tbody>
            </table>
            ))}
        </>
    )
}   

export default Respondent