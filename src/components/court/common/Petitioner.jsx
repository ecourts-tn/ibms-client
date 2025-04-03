import React from 'react'
import { useTranslation } from 'react-i18next'

const Petitioner = ({litigant}) => {
    const {t} = useTranslation()
    return (
        <>
            { litigant.filter(l=>l.litigant_type===1).map((p, index) => (
            <table className="table table-bordered table-striped mb-2 table-sm" key={index}>
                <thead className="bg-info">
                    <tr>
                        <th colSpan={4}><strong>{t('petitioner')} - { index+1 }. {p.litigant_name}</strong></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{t('petitioner_name')}</td>
                        <td>{ p.litigant_name }</td>
                        <td>{t('age')}</td>
                        <td>{ p.age }</td>
                    </tr>
                    <tr>
                        <td>{t('gender')}</td>
                        <td>{ p.gender }</td>
                        <td>{t('accused_rank')}</td>
                        <td>{ p.rank }</td>
                    </tr>
                    <tr>
                        <td>{t('relationship_type')}</td>
                        <td>{p.relation}</td>
                        <td>{t('relationship_name')}</td>
                        <td>{p.relation_name}</td>
                    </tr>
                    <tr>
                        <td>{t('mobile_number')}</td>
                        <td>{p.mobile_number}</td>
                        <td>{t('email_address')}</td>
                        <td>{p.email_address}</td>
                    </tr>
                    <tr>
                        <td>{t('address')}</td>
                        <td colSpan="7">{p.address}</td>
                    </tr>
                </tbody>
            </table>
            ))}
        </>
    )
}

export default Petitioner