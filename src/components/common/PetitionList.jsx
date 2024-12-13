import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';

const PetitionList = ({ cases, title, url }) => {
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);
     const [petitions, setPetitions] = useState([])

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page
    const [searchQuery, setSearchQuery] = useState(''); // State for search input

    // Filter cases based on search query
    const filteredCases = cases.filter((c) => {
        const efileNumber = c.petition?.efile_number?.toLowerCase() || '';
        const regType = c.petition?.reg_type?.type_name || '';
        const regNumber = c.petition?.reg_number || '';
        const regYear = c.petition?.reg_year ? c.petition.reg_year.toString() : ''; // Convert to string if not null
    
        // Combine the values
        const caseNumber = `${regType}/${regNumber}/${regYear}`.toLowerCase();
    
        const crimeNumber = c.crime_number?.toLowerCase() || '';

        const query = searchQuery.toLowerCase();

        return (
            efileNumber.includes(query) ||
            caseNumber.includes(query) ||
            crimeNumber.includes(query)
        );
    });

    // Pagination calculation
    const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Slice the cases for the current page
    const currentCases = filteredCases.slice(startIndex, endIndex);

    // Handlers
    const paginate = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleItemsPerPageChange = (e) => {
        const newItemsPerPage = parseInt(e.target.value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to the first page
    };

    const generatePageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    // Data range display
    const indexOfFirstItem = startIndex + 1;
    const indexOfLastItem = Math.min(endIndex, filteredCases.length);

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

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to the first page when search changes
    };

    return (
        <div className="card" style={{ minHeight: '500px' }}>
            <div className="card-header bg-secondary d-flex justify-content-between align-items-center">
                <h3 className="card-title">
                    <i className="ion ion-clipboard mr-1" />
                    <strong>{title}</strong>
                </h3>
                 {/* Search Box */}
                <div className="d-flex align-items-center">
                    {/* Search Label */}
                    <label htmlFor="" className="mr-2">{t('Search')}</label>
                    
                    {/* Search Box */}
                    <div style={{ width: '300px' }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder={t('Search by Efile no or Case no or Crime no')}
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
            </div>
            
            <div className="card-body p-1" style={{ height: '650px', overflowY: 'scroll' }}>
               
                {/* Display cases */}
                {currentCases.map((c, index) => {
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
                        <div key={index} style={{ background: '#f2f3f4', padding: '10px', margin: '5px 3px' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Link to={url} state={{ efile_no: c.petition.efile_number }}>
                                        {c.petition?.reg_type?.type_name && c.petition?.reg_number && c.petition?.reg_year ? (
                                            <strong>
                                                {`${c.petition.reg_type.type_name}/${c.petition.reg_number}/${c.petition.reg_year}`}
                                            </strong>
                                        ) : null}
                                        <br />
                                        {c.petition?.efile_number ? (
                                            <strong>{c.petition.efile_number}</strong>
                                        ) : null}
                                    </Link>
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
                                {c.litigants
                                    .filter((l) => parseInt(l.litigant_type) === 1)
                                    .map((l, index) => (
                                        <span key={index}>
                                            {index + 1}. {l.litigant_name}
                                        </span>
                                    ))}
                                <span className="text-danger mx-2">Vs</span>
                                {c.litigants
                                    .filter((l) => parseInt(l.litigant_type) === 2)
                                    .map((l, index) => (
                                        <span key={index}>
                                            {index + 1}. {l.litigant_name}{' '}
                                            {language === 'ta'
                                                ? l.designation?.designation_lname
                                                : l.designation?.designation_name}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination Controls */}
            <div className="card-footer d-flex justify-content-between align-items-center">
                <div>
                    <label htmlFor="itemsPerPage" className="mr-2">{t('Items per page')}:</label>
                    <select
                        id="itemsPerPage"
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="form-control d-inline-block"
                        style={{ width: '100px' }}
                    >
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </select>
                </div>
                <div>
                    <ul className="pagination mb-0">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                                {t('Previous')}
                            </button>
                        </li>
                        {generatePageNumbers().map((page) => (
                            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => paginate(page)}>
                                    {page}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                                {t('Next')}
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="page-info">
                    <span>
                        {t('Showing')} {indexOfFirstItem} {t('to')} {indexOfLastItem} {t('of')} {filteredCases.length}{' '}
                        {t('entries')}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PetitionList;
