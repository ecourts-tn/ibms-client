import React from 'react'
import PreviousCaseForm from './PreviousCaseForm'

const PreviousCaseContainer = ({petition, setPetition}) => {
  return (
        <>
            <div className="card card-outline card-secondary">
                <div className="card-header">
                    <h3 className="card-title"><i className="fas fa-download mr-2"></i><strong>Previous Case Details</strong></h3>
                </div>
                <div className="card-body">
                    <PreviousCaseForm 
                        petition={petition}
                        setPetition={setPetition}
                    />
                </div>
            </div>
        </>
    )
}

export default PreviousCaseContainer