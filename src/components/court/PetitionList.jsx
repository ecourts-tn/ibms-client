import React, { useState, useEffect, useContext } from 'react';
import api from 'api';
import ReactTimeAgo from 'react-time-ago';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';
import Loading from 'components/utils/Loading';
import { formatDate } from 'utils';
import ListFilter from 'components/utils/ListFilter';
import Pagination from 'components/utils/Pagination';

const PetitionList = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [count, setCount] = useState(0);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fecthCases = async () => {
            try {
                setLoading(true);
                const response = await api.get("court/petition/", {
                    params: {
                        page,
                        page_size: pageSize,
                        search,
                    },
                });
                if (response.status === 200) {
                    setCases(response.data.results);
                    setCount(response.data.count); 
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fecthCases();
    }, [page, pageSize, search]);

    return (
        <React.Fragment>
            <div className="row">
                {loading && <Loading />}
                <div className="col-sm-12">
                    <ol className="breadcrumb mt-2">
                        <li className="breadcrumb-item"><a href="#">Home</a></li>
                        <li className="breadcrumb-item active">Dashboard</li>
                    </ol>
                    <div className="card card-outline card-primary" style={{ minHeight: '600px' }}>
                        <div className="card-header"><strong>Total Petitions</strong></div>
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
                                        <th>{t('efile_number')}</th>
                                        <th>{t('filing_date')}</th>
                                        <th>{t('case_type')}</th>
                                        <th>{t('litigants')}</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { Object.keys(cases).length > 0 ? (
                                        cases.map((c, index) => (
                                        <tr>
                                            <td>{index+1}</td>
                                            <td style={{fontWeight:600}}>
                                                <Link to={`/court/case/scrutiny/detail`} state={{ efile_no: c.petition.efile_number }}>
                                                    {c.petition.efile_number}
                                                </Link>
                                            </td>
                                            <td>
                                                {formatDate(c.petition?.efile_date)}
                                            </td>
                                            <td>
                                                { language === 'ta' ? c.petition.case_type?.type_lfull_form : c.petition.case_type?.type_full_form}
                                            </td>
                                            <td>
                                                { c.petition.pet_name }
                                                    <span className="mx-2 text-danger">Vs</span>
                                                { c.petition.res_name }
                                            </td>
                                            <td>
                                                <small className="badge badge-success">
                                                    <i className="far fa-clock" />
                                                    <ReactTimeAgo date={c.petition.created_at} locale="en-US" />
                                                </small>
                                            </td>
                                        </tr>    
                                        ))

                                    ) : (
                                        <tr>
                                            <td colSpan={6} className='text-center'>
                                                <span className='text-danger'>All cases have been reviewed — none pending for scrutiny</span>    
                                            </td>
                                        </tr>
                                    )}
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
    );
};

export default PetitionList;
