import React from 'react'

const ConditionDetails = () => {
  return (
    <React.Fragment>
        <table className="table table-bordered table-striped">
            <thead>
                <tr className='bg-navy'>
                    <td colSpan={4}><strong>Condition Details</strong></td>
                </tr>
                <tr>
                    <th>Bail Order Date</th>
                    <th>Released Date</th>
                    <th>No. of Days Present</th>
                    <th>No. of Days Absent</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input type="text" className='form-control' readOnly={true} /></td>
                    <td><input type="text" className='form-control' readOnly={true} /></td>
                    <td><input type="text" className='form-control' readOnly={true} /></td>
                    <td><input type="text" className='form-control' readOnly={true} /></td>
                </tr>
            </tbody>
        </table>
    </React.Fragment>
  )
}

export default ConditionDetails