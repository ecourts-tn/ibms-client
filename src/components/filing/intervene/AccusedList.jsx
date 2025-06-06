import React from 'react'
import Button from 'react-bootstrap/Button'
import { useTranslation } from 'react-i18next';

const AccusedList = ({accused, deleteAccused, editAccused}) => {
    const {t} = useTranslation()
    
    return (
        <table className="table table-bordered table-striped table-sm">
        <thead className="bg-info">
            <tr>
            <th>{t('sl_no')}</th>
            <th>{t('accused')}</th>
            <th>{t('father_husband_guardian')}</th>
            <th>{t('age')}</th>
            <th>{t('address')}</th>
            <th>{t('action')}</th>
            </tr>
        </thead>
            <tbody>
            { accused.map((a, index) => (
                <tr key={index}>
                    <td>{index+1}</td>
                    <td>{ a.litigant_name }</td>
                    <td>{ a.relation_name }</td>
                    <td>{ a.age }</td>
                    <td>{ a.address}</td>
                    <td>
                    <Button 
                        variant="primary" 
                        size="sm" 
                        className="mr-2"
                        onClick={() => editAccused(accused.litigant_id)}
                        >
                        <i className="fa fa-pencil-alt mr-2"></i>
                        {t('edit')}</Button>
                        <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => deleteAccused(accused)}
                        >
                        <i className="fa fa-trash mr-2"></i>
                        {t('delete')}</Button>
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
    )
}

export default AccusedList