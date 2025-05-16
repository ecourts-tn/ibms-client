import api from 'api';
import { LanguageContext } from 'contexts/LanguageContex';
import { Link } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import 'components/court/style.css';
import Loading from 'components/utils/Loading';
import Button from '@mui/material/Button';
import { toast, ToastContainer } from 'react-toastify';
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";
import { FaCalendarAlt } from 'react-icons/fa';

const PublishCasueList = () => {
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);
    const [loading, setLoading] = useState(false);
    const [cases, setCases] = useState([]);
    const [hearingDate, setHearingDate] = useState('');
    const [errors, setErrors] = useState({});

    const produced_date_Display = (date) => {
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const produced_date_Backend = (date) => {
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const publish_date = flatpickr(".publish-date-date-picker", {
            dateFormat: "d-m-Y",
            minDate: "today",
            onChange: (selectedDates) => {
                const formattedDate = selectedDates[0] ? produced_date_Backend(selectedDates[0]) : "";
                setCases({ ...cases, publish_date: formattedDate });
            },
        });

        return () => {
            if (publish_date && typeof publish_date.destroy === "function") {
                publish_date.destroy();
            }
        };
    }, [cases]);

    // Handle Search without passing hearing_date initially
    const handleSearch = async () => {
        try {
            setLoading(true);

            // Make the request without hearing_date initially
            const response = await api.get("court/cause-list/");

            // Ensure the response is an array
            if (Array.isArray(response.data)) {
                setCases(response.data);
            } else {
                setCases([]);
                toast.error("Invalid data format received for cases.", { theme: "colored" });
            }
        } catch (err) {
            console.log(err);
            toast.error("Error fetching cases.", { theme: "colored" });
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async () => {
        const selectedFields = cases.map((c, index) => ({
            efile_number: c.petition.efile_number,
            date_next_list: c.petition.date_next_list,
            item_no: index + 1
        }));
        try {
            setLoading(true);
            const response = await api.put(`court/cause-list/publish/`, selectedFields);
            if (response.status === 200) {
                toast.success("Cause list published successfully", { theme: "colored" });
            }
        } catch (error) {
            console.log(error);
            toast.error("Error publishing the cause list.", { theme: "colored" });
        } finally {
            setLoading(false);
        }
    };

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(cases);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setCases(reorderedItems);
    };

    return (
        <div className="row">
            <div className="col-md-12">
                <ol className="breadcrumb mt-2">
                    <li className="breadcrumb-item"><a href="javascript:void(0)">Home</a></li>
                    <li className="breadcrumb-item"><a href="javascript:void(0)">Dashboard</a></li>
                    <li className="breadcrumb-item active">Publish Casue List</li>
                </ol>
                <div className="card card-outline card-primary" style={{ height: "75vh" }}>
                    <ToastContainer />
                    {loading && <Loading />}
                    <div className="card-header">
                        <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>{t('post_cause_list')}</strong></h3>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4 offset-md-4">
                                <div className="form-group row">
                                    <div className="col-md-8 input-group date-input">
                                        <input
                                            type="date"
                                            name="publish_date"
                                            className={`form-control publish-date-date-picker ${errors.publish_date ? 'is-invalid' : ''}`}
                                            value={cases.publish_date || ""}
                                            onChange={(e) => setCases({ ...cases, [e.target.name]: e.target.value })}
                                            placeholder={t('Select Date')}
                                            style={{
                                                backgroundColor: 'transparent',
                                                border: '1px solid #ccc',
                                                padding: '8px',
                                            }}
                                        />
                                        {/* <div className="input-group-append">
                                            <span className="input-group-text">
                                                <FaCalendarAlt />
                                            </span>
                                        </div> */}
                                    </div>
                                    <div className="col-md-2">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSearch}
                                        >
                                            {t('search')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {Array.isArray(cases) && cases.length > 0 && (
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                                <Droppable droppableId="cases">
                                    {(provided) => (
                                        <ul {...provided.droppableProps} ref={provided.innerRef} className="cause-list">
                                            {cases.map((c, index) => (
                                                <Draggable key={index} draggableId={index.toString()} index={index}>
                                                    {(provided) => (
                                                        <li
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <div className="cause-list-items">
                                                                <Link to="/court/case/scrutiny/detail/" state={{ efile_no: c.petition.efile_number }}>
                                                                    <strong>{c.petition.efile_number}</strong>
                                                                </Link>
                                                                <div>
                                                                    {c.litigants.filter((l) => parseInt(l.litigant_type) === 1).map((l, index) => (
                                                                        <span key={index}>{index + 1}. {l.litigant_name}</span>
                                                                    ))}
                                                                    <span className="text-danger mx-2">Vs</span>
                                                                    {c.litigants.filter((l) => parseInt(l.litigant_type) === 2).map((l, index) => (
                                                                        <span key={index}>
                                                                            {index + 1}. {l.litigant_name} {language === 'ta' ? l.designation?.designation_lname : l.designation?.designation_name}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </li>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                            <div className="form-group row mx-1 mt-2">
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={handlePublish}
                                                >
                                                    Publish Causelist
                                                </Button>
                                            </div>
                                        </ul>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublishCasueList;
