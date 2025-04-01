import React, {useState, useContext, useEffect} from 'react'
import {CreateMarkup} from 'utils'
import Modal from 'react-bootstrap/Modal'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import api from 'api'
import { BaseContext } from 'contexts/BaseContext'


const FIRDetails = ({setFirTagged}) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const {efileNumber, clearEfileNumber} = useContext(BaseContext)
    const [fir, setFir] = useState({})
    const [accused, setAccused] = useState([])
    const {t} = useTranslation()

    useEffect(() => { 
        const fetchFIR = async () => {
            const api_id = sessionStorage.getItem("api_id")
            try {
                const response = await api.post("external/police/fir-detail/", { id: api_id });
                if (response.status === 200) {
                    const data = response.data
                    setFir({
                    ...fir,
                    act: data?.act || "",
                    section: data?.section || [],
                    date_of_occurrence: data?.date_of_occurrence || "",
                    investigation_officer: data?.investigation_officer_name || "",
                    fir_date_time: data?.fir_date_time || "",
                    place_of_occurrence: data?.place_of_occurrence || "",
                    gist_of_fir: data?.gist_of_fir || "",
                    gist_in_local: data?.gist_of_fir_in_local || "",
                    complainant_age: data?.complainant_age || "",
                    complainant_guardian: data?.complainant_guardian || "",
                    complainant_guardian_name: data?.complainant_guardian_name || "",
                    complainant_name: data?.complainant_name || "",
                    investigation_officer_rank: data?.investigation_officer_rank || "",
                    no_of_accused: data?.no_of_accused || 0,
                    sencitive_case: data?.sensitive_case || false
                });
                setAccused(response.data?.accused || []);
                }
            } catch (error) {
                console.error("Error fetching FIR details:", error);
            }
        };
    
        fetchFIR();
    }, []);


    const tagFir = async() => {
        try{
            const data = {
                efile_no: efileNumber,
                fir : sessionStorage.getItem("api_id")
            }
            const response = await api.put(`case/filing/update/`, data)
            if(response.status === 200){
                handleClose();
                clearEfileNumber()
                sessionStorage.removeItem("api_id")
                setFirTagged(true)
            }
        }catch(error){
            console.log(error)
        }
    }

    return (
        <>
            <Button
                variant="contained"
                color="warning"
                onClick={handleShow}
                className="ml-2"
            >   
                <i className="fa fa-paper-plane mr-2"></i>
                {t('view_fir')}
            </Button>
            <div className="row">
                <div className="col-md-12 d-flex justify-content-center">
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
                                            { fir.sencitive_case && (
                                               <tr>
                                                    <td colSpan={4} className='text-center bg-danger'>
                                                        <span className='sensitive-case'>Sensitive Case</span>
                                                    </td>
                                               </tr> 
                                            )}
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
                                                    { fir.gist_of_fir }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={4}>
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
                            <Modal.Footer className="d-flex justify-content-between">
                                <Button variant="contained" color="success" onClick={() => tagFir()}>Tag FIR </Button>
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