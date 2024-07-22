import React from 'react'
import Button from '@mui/material/Button'

const AdvocateList = ({advocates, deleteAdvocate}) => {
    return (
    <>
      <div className="table-responsive">
      <table className="table table-striped table-bordered table-sm">
            <thead className="bg-secondary">
              <tr>
                <td>S. No.</td>
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
                  <td>{ index+1 }</td>
                  <td>{ advocate.advocate_name }</td>
                  <td>{ advocate.enrolment_number }</td>
                  <td>{ advocate.advocate_mobile }</td>
                  <td>{ advocate.advocate_email }</td>
                  <td>
                    { !advocate.is_primary && (
                      <>
                        <Button
                          variant='contained'
                          color='primary'
                          size='small'
                          onClick={() => deleteAdvocate(advocate)}
                        >Edit</Button>
                        <Button
                          variant='contained'
                          color='error'
                          size='small'
                          className='ml-1'
                          onClick={()=> deleteAdvocate(advocate)}
                        >Delete</Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </>
    )
}

export default AdvocateList