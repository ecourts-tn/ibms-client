import React from 'react'
import Button from 'react-bootstrap/Button'


const PetitionerList = ({petitioners, deletePetitioner}) => {

  return (
    <>
      { petitioners.map((petitioner, index) => (
        <div className="card" key={index}>
          <div className="card-body">
            <table className="table no-border litigant-table">
              <tr>
                <td>Petitioner Name</td>
                <td>:</td>
                <td>{ petitioner.litigant_name }, {petitioner.age} , {petitioner.gender}</td>
              </tr>
              <tr>
                <td>Address</td>
                <td>:</td>
                <td>{petitioner.address}</td>
              </tr>
            </table>
            <div className="mt-2">
              <Button 
                variant="primary" 
                size="sm" 
                className="mr-2"
              >
                <i className="fa fa-pencil-alt mr-2"></i>
              Edit</Button>
              <Button 
                variant="danger" 
                size="sm" 
                onClick={() => deletePetitioner(petitioner)}
              >
                <i className="fa fa-trash mr-2"></i>
              Delete</Button>
            </div>
          </div>
        </div>
        
      ))}
      { petitioners.length === 0 && (<span className="text-danger"><strong>No records found</strong></span>)}
    </>
  )
}

export default PetitionerList