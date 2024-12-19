import api from 'api'
import { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import Modal from 'react-bootstrap/Modal'
import ViewSurety from './ViewSurety'
import Button from '@mui/material/Button'

const SuretyDetails = () => {

    const { t } = useTranslation()
    const [sureties, setSureties] = useState([])
    const [surety, setSurety] = useState([])
    const [selectedSurety, setSelectedSurety] = useState([])  
    const [showModal, setShowModal] = useState(false);

    const handleShow = (surety) => {
        setSurety(surety);  
        setShowModal(true); 
    };
    
    const handleClose = () => {
        setShowModal(false);  
    };

    useEffect(() => {
        const efile_no = sessionStorage.getItem("efile_no")
        const fetchSureties = async () => {
            try {
                const response = await api.get("case/surety/list/", { params: { efile_no } })
                if (response.status === 200) {
                    setSureties(response.data)
                }
            } catch (error) {
                console.error(error)
                if (error.response) {
                    toast.error(error.response.message, {
                        theme: "colored"
                    })
                }
            }
        }
        fetchSureties()
    }, [])

    const isSuretySelected = (surety) => selectedSurety.includes(surety.surety_id);
    
    const handleSuretyCheckBoxChange = (surety) => {
        const isSelected = isSuretySelected(surety);
        if (isSelected) {
          setSelectedSurety(selectedSurety.filter(id => id !== surety.surety_id));
        } else {
          setSelectedSurety([...selectedSurety, surety.surety_id]);
        }
      };

    
    const handleSubmit = async () => {
       
        const validSelectedSurety = selectedSurety.filter(id => id !== null && id !== undefined);

        if (validSelectedSurety.length === 0) {
            alert("Please select at least one valid surety");
            return;
        }

        const post_data = {
            sureties: validSelectedSurety
        };

       

        try {
           const response = await api.post("case/surety/create/", post_data);

            if (response.status === 201) {
                resetPage();
                setSelectedSurety([]);
                                
                sessionStorage.setItem("efile_no", response.data.efile_number);
                
                toast.success(`${response.data.efile_number} details submitted successfully`, {
                    theme: "colored",
                });
            }
        } catch (error) {
            toast.error("Error submitting the data. Please try again.", {
                theme: "colored",
            });
            console.error(error);
        }
    };
    const resetPage = () => {
        setSelectedSurety([]);
    };

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
                    <ViewSurety surety={surety} />
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
                    {sureties.map((s, index) => (
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

            <div className="col-md-12 d-flex justify-content-center mt-2">
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleSubmit}
                >
                    {t('submit')}
                </Button>
            </div>
        </div>
    )
}

export default SuretyDetails;
