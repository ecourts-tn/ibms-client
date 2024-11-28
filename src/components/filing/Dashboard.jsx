import api from 'api'
import React, {useState, useEffect} from 'react'
import { ToastContainer } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import Loading from 'components/Loading'
import DashboardCard from 'components/common/DashboardCard'
import Calendar from 'components/common/Calendar'
import PetitionList from 'components/common/PetitionList'
import DynamicChart from 'components/common/DynamicChart'

const Dashboard = () => {

    const[count, setCount] = useState({})
    const[cases, setCases] = useState([])
    const[loading, setLoading] = useState(false)
    const { t } = useTranslation()

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            const countsEndpoint = 'case/dashboard/counts/';
            const petitionsEndpoint = 'case/dashboard/petitions/';
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
            <div className="container-fluid" style={{minHeight:'600px'}}>
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
                </div>
                { loading && <Loading />}
                <section className="content">
                    <div className="container-fluid">
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
                            <div className="col-md-6">
                                <DynamicChart />
                                <Calendar />
                            </div>
                            <div className="col-md-6">
                                <PetitionList cases={cases}/>
                            </div>
                            <div className="col-md-12">
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default Dashboard