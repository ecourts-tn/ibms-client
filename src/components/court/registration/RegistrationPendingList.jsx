import api from 'api'
import React, {useState, useEffect, useContext} from 'react'
import ReactTimeAgo from 'react-time-ago'
import { Link } from 'react-router-dom'
import Loading from 'components/utils/Loading'
import { LanguageContext } from 'contexts/LanguageContex';
import { useTranslation } from 'react-i18next'; 
import { formatDate } from 'utils'
import ListFilter from 'components/utils/ListFilter'
import Pagination from 'components/utils/Pagination'

const RegistrationPendingList = () => {
    const[cases, setCases] = useState([])
    const[loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [count, setCount] = useState(0);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fecthCases = async() =>{
            try{
                setLoading(true)
                const response = await api.get("court/registration/pending/", {
                    params: {
                        page,
                        page_size: pageSize,
                        search,
                    },
                })
                if(response.status === 200){
                    setCases(response.data.results)
                    setCount(response.data.count);
                }

            }catch(error){
                console.error(error)
            }finally{
                setLoading(false)
            }
        }
        fecthCases();
    },[page, pageSize, search])


    return (
        <React.Fragment>
            {loading && <Loading />}
            <div className="row">
                <div className="col-sm-12">
                    <ol className="breadcrumb mt-2">
                        <li className="breadcrumb-item"><a href="#">Home</a></li>
                        <li className="breadcrumb-item active">Dashboard</li>
                    </ol>
                    <div className="card card-outline card-primary" style={{minHeight:'600px'}}>
                        <div className="card-header"><strong>Case Registration - Pending List</strong></div>
                        <div className="card-body">
                            <ListFilter 
                                search={search}
                                setSearch={setSearch}
                                pageSize={pageSize}
                                setPageSize={setPageSize}
                                count={count}
                            />
                            <table className="table table-bordered table-striped">
                                <thead className="bg-info">
                                    <tr>
                                        <th>#</th>
                                        <th>{t('filing_number')}</th>
                                        <th>{t('efile_number')} </th>
                                        <th>{t('crime_details')}</th>
                                        <th>{t('litigants')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { cases.map((c, index) => (
                                    <tr>
                                        <td>{index+1}</td>
                                        <td>
                                            <Link to={`/court/case/registration/detail/`} state={{efile_no: c.petition.efile_number}}>
                                                {c.petition?.cino}
                                            </Link>
                                        </td>
                                        <td><span className="text-primary">{c.petition.efile_number}</span> <br/>{formatDate(c.petition?.efile_date)}</td>
                                        <td>
                                            {`${c.petition.fir_number}/${c.petition.fir_year}`} <br/>
                                            {`${c.petition.police_station?.station_name}, ${c.petition.district?.district_name}`}
                                        </td>
                                        <td>
                                            { c.petition.pet_name }
                                                <span className="mx-2 text-danger">Vs</span>
                                            { c.petition.res_name }
                                        </td>
                                    </tr>    
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="card-footer pb-0">
                            <Pagination 
                                page={page}
                                setPage={setPage}
                                count={count}
                                pageSize={pageSize}
                            />
                        </div>
                    </div>
                </div>
            </div>                             
        </React.Fragment>
    )
}

export default RegistrationPendingList