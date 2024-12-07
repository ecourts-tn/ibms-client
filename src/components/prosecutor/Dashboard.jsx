import React, {useState, useEffect} from 'react'
import api from '../../api'
import ReactTimeAgo from 'react-time-ago'
import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import DashboardCard from 'components/common/DashboardCard'
import Calendar from 'components/common/Calendar'
import PetitionList from 'components/common/PetitionList'

const Dashboard = () => {

    const[count, setCount] = useState({})
    const[cases, setCases] = useState([])
    const[loading, setLoading] = useState(false)
    const { t } = useTranslation()

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            const countsEndpoint = 'police/dashboard/counts/';
            const petitionsEndpoint = 'police/dashboard/petitions/';
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
                                    title="Pending Remarks"
                                    icon={'ion-bag'}
                                    url="#"
                                />
                                    <DashboardCard 
                                    color={'bg-success'}
                                    count={count.submitted}
                                    title="Submitted Remarks"
                                    icon={'ion-bag'}
                                    url="#"
                                />
                                <DashboardCard 
                                    color={'bg-warning'}
                                    count={count.approved}
                                    title="Pending Cases"
                                    icon={'ion-bag'}
                                    url="#"
                                />
                                <DashboardCard 
                                    color={'bg-danger'}
                                    count={count.returned}
                                    title="Disposed Cases"
                                    icon={'ion-bag'}
                                    url="#"
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
                                        url={`/prosecution/remark/create/`}
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