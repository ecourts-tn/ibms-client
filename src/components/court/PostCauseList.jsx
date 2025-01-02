import React, { useState, useEffect, useContext } from 'react';
import api from 'api';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';
import Loading from 'components/common/Loading';
import 'components/court/style.css';
import { toast, ToastContainer } from 'react-toastify';
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css"; // Import flatpickr styles
import { FaCalendarAlt } from 'react-icons/fa'; // Import a calendar icon (FontAwesome)

const PostCauseList = () => {
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);
    const [loading, setLoading] = useState(false);
    const [cases, setCases] = useState([]);
    const [dates, setDates] = useState({}); // State to track individual dates
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const response = await api.get("court/cause-list/pending/");
                if (response.status === 200) {
                    setCases(response.data);
                    setTotalItems(response.data.length);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const formatDate = (date) => {
        if (!(date instanceof Date)) {
            date = new Date(date); // Convert to Date if it's not already
        }
        const month = ("0" + (date.getMonth() + 1)).slice(-2); // Get month and format to 2 digits
        const day = ("0" + date.getDate()).slice(-2); // Get day and format to 2 digits
        const year = date.getFullYear(); // Get the full year
        return `${day}/${month}/${year}`; // Return in dd/mm/yyyy format
    };

    useEffect(() => {
        // Initialize flatpickr for each row input after the data is loaded
        flatpickr(".appointment-date-picker", {
            dateFormat: "d/m/Y",
            minDate: "today", // Disable past dates for appointment date
            onChange: (selectedDates, dateStr, instance) => {
                const index = instance.element.dataset.index; // Get index from data-index
                const formattedDate = selectedDates[0] ? formatDate(selectedDates[0]) : "";
                setDates((prevDates) => ({ ...prevDates, [index]: formattedDate }));
            },
        });
    }, [cases]); // Runs every time the cases data changes

    // Filter cases based on search term (efile_number or crime_number/year)
    const filteredCases = cases.filter(item => {
        const efileMatch = item.petition.efile_number.toLowerCase().includes(searchTerm.toLowerCase());
        const crimeNumberYear = `${item.crime?.fir_number}/${item.crime?.fir_year}`;
        const crimeMatch = crimeNumberYear.toLowerCase().includes(searchTerm.toLowerCase());

        const caseNumber = `${item.petition.reg_type?.type_name}/${item.petition.reg_number}/${item.petition.reg_year}`;
        const caseMatch = caseNumber.toLowerCase().includes(searchTerm.toLowerCase());

        return efileMatch || crimeMatch || caseMatch;
    });

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCases = filteredCases.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle items per page change
    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value)); // Update items per page
        setCurrentPage(1); // Reset to the first page whenever the items per page change
    };

    // Calculate total number of pages
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredCases.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const handleSubmit = async (caseData, index) => {
        const hearingDate = dates[index];
        if (!hearingDate) {
            alert("Please select a hearing date before submitting.");
            return;
        }

        const payload = {
            efile_no: caseData.petition.efile_number,
            hearing_date: hearingDate,
        };

        try {
            const response = await api.post(`court/cause-list/`, payload);
            if (response.status === 201) {
                toast.success("Case posted successfully", { theme: "colored" });
                const newCases = cases.filter((c) => c.petition.efile_number !== caseData.petition.efile_number);
                setCases(newCases);
            }
        } catch (err) {
            toast.error("Something went wrong!", { theme: "colored" });
        }
    };

    return (
        <div className="content-wrapper">
            <ToastContainer />
            {loading && <Loading />}
            <div className="container-fluid mt-3">
                <div className="card card-outline card-primary">
                    <div className="card-header">
                        <h3 className="card-title">
                            <i className="fas fa-edit mr-2"></i><strong>{t('Cause List')}</strong>
                        </h3>
                    </div>
                    <div className="card-body admin-card">
                        {/* Search and Items per page filter */}
                        <div className="row mb-3">
                            <label className="mr-2">{t('Search')}:</label>
                            <div className="col-md-3">
                                {/* Search Box */}
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t('Search Case or Efile or Crime number')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)} // Handle search input change
                                />
                            </div>

                            <div className="col-md-1" style={{display:'flex'}}>
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
                        
                        {/* Table with data */}
                        <div className="row">
                            <div className="col-md-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped">
                                        <thead className="bg-secondary">
                                            <tr>
                                                <th>S. NO</th>
                                                <th>{t('Case Number or efile_number')}</th>
                                                <th>{t('Crime Number/Year')}</th>
                                                <th>{t('Petitioners')}</th>
                                                <th>{t('Hearing Date')}</th>
                                                <th>{t('Action')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentCases.map((c, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1 + indexOfFirstItem}</td>
                                                    <td>
                                                        <Link 
                                                            to="/court/case/scrutiny/detail" 
                                                            state={c.petition?.efile_number ? { efile_no: c.petition.efile_number } : undefined}
                                                        >
                                                            {c.petition?.reg_type?.type_name && c.petition?.reg_number && c.petition?.reg_year ? (
                                                                <strong>{`${c.petition.reg_type.type_name}/${c.petition.reg_number}/${c.petition.reg_year}`}</strong>
                                                            ) : null}
                                                            <br />
                                                            {c.petition?.efile_number ? (
                                                                <strong>{c.petition.efile_number}</strong>
                                                            ) : null}
                                                        </Link>
                                                        {c.petition?.efile_date ? (
                                                            <span style={{ display: "block" }}>
                                                                {t('efile_date')}: {formatDate(c.petition.efile_date)}
                                                            </span>
                                                        ) : null}
                                                    </td>
                                                    <td>
                                                        {c.crime?.fir_number} / {c.crime?.fir_year}<br />
                                                        {c.crime?.police_station?.station_name && (
                                                            <span>{c.crime.police_station.station_name}, {c.crime.district?.district_name}</span>
                                                        )}
                                                    </td>
                                                    <td className="text-center">
                                                        {c.litigants.filter(l => l.litigant_type === 1).map((l, idx) => (
                                                            <span key={idx}>{l.litigant_name}</span>
                                                        ))}
                                                        <br />
                                                        <span className="text text-danger">Vs</span>
                                                        <br />
                                                        {c.litigants.filter(l => l.litigant_type === 2).map((l, idx) => (
                                                            <span key={idx}>{l.litigant_name} {l.designation?.designation_name}</span>
                                                        ))}
                                                    </td>
                                                    <td>
                                                        <div className="input-group date-input">
                                                            <input
                                                                type="text"
                                                                className="form-control appointment-date-picker"
                                                                data-index={index}
                                                                value={dates[index] || ""}
                                                                placeholder={t('Select hearing date')}
                                                                style={{
                                                                    backgroundColor: 'transparent',
                                                                    border: '1px solid #ccc', // Optional: Adjust border
                                                                    padding: '8px',            // Optional: Adjust padding
                                                                }}
                                                            />
                                                            <div className="input-group-append">
                                                                <span className="input-group-text">
                                                                    <FaCalendarAlt /> {/* Calendar icon inside input */}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => handleSubmit(c, index)}
                                                        >
                                                            Submit
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {/* Pagination Controls */}
                                <div className="d-flex justify-content-between mt-3">
                                    <div className="pagination">
                                        <ul className="pagination">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => paginate(currentPage - 1)}>{t('previous')}</button>
                                            </li>
                                            {pageNumbers.map(number => (
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
                                        <span>{t('showing')} {indexOfFirstItem + 1} {t('to')} {indexOfLastItem} {t('of')} {filteredCases.length} {t('entries')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCauseList;
