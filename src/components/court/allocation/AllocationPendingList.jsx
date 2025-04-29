import api from 'api'
import React, {useState, useEffect, useContext} from 'react'
import ReactTimeAgo from 'react-time-ago'
import { Link } from 'react-router-dom'
import Loading from 'components/utils/Loading'
import { LanguageContext } from 'contexts/LanguageContex';
import { useTranslation } from 'react-i18next'; 
import ListFilter from 'components/utils/ListFilter'
import Pagination from 'components/utils/Pagination'

const AllocationPendingList = () => {
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
                const response = await api.get("court/allocation/pending/", {
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
                        <div className="card-header"><strong>Case Allocation</strong></div>
                        <div className="card-body">
                            <ListFilter 
                                search={search}
                                setSearch={setSearch}
                                pageSize={pageSize}
                                setPageSize={setPageSize}
                                count={count}
                            />
                            <ul className="todo-list" data-widget="todo-list">
                                { cases.map((c, index) => (
                                    <li key={index}>
                                        <span className="handle">
                                            <i className="fas fa-ellipsis-v" />
                                            <i className="fas fa-ellipsis-v" />
                                        </span>
                                        <div className="icheck-primary d-inline ml-2">
                                            <input type="checkbox" name={`todo${index}`} id={`todoCheck${index}`} />
                                            <label htmlFor="todoCheck1" />
                                        </div>
                                        <span className="text mr-3">
                                            <Link to={`/court/case/allocation/detail/`} state={{efile_no: c.petition.efile_number}}>
                                                {c.petition?.reg_type?.type_name && c.petition?.reg_number && c.petition?.reg_year ? (
                                                    `${c.petition.reg_type.type_name}/${c.petition.reg_number}/${c.petition.reg_year}`
                                                ) : null}
                                            </Link>
                                            <span className="text-success ml-2">
                                                {`(${c.petition.cino})`}
                                            </span>
                                        </span>
                                        { c.petition?.pet_name }
                                        <span className="text text-danger px-2">Vs</span>
                                        { c.petition?.res_name }
                                        <div className="float-right">
                                            <small className="badge badge-success"><i className="far fa-clock" /><ReactTimeAgo date={c.petition.created_at} locale="en-US"/></small>
                                        </div>
                                    </li>
                                ))}
                            </ul>
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

export default AllocationPendingList