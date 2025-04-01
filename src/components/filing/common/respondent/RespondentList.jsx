import { LanguageContext } from 'contexts/LanguageContex'
import React, { useContext } from 'react'
import { Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const RespondentList = ({respondents, deleteRespondent, editRespondent}) => {
  const {t} = useTranslation()
  const {language} = useContext(LanguageContext)

  return (
      <React.Fragment>     
          <table className="table table-bordered table-striped table-sm">
            <thead className="bg-info">
                <tr>
                  <td>{t('sl_no')}</td>
                  <td>{t('respondent_name')}</td>
                  <td>{t('designation')}</td>
                  <td>{t('address')}</td>
                  <td>{t('action')}</td>
                </tr>
            </thead>
            <tbody>
            { respondents.map((r, index) => (
              <tr key={index}>
                <td>{index+1}</td>
                <td>{ r.litigant_name }</td>               
                <td>{ language === 'ta' ? r.designation?.designation_lname : r.designation?.designation_name }</td>
                <td>{ r.address}, { language === 'ta' ? r.district.district_lname : r.district.district_name } </td>
                <td>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="mr-2"
                    onClick={() => editRespondent(r.litigant_id)}
                  >
                    <i className="fa fa-pencil-alt mr-2"></i>
                  {t('edit')}</Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => deleteRespondent(r)}
                  >
                    <i className="fa fa-trash mr-2"></i>
                  {t('delete')}</Button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
      </React.Fragment>
  )
}

export default RespondentList