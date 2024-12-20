import React from 'react'
import Button from 'react-bootstrap/Button'
import { useTranslation } from 'react-i18next'

const PetitionerList = ({petitioners, deletePetitioner, editPetitioner}) => {
  const {t} = useTranslation()
  return (
    <>
      { petitioners.map((petitioner, index) => (
          <table className="table table-bordered table-striped table-sm" key={index}>
                <thead className="bg-secondary">
                    <tr>
                        <th colSpan={4}><strong>{t('petitioner')} - { index+1 }. {petitioner.litigant_name}</strong>
                          <div className="float-right">
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
                          </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{t('petitioner_name')}</td>
                        <td>{ petitioner.litigant_name }</td>
                        <td>{t('age')}</td>
                        <td>{ petitioner.age }</td>
                    </tr>
                    <tr>
                        <td>{t('gender')}</td>
                        <td>{ petitioner.gender }</td>
                        <td>{t('accused_rank')}</td>
                        <td>{ petitioner.rank }</td>
                    </tr>
                    <tr>
                        <td>{t('relationship_type')}</td>
                        <td>{petitioner.relation}</td>
                        <td>{t('relationship_name')}</td>
                        <td>{petitioner.relation_name}</td>
                    </tr>
                    <tr>
                        <td>{t('mobile_number')}</td>
                        <td>{petitioner.mobile_number}</td>
                        <td>{t('email_address')}</td>
                        <td>{petitioner.email_address}</td>
                    </tr>
                    <tr>
                        <td>{t('address')}</td>
                        <td colSpan="7">{petitioner.address}</td>
                    </tr>
                    <tr>
                      <td>Photo</td>
                      { petitioner.accused_photo}
                      <td><img src={`data:image/png;base64,${petitioner.accused_photo}`} alt="Decoded" /></td>
                    </tr>
                </tbody>
            </table>
        // </div>
        
        
      ))}
      { petitioners.length === 0 && (<span className="text-danger"><strong>No records found</strong></span>)}
    </>
  )
}

export default PetitionerList