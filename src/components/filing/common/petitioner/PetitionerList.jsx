import React from 'react'
import Button from 'react-bootstrap/Button'
import { useTranslation } from 'react-i18next'

const PetitionerList = ({petitioners, deletePetitioner, editPetitioner}) => {
  const {t} = useTranslation()
  return (
    <table className="table table-bordered table-striped table-sm">
      <thead className="bg-info">
        <tr>
          <th>{t('sl_no')}</th>
          <th>{t('petitioner')}</th>
          <th>{t('father_husband_guardian')}</th>
          <th>{t('age')}</th>
          <th>{t('address')}</th>
          <th>{t('action')}</th>
        </tr>
      </thead>
        <tbody>
          { petitioners.map((petitioner, index) => (
            <tr key={index}>
                <td>{index+1}</td>
                <td>{ petitioner.litigant_name }</td>
                <td>{ petitioner.relation_name }</td>
                <td>{ petitioner.age }</td>
                <td>{petitioner.address}</td>
                <td>
                  <Button 
                      variant="primary" 
                      size="sm" 
                      className="mr-2"
                      onClick={() => editPetitioner(petitioner.litigant_id)}
                    >
                      <i className="fa fa-pencil-alt mr-2"></i>
                    {t('edit')}</Button>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => deletePetitioner(petitioner)}
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

export default PetitionerList