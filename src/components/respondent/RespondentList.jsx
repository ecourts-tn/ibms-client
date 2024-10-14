import React from 'react'
import { Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const RespondentList = ({respondents, deleteRespondent}) => {
  const {t} = useTranslation()
  return (
      <>
        { respondents.map((respondent, index)=>(
          <div className="card" key={index}>
            <div className="card-body">
              <table className="table no-border litigant-table">
                <tr>
                  <td>{t('respondent_name')}</td>
                  <td>:</td>
                  <td>{ respondent.litigant_name }</td>               
                </tr>
                <tr>
                  <td>{t('representd_by')}</td>
                  <td>:</td>
                  <td>{ respondent.designation }</td>
                </tr>
                <tr>
                  <td>{t('address')}</td>
                  <td>:</td>
                  <td>{ respondent.address}, {respondent.district.district_name} </td>
                </tr>
              </table>
              <div className="mt-2">
                <Button variant="info" size="sm" className="mr-2"><i className="fa fa-pencil-alt"></i></Button>
                <Button variant="danger" size="sm" onClick={() => deleteRespondent(respondent)}><i className="fa fa-trash"></i></Button>
              </div>
            </div>
          </div>
        ))}
    { respondents.length === 0 && (<span className="text-danger"><strong>No records found</strong></span>)}
      </>
  )
}

export default RespondentList