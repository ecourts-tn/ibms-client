import React from 'react'
import { Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const RespondentList = ({respondents, deleteRespondent, editRespondent}) => {
  const {t} = useTranslation()
  return (
      <>
        { respondents.map((res, index) => (
          <table className="table table-bordered table-striped table-sm" key={index}>
                <thead className="bg-secondary">
                    <tr>
                        <th colSpan={4}><strong>{t('respondent')} - { index+1 }. {res.litigant_name}</strong>
                          <div className="float-right">
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="mr-2"
                            onClick={() => editRespondent(res.litigant_id)}
                          >
                            <i className="fa fa-pencil-alt mr-2"></i>
                          {t('edit')}</Button>
                          <Button 
                            variant="danger" 
                            size="sm" 
                            onClick={() => deleteRespondent(res)}
                          >
                            <i className="fa fa-trash mr-2"></i>
                          {t('delete')}</Button>
                          </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                  <tr>
                    <td width={300}>{t('respondent_name')}</td>
                    <td width={30}>:</td>
                    <td>{ res.litigant_name }</td>               
                  </tr>
                  <tr>
                    <td>{t('represented_by')}</td>
                    <td>:</td>
                    <td>{ res.designation }</td>
                  </tr>
                  <tr>
                    <td>{t('address')}</td>
                    <td>:</td>
                    <td>{ res.address}, {res.district.district_name} </td>
                  </tr>
                </tbody>
            </table>
        // </div>
        
        
      ))}
      { respondents.length === 0 && (<span className="text-danger"><strong>No records found</strong></span>)}
      </>
  )
}

export default RespondentList