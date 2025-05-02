import React, { useState, useEffect, createContext, useMemo, useContext, useRef } from 'react';
import api from 'api';
import { BaseContext } from './BaseContext';

export const StepContext = createContext();

export const StepProvider = ({ children }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState([]);
    const { efileNumber } = useContext(BaseContext);

 
    useEffect(() => {
        const getCurrentStepStatus = async () => {
          try {
            const response = await api.get("case/step-status/", {
              params: { efile_no: efileNumber }
            });
            if (response.status === 200) {
              setCurrentStep(response.data.current_step);
              setCompletedSteps(response.data.completed_steps || []);
            }
          } catch (error) {
            console.error(error);
          }
        };
      
        if (efileNumber) getCurrentStepStatus();
      }, [efileNumber]);
      
      
  
   // ✅ New method to trigger POST manually
   const saveStepStatus = async () => {
    if (!efileNumber) return;

    try {
        const newCompletedSteps = Array.from(new Set([
            ...completedSteps,
            currentStep - 1
        ])).filter(step => step > 0);

        const response = await api.post("case/step-status/", {
            efile_no: efileNumber,
            active_step: currentStep,
            completed_steps: newCompletedSteps
        });

        if (response.status === 200) {
            setCompletedSteps(response.data.completed_steps || []);
        }
    } catch (error) {
        console.log(error);
    }
};
      

  
    const contextValue = useMemo(() => ({
      currentStep,
      completedSteps,
      setCurrentStep,
      saveStepStatus
    }), [currentStep, completedSteps]);
  
    return (
      <StepContext.Provider value={contextValue}>
        {children}
      </StepContext.Provider>
    );
  };
  
