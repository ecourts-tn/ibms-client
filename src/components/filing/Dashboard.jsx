import api from 'api'
import React, {useState, useEffect} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import Loading from 'components/utils/Loading'
import DashboardCard from 'components/utils/DashboardCard'
import Calendar from 'components/utils/Calendar'
import PetitionList from 'components/utils/PetitionList'
import MyCalendar from 'components/utils/MyCalendar'

const Dashboard = () => {

    const[count, setCount] = useState({})
    const[cases, setCases] = useState([])
    const[calendar, setCalendar] = useState([])
    const[loading, setLoading] = useState(false)
    const { t } = useTranslation()

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            const countsEndpoint = 'case/dashboard/counts/';
            const petitionsEndpoint = 'case/dashboard/petitions/';
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
            // console.error('Error fetching dashboard data:', error);
            // throw error;
            if (error.response?.status === 500) {
                toast.error("Internal Server error. Please try again later.", {theme:"colored"});
              } else {
                toast.error(`Error: ${error.response?.data?.message || "Unexpected error occurred"}`);
              }
        }finally{
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchDashboardData();
    },[])

    return (
        <div className="container-fluid">
            <ToastContainer /> { loading && <Loading />}
            <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-12">
                        <nav aria-label="breadcrumb" className="mt-2 mb-1">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="#/">{t('home')}</a></li>
                                <li className="breadcrumb-item active"  aria-current="page">{t('dashboard')}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className="row">
                    <DashboardCard 
                        color={'bg-info'}
                        count={count.draft}
                        title={t('draft_petition')}
                        icon={'ion-bag'}
                        url={`/filing/draft`}
                    />
                    <DashboardCard 
                        color={'bg-success'}
                        count={count.submitted}
                        title={t('submitted_petition')}
                        icon={'ion-stats-bars'}
                        url={`/filing/submitted`}
                    />
                    <DashboardCard 
                        color={'bg-warning'}
                        count={count.approved}
                        title={t('approved_petition')}
                        icon={'ion-person-add'}
                        url={`/filing/approved`}
                    />
                    <DashboardCard 
                        color={'bg-danger'}
                        count={count.returned}
                        title={t('returned_petition')}
                        icon={'ion-pie-graph'}
                        url={`/filing/returned`}
                    />
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <MyCalendar />
                        {/* <div className="progress-group">
                            Registered
                            <span className="float-right"><b>160</b>/200</span>
                            <div className="progress progress-sm">
                            <div className="progress-bar bg-success progress-bar-striped" style={{width: '80%'}} />
                            </div>
                        </div>
                        <div className="progress-group">
                            Unregistered
                            <span className="float-right"><b>310</b>/400</span>
                            <div className="progress progress-sm">
                            <div className="progress-bar bg-warning progress-bar-striped" style={{width: '75%'}} />
                            </div>
                        </div> */}
                    </div>
                    <div className="col-md-8">
                        <PetitionList 
                            cases={cases}
                            endpoint="case/dashboard/petitions/"
                            title={t('my_petition')}
                            url={`/filing/detail/`}
                        />
                    </div>
                    <div className="col-md-12">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard