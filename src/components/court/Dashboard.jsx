import React, {useState, useEffect, useContext} from 'react'
import api from '../../api'
import ReactTimeAgo from 'react-time-ago'
import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import DashboardCard from 'components/common/DashboardCard'
import Calendar from 'components/common/Calendar'
import PetitionList from 'components/common/PetitionList'
import { AuthContext } from 'contexts/AuthContext'
import { JudgeContext } from 'contexts/JudgeContext'

const Dashboard = () => {

    const[count, setCount] = useState({})
    const[cases, setCases] = useState([])
    const[loading, setLoading] = useState(false)

    const { t } = useTranslation()

    const {user} = useContext(AuthContext)
    const {judge, setJudge} = useContext(JudgeContext)

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            const countsEndpoint = 'court/dashboard/counts/';
            const petitionsEndpoint = 'court/dashboard/petitions/';
            // Use Promise.all to fetch both endpoints in parallel
            const [countsResponse, petitionsResponse] = await Promise.all([
                api.get(countsEndpoint),
                api.get(petitionsEndpoint),
            ]);
            // Extract the data from the responses
            const counts = countsResponse.data;
            const petitions = petitionsResponse.data;           
            setCount(counts)
            setCases(petitions?.petitions)
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            throw error;
        }finally{
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchDashboardData();
    },[])

    useEffect(() => {
        const fetchCourtDetails = async() => {
            try{
                const response = await api.post(`base/judge-period/detail/`, {court:user.court})
                if(response.status === 200){
                    setJudge(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchCourtDetails()
    },[])

    return (
        <>
            <ToastContainer />
            <div className="content-wrapper">
                <div className="container-fluid">
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h3 className="m-0"><strong>{t('dashboard')}</strong></h3>
                                </div>
                                <div className="col-sm-6">
                                    <ol className="breadcrumb float-sm-right">
                                        <li className="breadcrumb-item"><a href="#">{t('home')}</a></li>
                                        <li className="breadcrumb-item active">{t('dashboard')}</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                    <section className="content">
                        <div className="container-fluid">
                            <div className="row">
                                <DashboardCard
                                    color={'bg-info'}
                                    count={count.total}
                                    title={t('total_petition')}
                                    icon={'ion-bag'}
                                    url={`/filing/draft`}
                                />
                                    <DashboardCard 
                                    color={'bg-success'}
                                    count={count.submitted}
                                    title={t('draft_petition')}
                                    icon={'ion-bag'}
                                    url={`/filing/draft`}
                                />
                                <DashboardCard 
                                    color={'bg-warning'}
                                    count={count.approved}
                                    title={t('pending_petition')}
                                    icon={'ion-bag'}
                                    url={`/filing/draft`}
                                />
                                <DashboardCard 
                                    color={'bg-danger'}
                                    count={count.returned}
                                    title={t('draft_petition')}
                                    icon={'ion-bag'}
                                    url={`/filing/draft`}
                                />
                            </div>
                            <div className="row">
                                <div className="col-md-5">
                                    <Calendar />
                                </div>
                                <div className="col-md-7">
                                    <PetitionList 
                                        cases={cases}
                                        title={t('petitions')}
                                        url={`/court/case/scrutiny/detail/`}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
  )
}

export default Dashboard