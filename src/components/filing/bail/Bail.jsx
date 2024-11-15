import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, Navigate } from 'react-router-dom';
import { Stepper, Step } from 'react-form-stepper';

// Define step labels
const steps = [
  { label: 'Step 1' },
  { label: 'Step 2' },
  { label: 'Step 3' }
];

// Main component
function Bail() {
  const location = useLocation();

  // Determine current step based on the URL
  const getCurrentStep = () => {
    switch (location.pathname) {
      case '/bail/step-one':
        return 0;
      case '/bail/step-two':
        return 1;
      case '/bail/step-three':
        return 2;
      default:
        return 0;
    }
  };

  return (
    <div className="container mt-5">
      <Stepper activeStep={getCurrentStep()} steps={steps} />

      <Routes>
        {/* Redirect to step one if accessing `/bail` */}
        <Route path="/bail" element={<Navigate to="/bail/step-one" />} />
        
        {/* Step routes */}
        <Route path="/bail/step-one" element={<StepOne />} />
        <Route path="/bail/step-two" element={<StepTwo />} />
        <Route path="/bail/step-three" element={<StepThree />} />
      </Routes>
    </div>
  );
}

// Step One component
export const StepOne = () => {
  return <h1>Step One</h1>;
};

// Step Two component
export const StepTwo = () => {
  return <h1>Step Two</h1>;
};

// Step Three component
export const StepThree = () => {
  return <h1>Step Three</h1>;
};

export default Bail;
