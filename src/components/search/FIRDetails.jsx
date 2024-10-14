import React, {useState, useContext} from 'react'
import {CreateMarkup} from '../../utils'
import Modal from 'react-bootstrap/Modal'
import Button from '@mui/material/Button'
import { BaseContext } from '../../contexts/BaseContext'
import { useTranslation } from 'react-i18next'


const FIRDetails = () => {
    const {fir, accused} = useContext(BaseContext)
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const {t} = useTranslation()

    return (
        <>
            <div className="row mb-5">
                <div className="col-md-12 d-flex justify-content-center">
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={handleShow}
                    >   
                        <i className="fa fa-paper-plane mr-2"></i>
                        {t('view_fir')}
                    </Button>
                    <Modal 
                            show={show} 
                            onHide={handleClose} 
                            backdrop="static"
                            keyboard={false}
                            size="xl"
                        >
                            <Modal.Header>
                                <Modal.Title><strong>{t('fir_details')}</strong></Modal.Title>
                                <button 
                                    type="button" 
                                    class="close" 
                                    data-dismiss="modal"
                                    onClick={handleClose}
                                >&times;</button>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="row">
                                    <div className="col-md-12">
                                        <table className="table table-bordered table-striped table-sm">
                                            <tr>
                                                <td>{t('date_of_occurence')}</td>
                                                <td>{ fir.date_of_occurrence }</td>
                                                <td>{t('fir_date_time')}</td>
                                                <td>{ fir.fir_date_time }</td>
                                            </tr>
                                            <tr>
                                                <td>{t('place_of_occurence')}</td>
                                                <td colSpan={3}>{ fir.place_of_occurrence }</td>
                                            </tr>
                                            <tr>
                                                <td>{t('investigation_officer')}</td>
                                                <td>{ fir.investigation_officer }</td>
                                                <td>{t('investigation_officer_rank')}</td>
                                                <td>{ fir.investigation_officer_rank }</td>
                                            </tr>
                                            <tr>
                                                <td>{t('complaintant_name')}</td>
                                                <td>{ fir.complainant_name }</td>
                                                <td>{t('complaintant_age')}</td>
                                                <td>{ fir.complainant_age }</td>
                                            </tr>
                                            <tr>
                                                <td>{t('complaintant_guardian')}</td>
                                                <td>{ fir.complainant_guardian }</td>
                                                <td>{t('complaintant_guardian_name')}</td>
                                                <td>{ fir.complainant_guardian_name }</td>
                                            </tr>
                                            <tr>
                                                <td colSpan={4}>
                                                    <p><strong>{t('gist_of_fir')}</strong></p>
                                                    <span dangerouslySetInnerHTML={CreateMarkup(fir.gist_of_fir)}></span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={4} width="500">
                                                    <p><strong>{t('gist_in_local')}</strong></p>
                                                    <span dangerouslySetInnerHTML={CreateMarkup(fir.gist_in_local)}></span>
                                                </td>
                                            </tr>
                                        </table>
                                        {accused && (
                                            <table className="table table-bordered table-striped table-sm">
                                                <thead>
                                                    <tr className="bg-navy">
                                                        <th>#</th>
                                                        <th>{t('accused_name')}</th>
                                                        <th>{t('age')}</th>
                                                        <th>{t('accused_rank')}</th>
                                                        <th>{t('gender')}</th>
                                                        <th>{t('guardian_name')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {accused.map((a, index) => (
                                                    <tr>
                                                        <td>{ index+1 }</td>
                                                        <td>{a.name_of_accused}</td>
                                                        <td>{a.age}</td>
                                                        <td>{a.Rank_of_accused}</td>
                                                        <td>{a.gender}</td>
                                                        <td>{a.accused_guardian_name}</td>
                                                    </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer style={{ justifyContent: "end", alignItems:"center"}}>
                                <Button variant="contained" onClick={handleClose}>
                                    {t('close')}
                                </Button>
                            </Modal.Footer>
                    </Modal>
                </div>
            </div>    
        </>
    )
}

export default FIRDetails