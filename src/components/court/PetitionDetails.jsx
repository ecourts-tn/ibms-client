import React, {useState, useEffect} from 'react'
import Button from '@mui/material/Button'
import api from '../../api'
import BasicDetails from './scrutiny/BasicDetails'
import Petitioner from './scrutiny/Petitioner'
import Respondent from './scrutiny/Respondent'
import Grounds from './scrutiny/Grounds'

const PetitionDetails = ({cino}) => {

    const[petition, setPetition] = useState({})
    const[petitioners, setPetitioners] = useState([])
    const[respondents, setRespondents] = useState([])
    const[grounds, setGrounds] = useState([])

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get(`api/bail/petition/${cino}/detail/`)
                const { petition, petitioner, grounds, respondent} = response.data
                console.log(response)
                setPetition(petition)
                setPetitioners(petitioner)
                setRespondents(respondent)
                setGrounds(grounds)
            }catch(err){
                console.log(err)
            }
        }
        fetchData()
    },[cino])

    return (
        <>
            <div className="card h-100">
                <div className="card-header bg-info">
                    <strong>Case History</strong>
                </div>
                <div className="card-body m-3" style={{ height:'600px', overflowY:"scroll"}}>
                    <div className="row">
                        <div calssName="col-md-12">
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" id="basic-tab" data-toggle="tab" href="#basic" role="tab" aria-controls="basic" aria-selected="true">Basic Details</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="petitioner-tab" data-toggle="tab" href="#petitioner" role="tab" aria-controls="petitioner" aria-selected="false">Petitioner</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="respondent-tab" data-toggle="tab" href="#respondent" role="tab" aria-controls="respondent" aria-selected="false">Respondent</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="grounds-tab" data-toggle="tab" href="#grounds" role="tab" aria-controls="grounds" aria-selected="false">Grounds</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="previous-tab" data-toggle="tab" href="#previous" role="tab" aria-controls="previous" aria-selected="false">Previous Details</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="advocate-tab" data-toggle="tab" href="#advocate" role="tab" aria-controls="advocate" aria-selected="false">Advocate Details</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="documents-tab" data-toggle="tab" href="#documents" role="tab" aria-controls="documents" aria-selected="false">Documents</a>
                                </li>
                            </ul>
                            <div className="tab-content m-3" id="myTabContent">
                                <div className="tab-pane fade show active mt-3" id="basic" role="tabpanel" aria-labelledby="basic-tab">
                                    { false && (
                                        <BasicDetails petition={petition} />
                                    )}
                                </div>
                                <div className="tab-pane fade" id="petitioner" role="tabpanel" aria-labelledby="petitioner-tab">
                                    <div className="my-3">
                                        <Petitioner petitioner={petitioners} />
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="respondent" role="tabpanel" aria-labelledby="respondent-tab">
                                    <div className="my-3">
                                        <Respondent respondent={respondents} />
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="grounds" role="tabpanel" aria-labelledby="grounds-tab">
                                    <div className="my-2">
                                        <Grounds grounds={grounds} />
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="previous" role="tabpanel" aria-labelledby="previous-tab">

                                </div>
                                <div className="tab-pane fade" id="advocate" role="tabpanel" aria-labelledby="advocate-tab">

                                </div>
                                <div className="tab-pane fade" id="documnets" role="tabpanel" aria-labelledby="documnets-tab">

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PetitionDetails
