import api from 'api'
import config from 'config'
import React, {useState, useEffect} from 'react'
import {toast, ToastContainer} from 'react-toastify'
import { useTranslation } from 'react-i18next'
import Modal from 'react-bootstrap/Modal'
import ViewSurety from './ViewSurety'
import Button from 'react-bootstrap/Button'

const SuretyDetails = () => {

    const {t} = useTranslation()
    const [sureties, setSureties] = useState([])
    const [surety, setSurety] = useState(null)
    const [selectedSurety, setSelectedSurety] = useState([])
    const [showModal, setShowModal] = useState(false);

    const handleShow = (surety) => {
        setSurety(surety);  // Set selected surety details
        setShowModal(true);         // Show the modal
    };
    
    const handleClose = () => {
        setShowModal(false);        // Close the modal
    };

    useEffect(() => {
        const efile_no = sessionStorage.getItem("efile_no")
        const fetchSureties = async() => {
            try{
                const response = await api.get("case/surety/list/", {params:{efile_no}})
                if(response.status === 200){
                    setSureties(response.data)
                }
              }catch(error){
                console.error(error)
                if(error.response){
                    toast.error(error.response.message, {
                        theme:"colored"
                    })
                }
            }

        }
        fetchSureties()
    }, [])

    const handleSuretyCheckBoxChange = (surety) => {
        if (selectedSurety.includes(surety)) {
          // If already selected, remove the surety from the selected list
          setSelectedSurety(selectedSurety.filter(selected => selected.litigant_id !== surety.litigant_id));
        } else {
          // Otherwise, add the surety to the selected list
          setSelectedSurety([...selectedSurety, {
            litigant_name :surety.litigant_name,
            litigant_type :1, 
            rank: surety.rank,
            gender: surety.gender,
            act: surety.act,
            section: surety.section,
            relation: surety.relation,
            relation_name: surety.relation_name,
            age: surety.age,
            address: surety.address,
            mobile_number: surety.mobile_number,
            email_address: surety.email_address,
            nationality: surety.nationality,
          }]);
        }
    };
    const isSuretySelected = (surety) => selectedSurety.some(selected => selected.surety_name === surety.surety_name);

    return (
        <div className="container">
            <ToastContainer /> 
            <Modal 
                show={showModal} 
                onHide={handleClose} 
                backdrop="static"
                keyboard={false}
                size="xl"
            >
                <Modal.Header closeButton>
                    <Modal.Title><strong>{t('surety_details')}</strong></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ViewSurety surety={surety}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="contained" color="primary" onClick={handleClose}>
                    {t('close')}
                    </Button>
                </Modal.Footer>
            </Modal>
                <table className="table table-bordered">
                    <thead>
                        <tr className="bg-navy">
                            <td colSpan={9}><strong>{t('surety_details')}</strong></td>
                        </tr>
                        <tr>
                            <th>{t('select')}</th>
                            <th>{t('surety_name')}</th>
                            <th>{t('father_husband_guardian')}</th>
                            <th>{t('aadhar_number')}</th>
                            <th>{t('mobile_number')}</th>
                            <th>{t('action')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        { sureties.map((s, index) => (
                        <tr key={index}>
                            <td>
                                <div className="icheck-success">
                                    <input 
                                        type="checkbox" 
                                        id={`checkboxSuccess${s.surety_id}`} 
                                        checked={isSuretySelected(s)}
                                        onChange={() => handleSuretyCheckBoxChange(s)}
                                    />
                                    <label htmlFor={`checkboxSuccess${s.surety_id}`}></label>
                                </div>                                                                            
                            </td>
                            <td>{s.surety_name}</td>
                            <td>{s.relative_name}</td>
                            <td>{s.aadhar_number}</td>
                            <td>{s.mobile_number}</td>
                            <td>
                                <span className="badge badge-info badge-pill" onClick={() => handleShow(s)}>View</span>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
        </div> 
    )
}

export default SuretyDetails