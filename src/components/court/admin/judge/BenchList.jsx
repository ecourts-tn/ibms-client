import React, {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from 'api'
import { useTranslation } from 'react-i18next'

const BenchList = () => {
    const {t} = useTranslation()
    const navigate = useNavigate()
    const [benchs, setBenchs] = useState([])

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get("base/bench/")
                if(response.status === 200){
                    setBenchs(response.data)
                }
            }catch(err){
                console.log(err)
            }
        }
        fetchData();
    },[])

    return (
        <div className="card card-outline card-primary">
            <div className="card-header">
                <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Bench Detail</strong></h3>
                <button 
                    className="btn btn-success btn-sm float-right"
                    onClick={() => navigate('/court/admin/bench/')}
                >Add Bench</button>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-12">
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                                <thead className="bg-secondary">
                                    <tr>
                                        <th>Bench code</th>
                                        <th>Bench Name</th>
                                        <th>Bench Name (Tamil)</th>
                                        <th>Judges</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { benchs.map((b, index) => (
                                    <tr>
                                        <td>{ b.bench_code }</td>
                                        <td>{ b.bench_name }</td>
                                        <td>{ b.bench_lname }</td>
                                        <td>
                                            <strong>
                                            { b.judges
                                                .map(j => j.judge.judge_sname.toUpperCase())
                                                .join(', ')
                                            }   
                                            </strong>
                                        </td>
                                        <td>
                                            <Link to="/" className='btn btn-primary btn-sm px-2'>Edit</Link>
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
    )
}

export default BenchList