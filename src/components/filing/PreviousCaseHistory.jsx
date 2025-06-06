import React, {useState, useEffect} from 'react'
import PreviousCaseForm from './PreviousCaseForm'
import { useTranslation } from 'react-i18next'

const PreviousCaseHistory = ({petition, setPetition}) => {
    const {t} = useTranslation()

    return (
        <div className="container-fluid">
            <PreviousCaseForm 
                petition={petition}
                setPetition={setPetition}
            />
        </div>
    )
}

export default PreviousCaseHistory