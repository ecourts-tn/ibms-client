import api from 'api'
import React, {useState,useEffect} from 'react'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'

const SuretyPendingList = () => {
    const[sureties, setSureties] = useState([])

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get("case/surety/petition/list/")
                console.log(response.data)
                setSureties(response.data)
            }catch(err){
                console.log(err)
            }
        }
        fetchData();
    },[])

    return (
        <div className="content-wrapper">
            <div className="container-fluid mt-3">
                <div className="card card-outline card-primary">
                    <div className="card-header">
                        <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Surety Pending List</strong></h3>
                    </div>
                    <div className="card-body p-1">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped">
                                        <thead className="bg-secondary">
                                            <tr>
                                                <th>S. NO</th>
                                                <th>Petition Number</th>
                                                <th>Court</th>
                                                <th>Crime Number/Year</th>
                                                <th>Surety Name</th>
                                                <th>Surety Amount</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { sureties && (
                                                <>
                                                    { sureties.map((s, index) => (
                                                        <tr key={index}>
                                                            <td>{ index+1 }</td>
                                                            <td>{ s.petition.efile_number }</td>
                                                            <td>{ s.petition.court.court_name }<br/>{ s.petition.establishment.establishment_name}</td>
                                                            <td>{ s.petition.crime_number}/{s.petition.crime_year}</td>
                                                            <td>
                                                                { s.surety.map((i, index) => (
                                                                <>
                                                                    <span>{`${index+1}. ${i.surety_name}`}</span><br/>
                                                                </>
                                                                ))}
                                                            </td>    
                                                            <td>
                                                                { s.surety.map((i, index) => (
                                                                <>
                                                                    <span>{`${i.surety_amount}`}</span><br/>
                                                                </>
                                                                ))}
                                                            </td>    
                                                            <td>
                                                                <Link
                                                                    to={`/court/surety/verify/`}
                                                                    state={{efile_no: s.petition.efile_number}}
                                                                >
                                                                    <Button
                                                                        variant="contained"
                                                                        color="success"
                                                                    >Verify</Button>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                        ))
                                                    }
                                                </>
                                            )}
                                            { sureties.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} className="text-center text-danger"><strong>***** No petitions found *****</strong></td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SuretyPendingList