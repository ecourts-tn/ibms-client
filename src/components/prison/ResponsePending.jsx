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
          const response = await api.get("prison/response/pending/list/");
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
                                            <th>Litigant</th>
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
                                            <td>{ petition.petition.efile_number }</td>
                                            <td className="text-center" width="400">
                                                {petition.litigant.filter(l=>l.litigant_type===1).map((l, index)=>(
                                                    <>
                                                        <span key={index}>{index+1}. {l.litigant_name}</span><br/>
                                                    </>
                                                ))}
                                                <span className="text-danger">Vs</span><br/>
                                                {petition.litigant.filter(l=>l.litigant_type===2).map((l, index)=>(
                                                    <>
                                                        <span key={index} className="text-center">{index+1}. {l.litigant_name} {l.designation?.designation_name}</span><br/>
                                                    </>
                                                ))}
                                            </td>
                                            <td>{ petition.crime.fir_number }/{ petition.crime.fir_year }</td>
                                            <td>{ petition.crime.complainant_name }</td>
                                            <td>{ petition.crime.investigation_officer }</td>
                                            <td>
                                                <Link to='/prison/jail-remark/' state={{ efile_no: petition.petition.efile_number }}>
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