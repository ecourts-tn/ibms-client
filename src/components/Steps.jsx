// import React, {useEffect, useRef} from 'react'
// import Stepper from 'bs-stepper';
// import { Link } from 'react-router-dom';
// import BasicContainer from './basic/BasicContainer';

// const Steps = () => {
//     const stepperRef = useRef(null);

//     const headers = [
//         {
//             title: 'Initial Input',
//             url: 'bail/initial-input',
//             completed:true
//         },
//         {
//             title: 'Litigant',
//             url: 'bail/litigant',
//             completed: true
//         },
//         {
//             title: 'Grounds',
//             url: 'bail/ground',
//             active:true
//         },
//         {
//             title: 'Previous Case Details',
//             url: 'bail/previous-details'
//         },
//         { 
//             title: 'Advocate Details',
//             url: 'bail/advocate'
//         },
//         {
//             title: 'Documents',
//             url: 'bail/documents'
//         },
//         {
//             title: 'Payment',
//             url: 'bail/payment'
//         },
//         {
//             title: 'E-File',
//             url: 'bail/efile'
//         }
//     ]

//     return (
//         <div id="stepper1" className="bs-stepper">
//             <div className="bs-stepper-header mb-3">
//                 { headers.map((item, index) => (
//                     <>
//                         <div className="step" data-target={`#${item.index}`}>
//                             <Link to={item.url}>
//                                 <button className="step-trigger">
//                                     <span className="bs-stepper-circle" style={{backgroundColor: item.completed  ? 'green' : item.active ? 'red': ''}}>{index+1}</span>
//                                     <span className="bs-stepper-label" style={{color: item.completed ? 'green' : item.active ? 'red': ''}}>{ item.title }</span>
//                                 </button>
//                             </Link>
//                         </div>
//                         { index !== headers.length-1 && (<div className="line"></div>)}   
//                     </>
//                 ))}
//             </div>
//             <div className="bs-stepper-content">
//                 <div id="1" className="content">
//                     <BasicContainer></BasicContainer>
//                     <button 
//                     className="btn btn-primary float-right" 
//                     type="button" 
//                     onClick={() => stepperRef.current.next()}>
//                         <i className="fa fa-arrow-right mr-2"></i>Next
//                     </button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Steps



import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    const activeStep = headers.findIndex(header => header.url === location.pathname);
    if (stepperRef.current) {
      stepperRef.current.to(activeStep + 1);
    }
  }, [location]);

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
              <div className="step" data-target={`#${index + 1}`}>
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
          <Route path="/bail/initial-input" element={<BasicContainer />} />
          <Route path="/bail/litigant" element={<BasicContainer />} />
          <Route path="/bail/ground" element={<BasicContainer />} />
          <Route path="/bail/previous-details" element={<BasicContainer />} />
          <Route path="/bail/advocate" element={<BasicContainer />} />
          <Route path="/bail/documents" element={<BasicContainer />} />
          <Route path="/bail/payment" element={<BasicContainer />} />
          <Route path="/bail/efile" element={<BasicContainer />} />
          {/* Add other routes and components as needed */}
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


