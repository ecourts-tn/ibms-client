import React from 'react'
import { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom';
import api from 'api'
import PetitionDetail  from 'components/police/PetitionDetail'
import AccusedDetail from 'components/police/AccusedDetail';
import ResponseList from 'components/police/ResponseList';

const ResponseDetails = () => {
    const {state} = useLocation()
    const[petition, setPetition] = useState({
        filing_type: {}
    })
    const[crime, setCrime] = useState({})
    const[accused, setAccused] = useState([])
    const[response, setResponse] = useState([])
    const initialState = {
        cino                : '',
        offences            : '',
        date_of_arrest      : '',
        accused_name        : '',
        specific_allegations: '',
        materials_used      : '',
        discharged          : false,
        hospital_name       : '',
        victim_condition    : '',
        injury_particulars  : '',
        investigation_stage : '',
        cnr_number          : '',
        court               : '',
        case_stage          : '',
        next_hearing        : '',
        no_of_witness       : '',
        previous_case       : '',
        previous_bail       : '',
        other_accused_status: '',
        reason_not_given    : '',
        other_information   : '',
        court_details       : ''
    }
    
    const[form, setForm] = useState(initialState)

    useEffect(() => {
        async function fetchResponseDetail(){
            const response = await api.post(`police/response/detail/`, {efile_no:state.efile_no})
            if(response.status === 200){
                setForm({
                    ...form,
                    efile_no: response.data.petition.efile_no
                })
                setPetition(response.data.petition)
                setAccused(response.data.litigant)
                setResponse(response.data.response)
                setCrime(response.data.crime)
            }
        }
        fetchResponseDetail()
    }, [])


    return (
        <div className="content-wrapper">
            <div className="container-fluid mt-3">
                <div className="card card-outline card-primary">
                    <div className="card-header">
                        <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Police Response</strong></h3>
                    </div>
                    <div className="card-body">
                        <PetitionDetail 
                            petition={petition}
                            crime={crime}
                        />
                        <AccusedDetail 
                            accused={accused}
                        />
                        <ResponseList 
                            response={response}
                        />    
                    </div>
                </div>
            </div>  
        </div>          
  )
}

export default ResponseDetails