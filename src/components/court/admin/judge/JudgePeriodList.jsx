import React, {useState, useEffect, useContext} from 'react'
import api from 'api'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from 'contexts/LanguageContex'
import { StateContext } from 'contexts/StateContext'
import { DistrictContext } from 'contexts/DistrictContext'
import { EstablishmentContext } from 'contexts/EstablishmentContext'
import { CourtContext } from 'contexts/CourtContext'
import {toast, ToastContainer} from 'react-toastify'
import Loading from 'components/common/Loading'

const JudgePeriodList = () => {

    const {t} = useTranslation()
    const {language} = useContext(LanguageContext)
    const[periods, setPeriods] = useState([])
    const[loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchJudgePeriod(){
            try{
                setLoading(true)
                const response = await api.get(``)
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
        <div className="content-wrapper">
            <ToastContainer />
            { loading && <Loading />}
            <div className="container-fluid mt-3">
                <div className="card card-outline card-primary">
                    <div className="card-header">
                        <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>{t('judge_details')}</strong></h3>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12">
                                <table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>S.No</th>
                                            <th>Judge Name</th>
                                            <th>Jocode</th>
                                            <th>Court</th>
                                            <th>Joining Date</th>
                                            <th>Releiving Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { periods.map((p, index) => (
                                        <tr>
                                            <td>{index+1}</td>
                                            <td>{p.judge_name}</td>
                                            <td>{p.jocode}</td>
                                            <td>{p.court}</td>
                                            <td>{p.joining_date}</td>
                                            <td>{p.releiving_date}</td>
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
    )
}

export default JudgePeriodList