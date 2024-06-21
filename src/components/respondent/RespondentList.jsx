import React from 'react'
import { Button } from 'react-bootstrap'

const RespondentList = ({respondents, deleteRespondent}) => {
  return (
      <>
        { respondents.map( (respondent, index) => (
          <div className="card">
            <div className="card-body">
              <table className="table no-border litigant-table">
                <tr>
                  <td>Respondent Name</td>
                  <td>:</td>
                  <td>{ respondent.respondent_name }</td>               
                </tr>
                <tr>
                  <td>Represented By</td>
                  <td>:</td>
                  <td>{ respondent.designation }</td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td>:</td>
                  <td>{ respondent.address}, {respondent.district} </td>
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