import { LanguageContext } from 'contexts/LanguageContex'
import React, { useContext } from 'react'
import Form from 'react-bootstrap/Form'
import { useTranslation } from 'react-i18next'

const InitialInput = ({petition:bail}) => {
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    
    return (
        <table className="table table-bordered table-striped">
            <thead>
                <tr className="bg-navy">
                    <td colSpan={7}><strong>{t('main_case_detail')}</strong></td>
                </tr>
            </thead>
            <tbody>
                { (bail.judiciary?.id == 3 || bail.judiciary?.id == 2) && (
                <>
                    <tr>
                        <td>{t('state')}</td>
                        <td>{ language === 'ta' ? bail.state?.state_lname : bail.state?.state_name }</td>
                        <td>{t('district')}</td>
                        <td>{ language === 'ta' ? bail.district?.district_lname : bail.district?.district_name }</td>
                    </tr>
                    <tr>
                        <td>{t('establishment')}</td>
                        <td>{ language === 'ta' ? bail.establishment?.establishment_lname : bail.establishment?.establishment_name }</td>
                        <td>{t('court')}</td>
                        <td>{ language === 'ta' ? bail.court?.court_lname : bail.court?.court_name }</td>
                    </tr>
                </>
                )}
            {  bail.judiciary?.id === 1 && (
                <>
                    <tr>
                        <td>Court Type</td>
                        <td>{ language === 'ta' ? bail.judiciary?.judiciary_lname : bail.judiciary?.judiciary_name}</td>
                        <td>High Court Bench</td>
                        <td>{ language === 'ta' ? bail.seat?.seat_lname : bail.seat?.seat_name}</td>
                    </tr>
                </>
            )}
            <tr>
                <td>{t('filing_number')}</td>
                <td>{ bail.filing_type ? `${bail.filing_type.type_name}/${bail.filing_number}/${bail.filing_year}` : null}</td>
                <td>{t('filing_date')}</td>
                <td>{ bail.filing_date }</td>
            </tr>
            <tr>
                <td>{t('case_number')}</td>
                <td>{ bail.reg_type ? `${bail.reg_type.type_name}/${ bail.reg_number}/${ bail.reg_year}` : null }</td>
                <td>{t('registration_date')}</td>
                <td>{  bail.registration_date }</td>
            </tr>
            </tbody>
        </table>
    )
}

export default InitialInput