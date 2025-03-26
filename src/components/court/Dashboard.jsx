import React, {useState, useEffect, useContext} from 'react'
import api from '../../api'
import ReactTimeAgo from 'react-time-ago'
import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import DashboardCard from 'components/utils/DashboardCard'
import Calendar from 'components/utils/Calendar'
import PetitionList from 'components/utils/PetitionList'
import { AuthContext } from 'contexts/AuthContext'
import { JudgeContext } from 'contexts/JudgeContext'

const Dashboard = () => {

    const[count, setCount] = useState({})
    const[cases, setCases] = useState([])
    const[calendar, setCalendar] = useState([])
    const[loading, setLoading] = useState(false)

    const { t } = useTranslation()

    const {user} = useContext(AuthContext)
    const {judge, setJudge} = useContext(JudgeContext)

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            const countsEndpoint = 'court/dashboard/counts/';
            const petitionsEndpoint = 'court/dashboard/petitions/';
            const calendarEndpoint = 'case/dashboard/upcoming/'
            // Use Promise.all to fetch both endpoints in parallel
            const [countsResponse, petitionsResponse, calendarResponse] = await Promise.all([
                api.get(countsEndpoint),
                api.get(petitionsEndpoint),
                api.get(calendarEndpoint)
            ]);
            // Extract the data from the responses
            const counts = countsResponse.data;
            const petitions = petitionsResponse.data;       
            const upcoming = calendarResponse.data    
            setCount(counts)
            setCases(petitions?.petitions)
            setCalendar(upcoming)
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
                                    title="Total Petitions"
                                    icon={'ion-bag'}
                                    url={`/filing/draft`}
                                />
                                    <DashboardCard 
                                    color={'bg-success'}
                                    count={count.submitted}
                                    title="Approved Petitions"
                                    icon={'ion-bag'}
                                    url={`/filing/draft`}
                                />
                                <DashboardCard 
                                    color={'bg-warning'}
                                    count={count.approved}
                                    title="Returened Petitions"
                                    icon={'ion-bag'}
                                    url={`/filing/draft`}
                                />
                                <DashboardCard 
                                    color={'bg-danger'}
                                    count={count.returned}
                                    title="Rejected Petitions"
                                    icon={'ion-bag'}
                                    url={`/filing/draft`}
                                />
                            </div>
                            <div className="row">
                                <div className="col-md-5">
                                    <Calendar upcoming={calendar}/>
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