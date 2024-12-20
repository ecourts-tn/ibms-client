import api from 'api';
import { LanguageContext } from 'contexts/LanguageContex';
import { Link } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import 'components/court/style.css'
import Loading from 'components/Loading';
import Button from '@mui/material/Button'
import { toast, ToastContainer } from 'react-toastify';

const PublishCasueList = () => {
    const { t } = useTranslation();
    const {language} = useContext(LanguageContext)
    const [loading, setLoading] = useState(false)
    const [cases, setCases] = useState([]);
    const [hearingDate, setHearingDate] = useState('')

    const handleSearch = async() => {
        try {
            setLoading(true)
            const response = await api.get("court/cause-list/", {params:{hearing_date: hearingDate}});
            setCases(response.data);
        } catch (err) {
            console.log(err);
        }finally{
            setLoading(false)
        }
    }

    const handlePublish = async() => {
        const selectedFields = cases.map((c, index ) => ({
            efile_number: c.petition.efile_number,
            date_next_list: c.petition.date_next_list,
            item_no:index+1
          }));
        try{
            setLoading(true)
            const response = await api.put(`court/cause-list/publish/`, selectedFields)
            if(response.status === 200){
                toast.success("Cause list published successfully", {theme:"colored"})
            }
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false)
        }
    }


    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(cases);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setCases(reorderedItems);
    };

    return (
        <div className="content-wrapper">
            <ToastContainer />
            { loading && <Loading />}
            <div className="container-fluid mt-3">
                <div className="card card-outline card-primary">
                    <div className="card-header">
                        <h3 className="card-title"><i className="fas fa-edit mr-2"></i><strong>{t('post_cause_list')}</strong></h3>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4 offset-md-4">
                                <div className="form-group row">
                                    <div className="col-md-8">
                                        <input 
                                            type="date"
                                            name={hearingDate}
                                            className="form-control" 
                                            onChange={(e) => setHearingDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="cos-md-2">
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
                        { Object.keys(cases).length > 0 && (
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
                                                                <Link to="/court/case/scrutiny/detail/" state={{efile_no:c.petition.efile_number}}><strong>{ c.petition.efile_number }</strong></Link>
                                                                <div>
                                                                    { c.litigants.filter((l) => parseInt(l.litigant_type) ===1 ).map((l, index) => (
                                                                        <span key={index}>{index+1}. {l.litigant_name}</span>
                                                                    ))
                                                                    }
                                                                    <span className="text-danger mx-2">Vs</span>
                                                                    { c.litigants.filter((l) => parseInt(l.litigant_type) ===2 ).map((l, index) => (
                                                                        <span key={index}>
                                                                            {index+1}. {l.litigant_name} { language === 'ta' ? l.designation?.designation_lname : l.designation?.designation_name }
                                                                        </span>
                                                                    ))
                                                                    }
                                                                </div>
                                                            </div>
                                                        </li>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                            <div className="form-group row mx-1 mt-2">
                                                <Button
                                                    variant='contained'
                                                    color='success'
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
