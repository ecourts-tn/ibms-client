import React, {useState, useEffect, useContext} from 'react'
import api from 'api'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import {toast, ToastContainer} from 'react-toastify'
import Loading from 'components/utils/Loading'
import { useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'

const ProsecutorPeriod = () => {

    const {t} = useTranslation()
    const navigate = useNavigate()
    const {language} = useContext(LanguageContext)
    const [periods, setPeriods] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchJudgePeriod(){
            try{
                setLoading(true)
                const response = await api.get(`base/prosecutor/`)
                if(response.status === 200){
                    setPeriods(response.data)
                }
            }catch(error){
                console.error(error)
            }finally{
                setLoading(false)
            }
        }
        fetchJudgePeriod()
    }, [])


    return (
        <div className="card card-outline card-primary">
            <ToastContainer />
            { loading && <Loading />}
            <div className="card-header">
                <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>{t('prosecutor_period')}</strong></h3>
                <Button 
                    className="btn-sm float-right"
                    variant="success"
                    onClick={() => navigate('/court/admin/prosecutor')}
                > <i className="fa fa-plus mr-1"></i>
                    Add New</Button>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-12">
                        <table className="table table-bordered table-striped table-sm">
                            <thead className='bg-info'>
                                <tr>
                                    <th>S.No</th>
                                    <th>Prosecutor Name</th>
                                    <th>District</th>
                                    <th>Court</th>
                                    <th>Joining Date</th>
                                    <th>Releiving Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                { periods.map((p, index) => (
                                <tr>
                                    <td>{index+1}</td>
                                    <td>{ p.username }</td>
                                    <td>{` ${p.district?.district_name || ''}`}</td>
                                    <td>{` ${p.court?.court_name || ''}`}</td>
                                    <td>{p.joining_date}</td>
                                    <td>{p.releiving_date}</td>
                                    <td>
                                        <Button
                                            variant='primary'
                                            className="btn-sm"
                                            onClick={() => {}}
                                        >
                                            <i className="fa fa-pencil-alt"></i>
                                        </Button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProsecutorPeriod