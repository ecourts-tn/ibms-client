import React from 'react'
import api from '../../api'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const TodayCases = () => {

    const[cases, setCases] = useState([])

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get("api/bail/petition/list/")
                setCases(response.data)
            }catch(err){
                console.log(err)
            }
        }
        fetchData();
    },[])

    return (
        <>
            <div className="content-wrapper">
                <div className="container-fluid mt-3">
                    <div className="card card-outline card-primary">
                        <div className="card-header">
                            <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>My Cases</strong></h3>
                        </div>
                        <div className="card-body p-2">
                            <table className="table table-bordered table-striped">
                                <thead className="bg-secondary">
                                    <tr>
                                        <td>S. No.</td>
                                        <td>District</td>
                                        <td>Establishment</td>
                                        <td>Case Type</td>
                                        <td>Bail Type</td>
                                        <td>Crime Number/Year</td>
                                        <td>Petitioners</td>
                                        <td>Action</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    { cases.map((c, index) => (
                                        <tr key={index}>
                                            <td>{ index + 1 }</td>
                                            <td>{ c.petition.district.district_name }</td>
                                            <td>{ c.petition.establishment.establishment_name }</td>
                                            <td>{ c.petition.case_type.name }</td>
                                            <td>{ c.petition.bail_type.name }</td>
                                            <td>{ c.petition.crime_number } / { c.petition.crime_year }</td>
                                            <td>
                                                <ol style={{ paddingBottom:1}}>
                                                    { c.petitioner.map((p, index) => (
                                                        <li key={index}>{p.petitioner_name}</li>
                                                        )) 
                                                    }
                                              </ol>
                                            </td>
                                            <td>
                                                { !c.petition.filing_type && !c.petition.filing_number && (
                                                    <span className="badge bg-info">
                                                        <Link to="/court/case-scrutiny" state={{ id: 'TN20240607000001' }}>Scrutiny</Link>
                                                    </span>
                                                )}
                                                { c.petition.filing_type && c.petition.filing_number && !c.petition.reg_type && !c.petition.reg_number && (
                                                    <span className="badge bg-warning">
                                                        <Link to="/court/case-registration" state={{ id: 'TN20240607000001' }}>Registration</Link>
                                                    </span>
                                                )}
                                                { c.petition.filing_type && c.petition.filing_number && c.petition.reg_type && c.petition.reg_number && (
                                                    <span className="badge bg-primary">
                                                        <Link to="/court/case-registration" state={{ id: 'TN20240607000001' }}>Post to Cause List</Link>
                                                    </span>
                                                )}
                                                 {/* { c.petition.filing_type && c.petition.filing_number && c.petition.reg_type && c.petition.reg_number && (
                                                    <span className="badge bg-primary">
                                                        <Link to="/court/case-registration" state={{ id: 'TN20240606000003' }}>Post to Cause List</Link>
                                                    </span>
                                                )} */}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>    
        </>
  )
}

export default TodayCases