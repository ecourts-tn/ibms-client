import React from 'react'
import { useState, useEffect } from "react"
import { Link, useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import api from '../../api'



const ResponsePending = () => {

    const navigate = useNavigate()

    const[petitions, setPetitions] = useState([])

    useEffect(() => {
        async function fetchPetitions() {
          const response = await api.get("police/response/pending/list/");
          setPetitions(response.data)
        }
        fetchPetitions();
      }, []); 

    return (
        <>
            <div className="content-wrapper">
                <div className="container-fluid mt-3">
                    <div className="card card-outline card-primary">
                        <div className="card-header">
                            <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Pending Response</strong></h3>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <table className="table table-bordered table-striped">
                                    <thead className="bg-secondary">
                                        <tr>
                                            <th>S.No</th>
                                            <th>eFile Number</th>
                                            <th>Date of Occurrence</th>
                                            <th>Crime Number/Year</th>
                                            <th>Complainant Name</th>
                                            <th>Investigation Officer</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    { petitions.map((petition, index) => (
                                        <tr key={index}>
                                            <td>{ index + 1 }</td>
                                            <td>
                                                <span className="text-primary"><strong>{ petition.petition.efile_number }</strong></span><br></br>
                                                {petition.petition.judiciary?.id === 2 ? `${petition.petition.court?.court_name}, ${petition.petition.district?.district_name}` : null}
                                            </td>
                                            <td>{ petition.crime.date_of_occurrence }</td>
                                            <td>{ petition.crime.fir_number }/{ petition.crime.fir_year }</td>
                                            <td>{ petition.crime.complaitnant_name }</td>
                                            <td>{ petition.crime.investigation_officer }</td>
                                            <td>
                                                <Link to='/police/response/create/' state={{ efile_no: petition.petition.efile_number }}>
                                                    <Button
                                                        variant='contained'
                                                        color='success'
                                                    >Proceed</Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>  
            </div>          
        </>
  )
}

export default ResponsePending