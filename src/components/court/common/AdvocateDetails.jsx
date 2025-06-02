import React from 'react'
import Button from '@mui/material/Button'
import config from '../../../config'
import { useTranslation } from 'react-i18next'

const AdvocateDetails = ({advocates}) => {

    const {t} = useTranslation()
    return (
        <>
            { Object.keys(advocates).length > 0 && (
                <table className="table table-striped table-bordered table-sm">
                    <thead className="bg-info">
                        <tr>
                            <th>{t('adv_name')}</th>
                            <th>{t('enrollment_number')}</th>
                            <th>{t('mobile_number')}</th>
                            <th>{t('email_address')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        { advocates.map((a, index) => (
                        <tr key={index}>
                            <td>{ a.username }</td>
                            <td>{ a.adv_reg }</td>
                            <td>{ a.mobile }</td>
                            <td>{ a.email }</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    )
}

export default AdvocateDetails
