import React, {useState, useEffect} from 'react'
import api from '../../api'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'

const DailyProceedingsList = ({}) => {

    const[cases, setCases] = useState([])

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get("court/registration/pending/list/")
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
                        <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Proceeding List</strong></h3>
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
                                            <Link to={`/court/case/proceeding/detail/`} state={{efile_no: c.petition.efile_number}}>{ c.petition.efile_number }</Link>
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
                                    </li>
                                ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DailyProceedingsList