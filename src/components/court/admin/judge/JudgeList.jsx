import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import api from 'api'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'

const JudgeList = () => {
    const {t} = useTranslation()
    const [judges, setJudges] = useState([])

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get("base/judge/")
                if(response.status === 200){
                    setJudges(response.data)
                }
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
                        <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>{t('judge_details')}</strong></h3>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped">
                                        <thead className="bg-secondary">
                                            <tr>
                                                <th>S. NO</th>
                                                <th>State</th>
                                                <th>Judge Name</th>
                                                <th>Judge Name (Tamil)</th>
                                                <th>JO Code</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { judges.map((j, index) => (
                                            <tr>
                                                <td>{ index+1 }</td>
                                                <td>{ j.state }</td>
                                                <td>{ j.judge_name }</td>
                                                <td>{ j.judge_lname }</td>
                                                <td>{ j.jocode }</td>
                                                <td>
                                                    <Link to="/" className='badge badge-primary badge-pill'>Edit</Link>
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
            </div>
        </div>
    )
}

export default JudgeList