import api from 'api';
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from '@mui/material/Button';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EFileDetails from 'components/filing/efile/EFileDetails';
import { ModelClose } from 'utils';
import 'components/layout/public/header.css'


const EFile = () => {
  const navigate = useNavigate();
  const[errors, setErrors] = useState([])
  const[show, setShow] = useState(false);
  const[showError, setShowError] = useState(false)
  const handleErrorClose = () => setShowError(false);
  const { t } = useTranslation();
  const [checkboxStates, setCheckboxStates] = useState([
    { id: 1, checked: false, label: 'I solemnly state that the contents provided by me are true to the best of my knowledge and belief. And that conceals nothing and that no part of it is false.' },
    { id: 2, checked: false, label: 'I have signed the form by means of an electronic signature.' },
    { id: 3, checked: false, label: 'I have signed the form by means of an electronic signature.' },
    { id: 4, checked: false, label: 'I solemnly state that the contents provided by me are true to the best of my knowledge and belief. And that conceals nothing and that no part of it is false.' },
    { id: 5, checked: false, label: 'I have signed the form by means of an electronic signature.' },
    // Add more checkboxes dynamically here
  ]);

  //   const handleClose = () => setShow(false);
  const handleClose = () => {
      console.log("Modal is being closed");
      setShow(false);
  };
  const handleShow = () => setShow(true);

  // Check if all checkboxes are checked
  const areAllChecked = checkboxStates.every((checkbox) => checkbox.checked);

  const handleCheckboxChange = (id) => {
    setCheckboxStates((prev) =>
      prev.map((checkbox) =>
        checkbox.id === id ? { ...checkbox, checked: !checkbox.checked } : checkbox
      )
    );
  };

const handleSubmit = async () => {
    const efile_no = sessionStorage.getItem("efile_no");
    if (efile_no) {
      try {
        const response = await api.post("case/filing/final-submit/", { efile_no });
        if (response.status === 200) {
          try {
            const result = await api.put(`case/filing/final-submit/`, {efile_no});
            if (result.status === 200) {
              toast.success("Petition filed successfully", { theme: "colored" });
            }
            sessionStorage.removeItem("efile_no");
            setTimeout(() => {
              navigate("/filing/dashboard");
            }, 500)
          } catch (error) {
            console.error(error);
          }
        }
      }catch (error) {
        if(error.response?.status === 400){
          setShowError(true)
          setErrors(error.response?.data.messages)
        }
      }
    }
  };
  
  return (
    <>
      <ToastContainer />
        <Modal 
          show={showError} 
          onHide={handleErrorClose} 
          backdrop="static"
          keyboard={false}
          size="xl"
        >
          <Modal.Header >
              <Modal.Title><strong>Unable to submit the application</strong></Modal.Title>
              <ModelClose handleClose={handleErrorClose}/>
          </Modal.Header>
          <Modal.Body>
              <ul className='error'>
                { errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
          </Modal.Body>
          <Modal.Footer>
              <Button variant="contained" onClick={handleErrorClose}>
                  {t('close')}
              </Button>
          </Modal.Footer>
        </Modal>
      <div className="row mt-5">
        <div className="col-md-6 offset-3">
          {/* Dynamically render checkboxes */}
          {checkboxStates.map((checkbox) => (
            <div key={checkbox.id} className="mt-3">
              <input
                type="checkbox"
                id={`checkbox-${checkbox.id}`}
                checked={checkbox.checked}
                onChange={() => handleCheckboxChange(checkbox.id)}
              />{' '}
              {t(checkbox.label)}
            </div>
          ))}
        </div>
        <div className="col-md-6 offset-3 text-center mt-5">
          <Button
            variant="contained"
            color="warning"
            onClick={handleShow}
            disabled={!areAllChecked}
          >
            <i className="fa fa-paper-plane mr-2"></i>
            { t('view_draft')}
          </Button>
          <Button
            variant="contained"
            color="success"
            className="ml-2"
            onClick={handleSubmit}
            disabled={!areAllChecked}
          >
            <i className="fa fa-paper-plane mr-2"></i>
            {t('submit')}
          </Button>
        </div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <Modal.Header>
          <Modal.Title>
            <strong>{t('draft_application')}</strong>
          </Modal.Title>
          <ModelClose handleClose={handleClose} />
        </Modal.Header>
        <Modal.Body>
          <EFileDetails />
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: 'end'}}>
          <Button variant="contained" onClick={handleClose}>
            {t('close')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EFile;
