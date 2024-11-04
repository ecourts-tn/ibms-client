import React from 'react'
import { CreateMarkup } from 'utils'
import { useTranslation } from 'react-i18next'

const CrimeDetails = ({crime}) => {
    const{t} = useTranslation()
    return (
        <table className="table table-bordered table-striped">
            <tbody>
                <tr>
                    <td colSpan={4} className="bg-secondary"><strong>{t('fir_details')}</strong></td>
                </tr>
                <tr>
                    <td>{t('date_of_occurence')}</td>
                    <td>{ crime.date_of_occurrence }</td>
                    <td>{t('fir_date_time')}</td>
                    <td>{ crime.fir_date_time }</td>
                </tr>
                <tr>
                    <td>{t('place_of_occurence')}</td>
                    <td colSpan={3}>{ crime.place_of_occurrence }</td>
                </tr>
                <tr>
                    <td>{t('investigation_officer')}</td>
                    <td>{ crime.investigation_officer }</td>
                    <td>{t('investigation_officer_rank')}</td>
                    <td>{ crime.investigation_officer_rank }</td>
                </tr>
                <tr>
                    <td>{t('complaintant_name')}</td>
                    <td>{ crime.complainant_name }</td>
                    <td>{t('complaintant_age')}</td>
                    <td>{ crime.complainant_age }</td>
                </tr>
                <tr>
                    <td>{t('complaintant_guardian')}</td>
                    <td>{ crime.complainant_guardian }</td>
                    <td>{t('complaintant_guardian_name')}</td>
                    <td>{ crime.complainant_guardian_name }</td>
                </tr>
                <tr>
                    <td colSpan={4}>
                        <p><strong>{t('gist_of_fir')}</strong></p>
                        <span dangerouslySetInnerHTML={CreateMarkup(crime.gist_of_fir)}></span>
                    </td>
                </tr>
                <tr>
                    <td colSpan={4}>
                        <p><strong>{t('gist_in_local')}</strong></p>
                        <span dangerouslySetInnerHTML={CreateMarkup(crime.gist_in_local)}></span>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default CrimeDetails