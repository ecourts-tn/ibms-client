import React, {useState, useEffect, useContext} from 'react'
import api from 'api'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import Loading from 'components/Loading'
import 'components/court/style.css'


const PostCauseList = () => {
    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    const [loading, setLoading] = useState(false)
    const[cases, setCases] = useState([])

    useEffect(() => {
        async function fetchData(){
            try{
                setLoading(true)
                const response = await api.get("court/registration/pending/")
                setCases(response.data)
            }catch(err){
                console.log(err)
            }finally{
                setLoading(false)
            }
        }
        fetchData();
    },[])

    return (
        <div className="content-wrapper">
            { loading && <Loading />}
            <div className="container-fluid mt-3">
                <div className="card card-outline card-primary">
                    <div className="card-header">
                        <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Cause List</strong></h3>
                    </div>
                    <div className="card-body admin-card">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped">
                                        <thead className="bg-secondary">
                                            <tr>
                                                <th>S. NO</th>
                                                <th>eFile Number</th>
                                                <th>Crime Number/Year</th>
                                                <th>Petitioners</th>
                                                <th>Hearing Date</th>
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
                                                                <Link to="/court/case/scrutiny/detail" state={{efile_no:c.petition.efile_number}}>{ c.petition.efile_number }</Link>
                                                                <span style={{display:"block"}}>
                                                                    { `${c.petition.filing_type?.type_name}/${c.petition.filing_number}/${c.petition.filing_year}`}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                { c.crime?.fir_number } / { c.crime?.fir_year }<br/>
                                                                { c.crime?.police_station && (
                                                                    <span>{ c.crime.police_station?.station_name}, {c.crime.district?.district_name}</span>
                                                                )}   
                                                            </td>
                                                            <td className="text-center">
                                                                { c.litigants.filter((l) => l.litigant_type ===1 ).map((l, index) => (
                                                                    <span className="text ml-2">{index+1}. {l.litigant_name}</span>
                                                                ))}<br/>
                                                                <span className="text text-danger">Vs</span><br/>
                                                                { c.litigants.filter((l) => l.litigant_type ===2 ).map((l, index) => (
                                                                    <span className="text ml-2">{index+1}. {l.litigant_name} {l.designation?.designation_name}</span>
                                                                ))}
                                                            </td>
                                                            <td>
                                                                <input type="date" />
                                                            </td>
                                                            <td>
                                                                <button className="btn btn-primary btn-sm">Submit</button>
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

export default PostCauseList