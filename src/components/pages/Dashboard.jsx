import React, {useState, useEffect} from 'react'
import { ToastContainer } from 'react-toastify'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api'
import ReactTimeAgo from 'react-time-ago'

const Dashboard = () => {

    const user = useSelector((state) => state.user.user)
    const navigate = useNavigate()

    const[count, setCount] = useState({})
    const[cases, setCases] = useState([])

    useEffect(() => {
        const fecthCases = async() =>{
            const response = await api.get("api/bail/dashboard/")
            if(response.status === 200){
                setCases(response.data.petitions)
                setCount({
                    'draft': response.data.draft,
                    'submitted': response.data.submitted,
                    'approved': response.data.approved,
                    'returned': response.data.returned,
                })
            }
        }
        fecthCases();
    },[])

    console.log(cases)

    if(!user){
        navigate("/")
    }

    return (
    <>
        <div className="container-fluid" style={{minHeight:'600px'}}>
            <ToastContainer />
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h3 className="m-0"><strong>Dashboard</strong></h3>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item active">Dashboard</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-info">
                                <div className="inner">
                                    <h3>{ count.draft }</h3>
                                    <p style={{fontSize:'20px'}}><strong>Draft Petitions</strong></p>
                                </div>
                                <div className="icon">
                                    <i className="ion ion-bag" />
                                </div>
                                <Link to="/petition/draft" className="small-box-footer">
                                    More info <i className="fas fa-arrow-circle-right" />
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-success">
                                <div className="inner">
                                    <h3>{ count.submitted }</h3>
                                    <p style={{ fontSize:'20px'}}><strong>Submitted Petitions</strong></p>
                                </div>
                                <div className="icon">
                                <i className="ion ion-stats-bars" />
                                </div>
                                <Link to="/petition/list" className="small-box-footer">
                                    More info <i className="fas fa-arrow-circle-right" />
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-warning">
                                <div className="inner">
                                    <h3>{ count.approved }</h3>
                                    <p style={{ fontSize:'20px'}}><strong>Approved Petitions</strong></p>
                                </div>
                                <div className="icon">
                                    <i className="ion ion-person-add" />
                                </div>
                                <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
                            </div>
                        </div>
                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-danger">
                                <div className="inner">
                                    <h3>{ count.returned }</h3>
                                    <p style={{ fontSize:'20px'}}><strong>Returned Petitions</strong></p>
                                </div>
                                <div className="icon">
                                    <i className="ion ion-pie-graph" />
                                </div>
                                <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
                            </div>
                        </div>
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
                            <div className="card">
                                <div className="card-header">
                                <h3 className="card-title">
                                    <i className="ion ion-clipboard mr-1" />
                                    <strong>My Petitions</strong>
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
                                                    <Link to="">{ c.petition.cino }</Link>
                                                </span>
                                                { c.petitioner.map((p, index) => (
                                                    <span className="text ml-2">{index+1}. {p.petitioner_name}</span>
                                                ))} 
                                                <span className="text text-danger">Vs</span>
                                                { c.respondent.map((res, index) => (
                                                    <span className="text ml-2">{res.respondent_name} rep by {res.designation}</span>
                                                ))} 
                                                <div className="float-right">
                                                    <small className="badge badge-success"><i className="far fa-clock" /><ReactTimeAgo date={c.petition.created_at} locale="en-US"/></small>
                                                    {/* <div className="tools">
                                                        <i className="fas fa-edit" />
                                                        <i className="fas fa-trash-o" />
                                                    </div> */}

                                                </div>
                                            </li>
                                        ))}
                                </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </>
  )
}

export default Dashboard