import api from 'api'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import ListFilter from 'components/utils/ListFilter';
import Pagination from 'components/utils/Pagination';
import { toast, ToastContainer } from 'react-toastify';

const DailyProceedingsList = () => {

    const [cases, setCases] = useState([]);
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [count, setCount] = useState(0);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get("court/proceeding/pending/", {
                    params: {
                        page,
                        page_size: pageSize,
                        search,
                    },
                })
                setCases(response.data.results)
                setCount(response.data.count)
            }catch(err){
                if(err.response.status === 400){
                    toast.error(err.response.data.error, {
                        theme: "colored"
                    })
                }
            }
        }
        fetchData();
    }, [page, pageSize, count])

    return (
        <div className="card card-outline card-primary" style={{ minHeight: '700px' }}>
            <ToastContainer />
            <div className="card-header">
                <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Proceeding List</strong></h3>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-12">
                        <ListFilter 
                            search={search}
                            setSearch={setSearch}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            count={count}
                        />
                        <ul className="todo-list" data-widget="todo-list">
                            {cases.map((c, index) => (
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
                                        <Link to={`/court/case/proceeding/detail/`} state={{ efile_no: c.petition.efile_number }}>
                                            {c.petition.efile_number}
                                        </Link>
                                    </span>
                                    { c.petition?.pet_name }
                                    <span className="text text-danger px-2">Vs</span>
                                    { c.petition?.res_name }
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
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
    )
}

export default DailyProceedingsList;
