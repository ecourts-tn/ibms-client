import React, { useState, useEffect, useContext } from 'react';
import api from '../../../api';
import ReactTimeAgo from 'react-time-ago';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';
import Loading from 'components/utils/Loading';
import { formatDate } from 'utils';

const PendingList = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        const fecthCases = async () => {
            try {
                setLoading(true);
                const response = await api.get("court/scrutiny/pending/");
                if (response.status === 200) {
                    setCases(response.data);
                    setTotalItems(response.data.length); // Update the total number of items
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fecthCases();
    }, []);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCases = cases.slice(indexOfFirstItem, indexOfLastItem); // Slice cases for the current page

    // Handle page change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle items per page change
    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value)); // Update items per page
        setCurrentPage(1); // Reset to the first page whenever the items per page change
    };

    // Calculate total number of pages
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

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
                        <div className="card-header"><strong>Scrutiny List</strong></div>
                        <div className="card-body">
                            <div className="row mb-3">
                                <div className="col-md-1" style={{ display: 'flex' }}>
                                    <label className="mr-3">{t('Filter')}:</label>
                                    <select
                                        className="form-control col-md-6"
                                        value={itemsPerPage}
                                        onChange={handleItemsPerPageChange}
                                    >
                                        <option value={10}>10</option>
                                        <option value={15}>15</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                    </select>
                                </div>
                            </div>
                            <table className="table table-bordered table-striped">
                                <thead className="bg-secondary">
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
                                    { Object.keys(currentCases).length > 0 ? (
                                        currentCases.map((c, index) => (
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
                        <div className="card-footer">
                            {/* Pagination Controls */}
                            <div className="d-flex justify-content-between mb-0">
                                <div className="pagination">
                                    <ul className="pagination">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => paginate(currentPage - 1)}>{t('previous')}</button>
                                        </li>
                                        {pageNumbers.map((number) => (
                                            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                                <button className="page-link" onClick={() => paginate(number)}>{number}</button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => paginate(currentPage + 1)}>{t('next')}</button>
                                        </li>
                                    </ul>
                                </div>
                                <div className="page-info">
                                    <span>{t('showing')} {indexOfFirstItem + 1} {t('to')} {indexOfLastItem} {t('of')} {totalItems} {t('entries')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </React.Fragment>
    );
};

export default PendingList;
