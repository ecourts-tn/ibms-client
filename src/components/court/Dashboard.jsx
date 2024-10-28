import React, {useState, useEffect} from 'react'
import api from 'api'
import ReactTimeAgo from 'react-time-ago'
import { Link } from 'react-router-dom'
import DashboardCard from 'components/common/DashboardCard'

const Dashboard = () => {

    const[cases, setCases] = useState([])
    const[count, setCount] = useState({})

    useEffect(() => {
        const fecthCases = async() =>{
            const response = await api.get("court/dashboard/")
            if(response.status === 200){
                setCases(response.data.petitions)
                setCount({
                    'total': response.data.total,
                    'approved': response.data.approved,
                    'returned': response.data.returned,
                    'rejected': response.data.rejected
                })
            }
        }
        fecthCases();
    },[])

    useEffect(() => {
        const fecthCases = async() =>{
            const response = await api.get("court/petition/submitted/list/")
            if(response.status === 200){
                setCases(response.data)
            }
        }
        fecthCases();
    },[])

    return (
    <>
        <div className="content-wrapper">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12">
                        <ol className="breadcrumb mt-2">
                            <li className="breadcrumb-item"><a href="#">Home</a></li>
                            <li className="breadcrumb-item"><a href="#">Court</a></li>
                            <li className="breadcrumb-item active">Dashboard</li>
                        </ol>
                        <div className="row">
                            <DashboardCard
                                color="bg-info"
                                count={count.total}
                                title="Total Petitions"
                                icon="ion-bag"
                                url={null}
                            ></DashboardCard>
                            <DashboardCard
                                color="bg-success"
                                count={count.approved}
                                title="Approved Petitions"
                                icon="ion-stats-bars"
                                url={null}
                            ></DashboardCard>
                            <DashboardCard
                                color="bg-warning"
                                count={count.returned}
                                title="Returned Petitions"
                                icon="ion-person-add"
                                url={null}
                            ></DashboardCard>
                            <DashboardCard
                                color="bg-danger"
                                count={count.rejected}
                                title="Rejected Petitions"
                                icon="ion-pie-graph"
                                url={null}
                            ></DashboardCard>
                        </div>
                        <div className="row">
                            <div className="col-md-3">
                                <div className="card">
                                    <div className="card-header border-0 bg-success">
                                    <h3 className="card-title">
                                        <i className="far fa-calendar-alt" />
                                        Calendar
                                    </h3>
                                    <div className="card-tools">
                                        <div className="btn-group">
                                        <button type="button" className="btn btn-success btn-sm dropdown-toggle" data-toggle="dropdown" data-offset={-52}>
                                            <i className="fas fa-bars" />
                                        </button>
                                        <div className="dropdown-menu" role="menu">
                                            <a href="#" className="dropdown-item">Add new event</a>
                                            <a href="#" className="dropdown-item">Clear events</a>
                                            <div className="dropdown-divider" />
                                            <a href="#" className="dropdown-item">View calendar</a>
                                        </div>
                                        </div>
                                        <button type="button" className="btn btn-success btn-sm" data-card-widget="collapse">
                                        <i className="fas fa-minus" />
                                        </button>
                                        <button type="button" className="btn btn-success btn-sm" data-card-widget="remove">
                                        <i className="fas fa-times" />
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body pt-0">
                                    <div id="calendar" style={{width: '100%'}} />
                                </div>
                            </div>
                            </div>
                            <div className="col-md-9">
                                <div className="card" style={{minHeight:'500px'}}>
                                    <div className="card-header">
                                    <h3 className="card-title">
                                        <i className="ion ion-clipboard mr-1" />
                                        <strong>Pending Scrutiny</strong>
                                    </h3>
                                    <div className="card-tools">
                                        <ul className="pagination pagination-sm">
                                        <li className="page-item"><a href="#" className="page-link">«</a></li>
                                        <li className="page-item"><a href="#" className="page-link">1</a></li>
                                        <li className="page-item"><a href="#" className="page-link">2</a></li>
                                        <li className="page-item"><a href="#" className="page-link">3</a></li>
                                        <li className="page-item"><a href="#" className="page-link">»</a></li>
                                        </ul>
                                    </div>
                                    </div>
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
                                                    <Link to={`/court/petition/scrutiny/details`} state={{efile_no: c.petition.efile_number}}>{ c.petition.efile_number }</Link>
                                                </span>
                                                { c.litigant.filter(l=>l.litigant_type===1).map((p, index) => (
                                                    <span className="text ml-2">{index+1}. {p.litigant_name}</span>
                                                ))} 
                                                <span className="text text-danger">Vs</span>
                                                { c.litigant.filter(l=>l.litigant_type===2).map((res, index) => (
                                                    <span className="text ml-2">{res.litigant_name} {res.designation}</span>
                                                ))} 
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
        </div>
    </>
  )
}

export default Dashboard