import React, {useState, useEffect} from 'react'
import api from 'api'
import { ToastContainer } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import DashboardCard from 'components/utils/DashboardCard'
import MyCalendar from 'components/utils/MyCalendar'
import PetitionList from 'components/utils/PetitionList'

const Dashboard = () => {

    const[count, setCount] = useState({})
    const[cases, setCases] = useState([])
    const[loading, setLoading] = useState(false)
    const[calendar, setCalendar] = useState([])
    const { t } = useTranslation()

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            const countsEndpoint = 'police/dashboard/counts/';
            const petitionsEndpoint = 'police/dashboard/petitions/';
            const calendarEndpoint = 'police/dashboard/upcoming/'
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

    return (
        <React.Fragment>
            <ToastContainer />
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
                            count={count.response_pending}
                            title="Pending Response"
                            icon={'ion-bag'}
                            url="/police/response/pending"
                        />
                            <DashboardCard 
                            color={'bg-success'}
                            count={count.response_submitted}
                            title="Submitted Response"
                            icon={'ion-bag'}
                            url="/police/response/submitted"
                        />
                        <DashboardCard 
                            color={'bg-warning'}
                            count={count.case_pending}
                            title="Pending Cases"
                            icon={'ion-bag'}
                            url="#"
                        />
                        <DashboardCard 
                            color={'bg-danger'}
                            count={count.case_disposed}
                            title="Disposed Cases"
                            icon={'ion-bag'}
                            url="#"
                        />
                    </div>
                    <div className="row">
                        <div className="col-md-5">
                            <MyCalendar 
                                upcoming={calendar} 
                                endpoint={`/police/listed`}   
                            /> 
                        </div>
                        <div className="col-md-7">
                            <PetitionList 
                                cases={cases}
                                title="Pending Response"
                                url={`/police/response/detail/`}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
  )
}

export default Dashboard