import api from 'api'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

const DailyProceedingsList = () => {

    const [cases, setCases] = useState([]);
    const { t } = useTranslation();
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get("court/proceeding/pending/")
                setCases(response.data)
            }catch(err){
                console.log(err)
            }
        }
        fetchData();
    }, [])

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
        <div className="card card-outline card-primary" style={{ minHeight: '700px' }}>
            <div className="card-header">
                <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>Proceeding List</strong></h3>
            </div>
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
                <div className="row">
                    <div className="col-md-12">
                        <ul className="todo-list" data-widget="todo-list">
                            {currentCases.map((c, index) => (
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
                                    {c.litigants.filter((l) => l.litigant_type === 1).map((l, index) => (
                                        <span className="text ml-2" key={index}>
                                            {index + 1}. {l.litigant_name}
                                        </span>
                                    ))}
                                    <span className="text text-danger">Vs</span>
                                    {c.litigants.filter((l) => l.litigant_type === 2).map((l, index) => (
                                        <span className="text ml-2" key={index}>
                                            {index + 1}. {l.litigant_name} {l.designation?.designation_name}
                                        </span>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="card-footer">
                {/* Pagination Controls */}
                <div className="d-flex justify-content-between">
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
                        <span>{t('showing')} {indexOfFirstItem + 1} {t('to')} {Math.min(indexOfLastItem, totalItems)} {t('of')} {totalItems} {t('entries')}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DailyProceedingsList;
