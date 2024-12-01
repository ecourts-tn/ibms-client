import api from 'api'
import React, {useState, useEffect} from 'react'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'

const OrderPendingList = ({}) => {

    const[cases, setCases] = useState([])

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get("court/registration/pending/")
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
                <div className="card card-outline card-primary" style={{minHeight:'700px'}}>
                    <div className="card-header">
                        <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Pending Order List</strong></h3>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12">
                            <ul className="todo-list" data-widget="todo-list">
                                        { cases.map((c, index) => (
                                            <li key={index}>
                                                <span className="handle">
                                                    <i className="fas fa-ellipsis-v" />
                                                    <i className="fas fa-ellipsis-v" />
                                                </span>
                                                <div className="icheck-primary d-inline ml-2">
                                                    <input type="checkbox" name={`todo${index}`} id={`todoCheck${index}`} />
                                                    <label htmlFor="todoCheck1" />
                                                </div>
                                                
                                                <span className="text mr-3">
                                                    <Link to={`#/`} state={{efile_no: c.petition.efile_number}}>{ c.petition.efile_number }</Link>
                                                </span>
                                                { c.litigant.filter((l) => l.litigant_type ===1 ).map((l, index) => (
                                                    <span className="text ml-2">{index+1}. {l.litigant_name}</span>
                                                ))
                                                }
                                                <span className="text text-danger">Vs</span>
                                                { c.litigant.filter((l) => l.litigant_type ===2 ).map((l, index) => (
                                                    <span className="text ml-2">{index+1}. {l.litigant_name} {l.designation?.designation_name}</span>
                                                ))
                                                }
                                                <span className="float-right">
                                                    <Link to={`/court/case/order/generate`} state={{efile_no: c.petition.efile_number}}>
                                                        <Button variant="contained">
                                                            Generate Order
                                                        </Button>
                                                    </Link>
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                {/* <div className="table-responsive">
                                    <table className="table table-bordered table-striped">
                                        <thead className="bg-secondary">
                                            <tr>
                                                <th>S. NO</th>
                                                <th>Crime Number/Year</th>
                                                <th>Case Number</th>
                                                <th>Bail Type</th>
                                                <th>Court Details</th>
                                                <th>Litigants</th>
                                                <th>Action</th>
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
                                                                { c.petition.case_type.type_name }/{c.petition.reg_number}/{c.petition.reg_year}
                                                            </td>
                                                            <td>{ c.petition.bail_type.type_name }</td>
                                                            <td>
                                                                { c.petition.court_type.id === 2 && (
                                                                <span>{ c.petition.court.court_name }<br/>{ c.petition.establishment.establishment_name }<br/>{ c.petition.district.district_name }</span>
                                                                )}
                                                                { c.petition.court_type.id === 1 && (
                                                                <span>{ c.petition.court_type.name }<br/>{ c.petition.bench_type ? c.petition.bench_type.name : null }</span> 
                                                                )}
                                                            </td>
                                                            <td>
                                                                <ol style={{ paddingBottom:1}}>
                                                                    { c.petitioner.map((p, index) => (
                                                                        <li key={index}>{p.petitioner_name}</li>
                                                                        )) 
                                                                    }
                                                                </ol>
                                                            </td>
                                                            <td>
                                                                <Link to="/court/petition/case/proceedings" state={{cino:c.petition.cino}}>
                                                                    <Button
                                                                        variant='contained'
                                                                        color='primary'
                                                                    >Case Proceeding
                                                                    </Button>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                        ))
                                                    }
                                                </>

                                            )}
                                        </tbody>
                                    </table>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderPendingList