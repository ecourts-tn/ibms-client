import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';
import ListFilter from 'components/utils/ListFilter';
import Pagination from 'components/utils/Pagination';
import api from 'api';
import Loading from 'components/utils/Loading';

const PetitionList = ({ endpoint, title, url }) => {
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);
    const [cases, setCases] = useState([])
    const [petitions, setPetitions] = useState([])
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [count, setCount] = useState(0);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false)
    
    useEffect(() => {
        const fetchPetition = async() => {
            try{
                setLoading(true)
                const response = await api.get(endpoint, {
                    params: {
                        page,
                        page_size: pageSize,
                        search,
                      },
                })
                setCases(response.data.results)
                setCount(response.data.count);
            }catch(error){
                console.log(error)
            }finally{
                setLoading(false)
            }
        }
        fetchPetition()
    }, [page, pageSize, search])

    const getStatusBadge = (status, isReturned, regType, regNumber, regYear, underObjection, isDisposed) => {
        if (regType && regNumber && regYear) {
            return { label: 'Registered', color: 'badge-success' };
        } else if (!regType || !regNumber || !regYear) {
            return { label: 'Unregistered', color: 'badge-warning' };
        }

        if (isReturned) {
            return { label: 'Return', color: 'badge-info' };
        }
        if (underObjection) {
            return { label: 'Return', color: 'badge-primary' };
        }
        if (isDisposed) {
            return { label: 'Return', color: 'badge-danger' };
        }
    };

    

    return (
        <div className="card">
            { loading && <Loading />}
            <div className="card-header bg-primary d-flex justify-content-between align-items-center">
                <h3 className="card-title">
                    <i className="ion ion-clipboard mr-1" />
                    <strong>{title}</strong>
                </h3>
            </div>

            <div className="card-body p-2" style={{ height: '390px', overflowY: 'scroll' }}>
                {/* Display cases */}
                <ListFilter 
                    search={search}
                    setSearch={setSearch}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    count={count}
                />
                {cases.map((c, index) => {
                    const statusBadge = getStatusBadge(
                        c.status,
                        c.is_returned,
                        c.petition?.reg_type?.type_name,
                        c.petition?.reg_number,
                        c.petition?.reg_year,
                        c.is_under_objection,
                        c.is_disposed
                    );

                    return (
                        <div key={index} style={{ background: '#f2f3f4', padding: '10px', margin: '5px 3px', border:"1px solid lightgrey" }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Link to={url} state={{ efile_no: c.petition.efile_number }}>

                                        {c.petition?.efile_number ? (
                                            <strong>{c.petition.efile_number}</strong>
                                        ) : null}

                                    </Link>
                                    {c.petition?.reg_type?.type_name && c.petition?.reg_number && c.petition?.reg_year && (
                                        <>
                                            <span style={{ margin: '0 5px' }}>  </span>
                                            <strong style={{ color: '#228e3a' }}> 
                                                ( {`${c.petition.reg_type.type_name}/${c.petition.reg_number}/${c.petition.reg_year}`} )
                                            </strong>
                                        </>
                                    )}
                                </div>

                                <div className="d-flex justify-content-end align-items-center">
                                    <span
                                        className={`badge ${statusBadge.color} ml-2`}
                                        style={{ fontSize: '0.8rem', borderRadius: '12px' }}
                                    >
                                        {statusBadge.label}
                                    </span>
                                </div>
                            </div>

                            <div>
                                {c.petition?.pet_name}
                                <span className="text-danger mx-2">Vs</span>
                                {c.petition?.res_name}
                            </div>
                        </div>
                    );
                })}
                <Pagination 
                    page={page}
                    setPage={setPage}
                    count={count}
                    pageSize={pageSize}
                />
            </div>
        </div>
    );
};

export default PetitionList;
