import React from 'react'
import { Button } from 'react-bootstrap'

const AdvocateList = ({advocates, deleteAdvocate}) => {
    return (
      <>
        
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Advocate Name</th>
                <th>Enrolment Number</th>
                <th>Mobile Number</th>
                <th>Email Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              { advocates.map((advocate, index) => (
                <tr key={index}>
                  <td>{ advocate.advocate_name }</td>
                  <td>{ advocate.enrolment_number }</td>
                  <td>{ advocate.advocate_mobile }</td>
                  <td>{ advocate.advocate_email }</td>
                  <td>
                    <Button
                      variant="primary"
                      className='btn-sm'
                    >
                      <i className="fa fa-pencil-alt mr-2"></i>
                      Edit</Button>
                    <Button
                      variant="danger"
                      className="ml-2 btn-sm"
                      onClick={() => deleteAdvocate(advocate)}
                    >
                      <i className="fa fa-trash mr-2"></i>
                      Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

      </>
    )
}

export default AdvocateList