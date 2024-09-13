import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bs-stepper/dist/css/bs-stepper.min.css';
import Stepper from 'bs-stepper';
import { FormProvider } from '../../../hooks/FormProvider';
import { Step1, Step2, Step3 } from './Steps';

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const stepperRef = useRef(null);

  useEffect(() => {
    const initializeStepper = () => {
      const stepperElement = document.querySelector('#stepper1');
      if (stepperElement) {
        stepperRef.current = new Stepper(stepperElement, {
          linear: false,
          animation: true,
        });
      }
    };

    initializeStepper();
  }, []);

  const steps = [
    <Step1 nextStep={() => setCurrentStep(1)} />,
    <Step2 nextStep={() => setCurrentStep(2)} prevStep={() => setCurrentStep(0)} />,
    <Step3 prevStep={() => setCurrentStep(1)} />,
  ];

  return (
    <FormProvider>
      <div className="container-fluid px-md-5">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body p-1">
                <div id="stepper1" className="bs-stepper">
                  <div className="bs-stepper-header mb-3" style={{ backgroundColor: '#ebf5fb' }}>
                    <div className="step" data-target="#initial-input">
                      <button className="step-trigger">
                        <span className="bs-stepper-circle">1</span>
                        <span className="bs-stepper-label">Initial Input</span>
                      </button>
                    </div>
                    <div className="line"></div>
                    <div className="step" data-target="#litigants">
                      <button className="step-trigger">
                        <span className="bs-stepper-circle">2</span>
                        <span className="bs-stepper-label">Litigants</span>
                      </button>
                    </div>
                    <div className="line"></div>
                    <div className="step" data-target="#ground">
                      <button className="step-trigger">
                        <span className="bs-stepper-circle">3</span>
                        <span className="bs-stepper-label">Ground</span>
                      </button>
                    </div>
                  </div>
                  <div className="bs-stepper-content">
                    {steps[currentStep]}
                    <div id="initial-input" className='content'>
                        <Step1 nextStep={() => setCurrentStep(1)} />
                    </div>
                    <div id="litigants" className='content'>
                        <Step2 nextStep={() => setCurrentStep(2)} prevStep={() => setCurrentStep(0)} />
                    </div>
                    <div id="ground" className='content'>
                        <Step3 prevStep={() => setCurrentStep(1)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default MultiStepForm;
