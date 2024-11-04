import React, {useState, useEffect} from 'react'
import api from '../../api'
import Button from '@mui/material/Button'

const JudgeList = () => {

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
        <div className="content-wrapper">
            <div className="container-fluid mt-3">
                <div className="card card-outline card-primary">
                    <div className="card-header">
                        <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Cause List</strong></h3>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped">
                                        <thead className="bg-secondary">
                                            <tr>
                                                <th>S. NO</th>
                                                <th>Crime Number/Year</th>
                                                <th>Case Type</th>
                                                <th>Bail Type</th>
                                                <th>Court</th>
                                                <th>Petitioners</th>
                                                <th>Item No.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { cases && (
                                                <>
                                                    { cases.map((c, index) => (
                                                        <tr key={index}>
                                                            <td>{ index+1 }</td>
                                                            <td>
                                                                { c.petition.crime_number } / { c.petition.crime_year }<br/>
                                                                { c.petition.police_station && (
                                                                    <span>{ c.petition.police_station.station_name}, {c.petition.crime_district.district_name}</span>
                                                                )}   
                                                            </td>
                                                            <td>
                                                                { c.petition.court_type.id === 2 && (
                                                                <span>{ c.petition.court.court_name }<br/>{ c.petition.establishment.establishment_name }<br/>{ c.petition.district.district_name }</span>
                                                                )}
                                                                { c.petition.court_type.id === 1 && (
                                                                <span>{ c.petition.court_type.name }<br/>{ c.petition.bench_type.name }</span> 
                                                                )}
                                                            </td>
                                                            <td>{ c.petition.case_type.type_name }</td>
                                                            <td>{ c.petition.bail_type.type_name }</td>
                                                            <td>
                                                                <ol style={{ paddingBottom:1}}>
                                                                    { c.petitioner.map((p, index) => (
                                                                        <li key={index}>{p.petitioner_name}</li>
                                                                        )) 
                                                                    }
                                                                </ol>
                                                            </td>
                                                            <td>
                                                               <select name="item[]" className="form-control">
                                                                    <option value="">Select</option>
                                                                    {cases.map((c, index) => (
                                                                        <option value={index+1}>{index+1}</option>
                                                                    ))}
                                                               </select>
                                                            </td>
                                                        </tr>
                                                        ))
                                                    }
                                                </>

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

export default JudgeList