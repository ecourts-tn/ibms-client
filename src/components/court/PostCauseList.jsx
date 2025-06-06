import React, { useState, useEffect, useContext } from 'react';
import api from 'api';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';
import Loading from 'components/utils/Loading';
import 'components/court/style.css';
import { toast, ToastContainer } from 'react-toastify';
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css"; // Import flatpickr styles
import { FaCalendarAlt } from 'react-icons/fa'; // Import a calendar icon (FontAwesome)
import ListFilter from 'components/utils/ListFilter';
import Pagination from 'components/utils/Pagination';

const PostCauseList = () => {
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);
    const [loading, setLoading] = useState(false);
    const [cases, setCases] = useState([]);
    const [dates, setDates] = useState({}); // State to track individual dates
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [count, setCount] = useState(0);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const response = await api.get("court/cause-list/pending/", {
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
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [page, pageSize, count]);

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
        <div className="row">
            <div className="col-md-12">
                <ol className="breadcrumb mt-2">
                    <li className="breadcrumb-item"><a href="javascript:void(0)">Home</a></li>
                    <li className="breadcrumb-item"><a href="javascript:void(0)">Dashboard</a></li>
                    <li className="breadcrumb-item active">Post Casue List</li>
                </ol>
                <div className="card card-outline card-primary">
                    <ToastContainer />
                    {loading && <Loading />}
                    <div className="card-header">
                        <h3 className="card-title">
                            <i className="fas fa-edit mr-2"></i><strong>{t('Cause List')}</strong>
                        </h3>
                    </div>
                    <div className="card-body admin-card">
                        <ListFilter 
                            search={search}
                            setSearch={setSearch}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            count={count}
                        />
                        <div className="row">
                            <div className="col-md-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead className="bg-info">
                                            <tr>
                                                <th width="70">{t('sl_no')}</th>
                                                <th>{t('Case Number')}</th>
                                                <th>{t('Crime Detail')}</th>
                                                <th>{t('litigants')}</th>
                                                <th width="150">{t('Hearing Date')}</th>
                                                <th>{t('Action')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cases.map((c, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1 }</td>
                                                    <td>
                                                        <React.Fragment>
                                                            <span className="text-success text-bold d-block">
                                                                {`(${c.petition?.reg_type?.type_name}/${c.petition?.reg_number}/${c.petition?.reg_year})`}
                                                            </span>
                                                            <Link 
                                                                to="#" 
                                                                state={c.petition?.efile_number ? { efile_no: c.petition.efile_number } : undefined}
                                                            >
                                                                {c.petition?.efile_number ? (
                                                                    <strong>{c.petition.cino}</strong>
                                                                ) : null}
                                                            </Link>
                                                        </React.Fragment>
                                                    </td>
                                                    <td>
                                                        {c.petition?.fir_number} / {c.petition?.fir_year}<br />
                                                        {c.petition.police_station?.station_name && (
                                                            <span>{c.petition.police_station?.station_name}, {c.petition.district?.district_name}</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        { c.petition.pet_name }
                                                            <span className="mx-2 text-danger">Vs</span>
                                                        { c.petition.res_name}
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
            </div>
        </div>
    );
};

export default PostCauseList;
