import React from 'react'

const FeesDetails = ({fees}) => {
    return (
        <>
            { Object.keys(fees).length > 0 && (
                <table className="table table-striped table-bordered table-sm">
                    <thead className="bg-secondary">
                        <tr>
                            <th>Payer Name</th>
                            <th>Mobile Number</th>
                            <th>Transcation Date</th>
                            <th>Reference Number</th>
                            <th>Amount Paid</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        { fees.map((fee, index) => (
                        <tr key={index}>
                            <td>{ fee.payer_name }</td>
                            <td>{ fee.mobile_number }</td>
                            <td>{ fee.transaction_date }</td>
                            <td>{ fee.reference_number}</td>
                            <td>{ fee.amount }</td>
                            <td><span className={`badge ${fee.status === 'completed' ? 'bg-success' : 'bg-default'}`}>{ fee.status }</span></td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    )
}

export default FeesDetails
