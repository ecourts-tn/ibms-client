import api from 'api';
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from '@mui/material/Button';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EFileDetails from 'components/filing/efile/EFileDetails';

const EFile = () => {
  const navigate = useNavigate();
  const [isFinalSubmit, setIsFinalSubmit] = useState(false);
  const [show, setShow] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState([
    { id: 1, checked: false, label: 'I solemnly state that the contents provided by me are true to the best of my knowledge and belief. And that conceals nothing and that no part of it is false.' },
    { id: 2, checked: false, label: 'I have signed the form by means of an electronic signature.' },
    { id: 3, checked: false, label: 'I have signed the form by means of an electronic signature.' },
    { id: 4, checked: false, label: 'I solemnly state that the contents provided by me are true to the best of my knowledge and belief. And that conceals nothing and that no part of it is false.' },
    { id: 5, checked: false, label: 'I have signed the form by means of an electronic signature.' },
    // Add more checkboxes dynamically here
  ]);
  const [isConfirm, setIsConfirm] = useState(false);
  const { t } = useTranslation();

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

//   const handleSubmit = async () => {
//     const efile_no = sessionStorage.getItem('efile_no');
//     if (efile_no) {
//       try {
//         const response = await api.post('case/filing/final-submit/', { efile_no });
//         if (response.status === 200) {
//           if (response.data.error) {
//             response.data.message.forEach((error) => {
//               toast.error(error, {
//                 theme: 'colored',
//               });
//             });
//             setIsFinalSubmit(false);
//           } else {
//             try {
//               const result = await api.put(`case/filing/${efile_no}/final-submit/`);
//               if (result.status === 200) {
//                 toast.success('Petition filed successfully', {
//                   theme: 'colored',
//                 });
//               }
//               sessionStorage.removeItem('efile_no');
//               navigate('/filing/dashboard');
//             } catch (error) {
//               console.error(error);
//             }
//           }
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   };

const handleSubmit = async () => {
    const efile_no = sessionStorage.getItem("efile_no");
    if (efile_no) {
      try {
        const response = await api.post("case/filing/final-submit/", { efile_no });
        if (response.status === 200) {
          if (response.data.error) {
            response.data.message.forEach((error) => {
              toast.error(error, { theme: "colored" });
            });
            setIsFinalSubmit(false);
          } else {
            try {
              const result = await api.put(`case/filing/${efile_no}/final-submit/`);
              if (result.status === 200) {
                toast.success("Petition filed successfully", { theme: "colored" });
              }
              sessionStorage.removeItem("efile_no");
              navigate("/filing/dashboard");
            } catch (error) {
              console.error(error);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  

  return (
    <>
      <ToastContainer />
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
        <Modal.Header closeButton>
          <Modal.Title>
            <strong>{t('draft_application')}</strong>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EFileDetails />
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          {/* <div>
            <input
              type="checkbox"
              checked={isConfirm}
              onChange={(e) => setIsConfirm(!isConfirm)}
            />{' '}
            <span style={{ color: '#D93900', paddingLeft: '2px' }}>
              <strong>{t('confirmation')}</strong>
            </span>
          </div> */}
          <div>
            {/* {isConfirm && (
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  setIsFinalSubmit(!isFinalSubmit);
                  handleClose();
                }}
              >
                {t('submit')}
              </Button>
            )} */}
          </div>
          <div>
            <Button variant="contained" onClick={handleClose}>
              {t('close')}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EFile;
