import React, {useState, useEffect} from 'react'
import api from '../../api'
import ReactTimeAgo from 'react-time-ago'
import { Link } from 'react-router-dom'

const RegistrationPendingList = () => {
    const[cases, setCases] = useState([])
    useEffect(() => {
        const fecthCases = async() =>{
            const response = await api.get("court/registration/pending/list/")
            if(response.status === 200){
                setCases(response.data)
            }
        }
        fecthCases();
    },[])

    return (
        <div>
            <div className="content-wrapper">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <ol className="breadcrumb mt-2">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item active">Dashboard</li>
                            </ol>
                            <div className="card card-outline card-primary" style={{minHeight:'600px'}}>
                                <div className="card-header"><strong>Case Registration - Pending List</strong></div>
                                <div className="card-body">
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
                                                    <Link to={`/court/case/registration/detail/`} state={{efile_no: c.petition.efile_number}}>{ c.petition.efile_number }</Link>
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
                                                <div className="float-right">
                                                    <small className="badge badge-success"><i className="far fa-clock" /><ReactTimeAgo date={c.petition.created_at} locale="en-US"/></small>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>                               
        </div>
    )
}

export default RegistrationPendingList