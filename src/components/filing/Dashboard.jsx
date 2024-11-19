import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import api from '../../api'
import ReactTimeAgo from 'react-time-ago'
import { useTranslation } from 'react-i18next'

const Dashboard = () => {

    const[count, setCount] = useState({})
    const[cases, setCases] = useState([])
    const { t } = useTranslation()

    useEffect(() => {
        const fecthCases = async() =>{
            try{
                const response = await api.get("case/dashboard/")
                if(response.status === 200){
                    setCases(response.data.petitions)
                    setCount({
                        'draft': response.data.draft,
                        'submitted': response.data.submitted,
                        'approved': response.data.approved,
                        'returned': response.data.returned,
                    })
                }
            }catch(error){
                if (!error.response) {
                    // Network error or request could not be made
                    console.error('Network error: Unable to reach the server. Please try again later.');
                } else {
                    // Handle other types of errors
                    console.error(`Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`);
                }
                console.error('Error fetching data:', error);
            }
        }
        fecthCases();
    },[])

    return (
    <>
        <ToastContainer />
        <div className="container-fluid" style={{minHeight:'600px'}}>
            <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-12">
                        <nav aria-label="breadcrumb" className="mt-2 mb-1">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="#/">{t('home')}</a></li>
                                <li className="breadcrumb-item active"  aria-current="page">{t('dashboard')}</li>
                            </ol>
                        </nav>
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
                                    <p style={{fontSize:'20px'}}><strong>{t('draft_petition')}</strong></p>
                                </div>
                                <div className="icon">
                                    <i className="ion ion-bag" />
                                </div>
                                <Link to="/filing/draft-list" className="small-box-footer">
                                    {t('more_info')} <i className="fas fa-arrow-circle-right" />
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-success">
                                <div className="inner">
                                    <h3>{ count.submitted }</h3>
                                    <p style={{ fontSize:'20px'}}><strong>{t('submitted_petition')}</strong></p>
                                </div>
                                <div className="icon">
                                <i className="ion ion-stats-bars" />
                                </div>
                                <Link to="/filing/submitted-list" className="small-box-footer">
                                    {t('more_info')} <i className="fas fa-arrow-circle-right" />
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-warning">
                                <div className="inner">
                                    <h3>{ count.approved }</h3>
                                    <p style={{ fontSize:'20px'}}><strong>{t('approved_petition')}</strong></p>
                                </div>
                                <div className="icon">
                                    <i className="ion ion-person-add" />
                                </div>
                                <a href="#/" className="small-box-footer">{t('more_info')} <i className="fas fa-arrow-circle-right" /></a>
                            </div>
                        </div>
                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-danger">
                                <div className="inner">
                                    <h3>{ count.returned }</h3>
                                    <p style={{ fontSize:'20px'}}><strong>{t('returned_petition')}</strong></p>
                                </div>
                                <div className="icon">
                                    <i className="ion ion-pie-graph" />
                                </div>
                                <a href="#/" className="small-box-footer">{t('more_info')} <i className="fas fa-arrow-circle-right" /></a>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="card">
                                <div className="card-header border-0 bg-success">
                                <h3 className="card-title">
                                    <i className="far fa-calendar-alt mr-2" />
                                    {t('calendar')}
                                </h3>
                                <div className="card-tools">
                                    <div className="btn-group">
                                    <button type="button" className="btn btn-success btn-sm dropdown-toggle" data-toggle="dropdown" data-offset={-52}>
                                        <i className="fas fa-bars" />
                                    </button>
                                    <div className="dropdown-menu" role="menu">
                                        <a href="#/" className="dropdown-item">Add new event</a>
                                        <a href="#/" className="dropdown-item">Clear events</a>
                                        <div className="dropdown-divider" />
                                        <a href="#/" className="dropdown-item">View calendar</a>
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
                                    <strong>{t('my_petition')}</strong>
                                </h3>
                                <div className="card-tools">
                                    <ul className="pagination pagination-sm">
                                    <li className="page-item"><a href="#/" className="page-link">«</a></li>
                                    <li className="page-item"><a href="#/" className="page-link">1</a></li>
                                    <li className="page-item"><a href="#/" className="page-link">2</a></li>
                                    <li className="page-item"><a href="#/" className="page-link">3</a></li>
                                    <li className="page-item"><a href="#/" className="page-link">»</a></li>
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
                                                    <Link to="/filing/detail" state={{efile_no:c.petition.efile_number}}>{ c.petition.efile_number }</Link>
                                                </span>
                                                { c.litigant.filter((l) => parseInt(l.litigant_type) ===1 ).map((l, index) => (
                                                    <span className="text ml-2">{index+1}. {l.litigant_name}</span>
                                                ))
                                                }
                                                <span className="text text-danger">Vs</span>
                                                { c.litigant.filter((l) => parseInt(l.litigant_type) ===2 ).map((l, index) => (
                                                    <span className="text ml-2">{index+1}. {l.litigant_name} {l.designation}</span>
                                                ))
                                                }
                                                <div className="float-right">
                                                    {/* <small className="badge badge-success"><i className="far fa-clock" /><ReactTimeAgo date={c.petition.created_at} locale="en-US"/></small> */}
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