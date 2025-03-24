import React, {useState, useEffect} from 'react'
import PreviousCaseForm from './PreviousCaseForm'
import api from '../../api'
import { useTranslation } from 'react-i18next'

const PreviousCaseContainer = ({petition, setPetition}) => {
    const {t} = useTranslation()

    return (
        <div className="container">
            <div className="card card-outline card-secondary">
                <div className="card-header">
                    <h3 className="card-title"><i className="fas fa-download mr-2"></i><strong>{t('previous_case_details')}</strong></h3>
                </div>
                <div className="card-body">
                    <>
                    
                    <PreviousCaseForm 
                        petition={petition}
                        setPetition={setPetition}
                    />
                    
                    </>
                </div>
            </div>
        </div>
    )
}

export default PreviousCaseContainer