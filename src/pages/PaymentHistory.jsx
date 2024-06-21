import React from 'react'

const PaymentHistory = ({payments}) => {
  return (
        <>
            <table className="table table-bordered table-striped">
                <thead>
                    <tr className="bg-secondary">
                        <th>S. No.</th>
                        <th>Petitioner Name</th>
                        <th>Mobile Number</th>
                        <th>Amount</th>
                        <th>Transaction Date</th>
                        <th>Status</th>
                        <th>Receipt</th>
                    </tr>
                </thead>
                <tbody>
                    { payments.map((payment, index) => (
                    <tr>
                        <td>{ index+1 }</td>
                        <td>{ payment.petitioner_name }</td>
                        <td>{ payment.mobile_number }</td>
                        <td>{ payment.amount }</td>
                        <td>{ payment.transaction_date }</td>
                        <td>{ payment.status }</td>
                        <td></td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default PaymentHistory
