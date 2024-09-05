import React, { useEffect, useRef } from 'react';
import Stepper from 'bs-stepper'; // Ensure bs-stepper is imported
import { useNavigate, useLocation, Routes, Route, Link } from 'react-router-dom';
import BasicContainer from './basic/BasicContainer'; // Replace with your actual components for each step

const Steps = () => {
  const stepperRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const headers = [
    { title: 'Initial Input', url: '/bail/initial-input', completed: true },
    { title: 'Litigant', url: '/bail/litigant', completed: true },
    { title: 'Grounds', url: '/bail/ground', active: true },
    { title: 'Previous Case Details', url: '/bail/previous-details' },
    { title: 'Advocate Details', url: '/bail/advocate' },
    { title: 'Documents', url: '/bail/documents' },
    { title: 'Payment', url: '/bail/payment' },
    { title: 'E-File', url: '/bail/efile' }
  ];

  // Initialize the stepper instance in useEffect
  useEffect(() => {
    // Delay stepper initialization until DOM content is available
    if (stepperRef.current === null) {
      const stepperEl = document.querySelector('#stepper1');
      if (stepperEl) {
        stepperRef.current = new Stepper(stepperEl, {
          linear: false, // Allows skipping steps
          animation: true
        });
      }
    }

    const activeStep = headers.findIndex(header => header.url === location.pathname);
    if (stepperRef.current && activeStep >= 0) {
      stepperRef.current.to(activeStep + 1); // Go to the active step
    }
  }, [location, headers]);

  const handleNext = () => {
    const currentStep = headers.findIndex(header => header.url === location.pathname);
    if (currentStep < headers.length - 1) {
      navigate(headers[currentStep + 1].url);
    }
  };

  return (
    <div id="stepper1" className="bs-stepper">
      <div className="bs-stepper-header mb-3">
        {headers.map((item, index) => {
          const isActive = location.pathname === item.url;
          return (
            <React.Fragment key={index}>
              <div className="step" data-target={`#step-${index + 1}`}>
                <Link to={item.url}>
                  <button className="step-trigger">
                    <span
                      className="bs-stepper-circle"
                      style={{
                        backgroundColor: item.completed ? 'green' : isActive ? 'blue' : '',
                        color: isActive ? 'white' : ''
                      }}>
                      {index + 1}
                    </span>
                    <span
                      className="bs-stepper-label"
                      style={{
                        color: item.completed ? 'green' : isActive ? 'blue' : ''
                      }}>
                      {item.title}
                    </span>
                  </button>
                </Link>
              </div>
              {index !== headers.length - 1 && <div className="line"></div>}
            </React.Fragment>
          );
        })}
      </div>

      <div className="bs-stepper-content">
        <Routes>
          <Route path="/bail/initial-input" element={<div id="step-1"><BasicContainer /></div>} />
          <Route path="/bail/litigant" element={<div id="step-2"><BasicContainer /></div>} />
          <Route path="/bail/ground" element={<div id="step-3"><BasicContainer /></div>} />
          <Route path="/bail/previous-details" element={<div id="step-4"><BasicContainer /></div>} />
          <Route path="/bail/advocate" element={<div id="step-5"><BasicContainer /></div>} />
          <Route path="/bail/documents" element={<div id="step-6"><BasicContainer /></div>} />
          <Route path="/bail/payment" element={<div id="step-7"><BasicContainer /></div>} />
          <Route path="/bail/efile" element={<div id="step-8"><BasicContainer /></div>} />
        </Routes>

        <button
          className="btn btn-primary float-right"
          type="button"
          onClick={handleNext}>
          <i className="fa fa-arrow-right mr-2"></i>Next
        </button>
      </div>
    </div>
  );
};

export default Steps;
