import React, {useState, useEffect, useContext} from 'react'
import api from '../../api'
import ReactTimeAgo from 'react-time-ago'
import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import DashboardCard from 'components/utils/DashboardCard'
import PetitionList from 'components/utils/PetitionList'
import { AuthContext } from 'contexts/AuthContext'
import { JudgeContext } from 'contexts/JudgeContext'
import MyCalendar from 'components/utils/MyCalendar'

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
            const petitionsEndpoint = 'court/petition/';
            const calendarEndpoint = 'court/dashboard/upcoming/'
            // Use Promise.all to fetch both endpoints in parallel
            const [countsResponse, petitionsResponse, calendarResponse] = await Promise.all([
                api.get(countsEndpoint),
                api.get(petitionsEndpoint, {
                    params:{
                        page:'',
                        page_size: 10,
                        search: ''
                    }
                }),
                api.get(calendarEndpoint)
            ]);
            // Extract the data from the responses
            const counts = countsResponse.data;
            const petitions = petitionsResponse.data.results;       
            const upcoming = calendarResponse.data    
            setCount(counts)
            setCases(petitions)
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
                const response = await api.post(`base/judge-period/detail/`, {court:user.court.court_code})
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
        <React.Fragment>
            <div className="content-header">
                <ToastContainer />
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
                            count={count.total_petitions}
                            title="Total Petitions"
                            icon={'ion-bag'}
                            url={`/court/petition/`}
                        />
                            <DashboardCard 
                            color={'bg-success'}
                            count={count.approved_petitions}
                            title="Approved Petitions"
                            icon={'ion-bag'}
                            url={`/court/approved`}
                        />
                        <DashboardCard 
                            color={'bg-warning'}
                            count={count.returned_petitions}
                            title="Returened Petitions"
                            icon={'ion-bag'}
                            url={`/court/returned`}
                        />
                        <DashboardCard 
                            color={'bg-danger'}
                            count={count.rejected_petitions}
                            title="Rejected Petitions"
                            icon={'ion-bag'}
                            url={`/court/rejected`}
                        />
                    </div>
                    <div className="row">
                        <div className="col-md-5">
                            <MyCalendar upcoming={calendar} endpoint={`/court/listed/`}/>
                        </div>
                        <div className="col-md-7 pb-0">
                            <PetitionList 
                                cases={cases}
                                title={t('petitions')}
                                url={`/court/case/scrutiny/detail/`}
                                endpoint={`/court/petition/`}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
  )
}

export default Dashboard