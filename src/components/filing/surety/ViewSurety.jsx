import React, {useState, useEffect} from 'react'
import config from 'config'
import { useTranslation } from 'react-i18next'

const ViewSurety = ({surety}) => {

    const {t} = useTranslation()
    return (
        <table className="table table-bordered table-sm">
            <tbody>
                <tr>
                    <td colSpan={2} className='text-center'><strong>Surety Photo & Signature</strong></td>
                    <td>{t('surety_name')}</td>
                    <td>{surety.surety_name}</td>
                </tr>
                <tr>
                    <td rowSpan={6} colSpan={2} style={{textAlign:"center", width:300}}>
                        <img src={`${config.docUrl}${surety.photo}`} className='img-thumbnail' style={{height:"150px", width:'150px'}}/>
                        <img src={`${config.docUrl}${surety.signature}`} className='img-thumbnail mt-2' style={{height:"80px", width:'100%'}}/> 
                    </td>
                    <td>Father/Husband/Mother Name</td>
                    <td>{surety.relative_name}</td>
                </tr>
                <tr>
                    <td>{t('aadhar_number')}</td>
                    <td>{surety.aadhar_number}</td>
                </tr>
                <tr>
                    <td>{t('mobile_number')}</td>
                    <td>{surety.mobile_number}</td>
                </tr>
                <tr>
                    <td>{t('address')}</td>
                    <td>{`${ surety.address}, ${ surety.taluk?.taluk_name }, ${ surety.district?.district_name}-${surety.pincode}`}</td>
                </tr>
                <tr>
                    <td>{t('residing_since')}</td>
                    <td>{surety.residing_years}</td>
                </tr>
                <tr>
                    <td>{t('acquaintance_duration')}</td>
                    <td>{`${surety.accused_duration_year} years ${surety.accused_duration_month} months`}</td>
                </tr>
            </tbody>
        </table>
    )
}

export default ViewSurety