import React, { useState, useEffect, useContext } from 'react';
import api from 'api';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from 'contexts/LanguageContex';
import Loading from 'components/Loading';
import 'components/court/style.css';
import { toast, ToastContainer } from 'react-toastify';

const PostCauseList = () => {
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);
    const [loading, setLoading] = useState(false);
    const [cases, setCases] = useState([]);
    const [dates, setDates] = useState({}); // State to track individual dates

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const response = await api.get("court/cause-list/pending/");
                setCases(response.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleDateChange = (index, date) => {
        setDates((prevDates) => ({ ...prevDates, [index]: date }));
    };

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
            if(response.status === 201){
                toast.success("Case posted successfully", {theme:"colored"})
                const newCases = cases.filter(
                    (c) => c.petition.efile_number !== caseData.petition.efile_number
                );
                setCases(newCases); 
            }
        } catch (err) {
            toast.error("Something went wrong!", {theme:"colored"})
        } finally {

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
                            <i className="fas fa-edit mr-2"></i><strong>Cause List</strong>
                        </h3>
                    </div>
                    <div className="card-body admin-card">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped">
                                        <thead className="bg-secondary">
                                            <tr>
                                                <th>S. NO</th>
                                                <th>eFile Number</th>
                                                <th>Crime Number/Year</th>
                                                <th>Petitioners</th>
                                                <th>Hearing Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cases && cases.map((c, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <Link to="/court/case/scrutiny/detail" state={{ efile_no: c.petition.efile_number }}>
                                                            {c.petition.efile_number}
                                                        </Link>
                                                        <span style={{ display: "block" }}>
                                                            {`${c.petition.filing_type?.type_name}/${c.petition.filing_number}/${c.petition.filing_year}`}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {c.crime?.fir_number} / {c.crime?.fir_year}<br />
                                                        {c.crime?.police_station && (
                                                            <span>{c.crime.police_station?.station_name}, {c.crime.district?.district_name}</span>
                                                        )}
                                                    </td>
                                                    <td className="text-center">
                                                        {c.litigants.filter((l) => l.litigant_type === 1).map((l, idx) => (
                                                            <span className="text ml-2" key={idx}>{idx + 1}. {l.litigant_name}</span>
                                                        ))}<br />
                                                        <span className="text text-danger">Vs</span><br />
                                                        {c.litigants.filter((l) => l.litigant_type === 2).map((l, idx) => (
                                                            <span className="text ml-2" key={idx}>{idx + 1}. {l.litigant_name} {l.designation?.designation_name}</span>
                                                        ))}
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="date"
                                                            value={dates[index] || ""}
                                                            onChange={(e) => handleDateChange(index, e.target.value)}
                                                        />
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
                </div>
            </div>
        </div>
    );
};

export default PostCauseList;
