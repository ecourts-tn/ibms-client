
import React, {useState, useEffect, createContext, useMemo} from 'react'
import api from 'api'

export const StepContext = createContext()

export const StepProvider = ({children}) => {
    const[currentStep, setCurrentStep] = useState(1)

    useEffect(() => {
        const efile_no = sessionStorage.getItem("efile_no")
        const getCurrentType = async() => {
            try{
                const response = await api.get("case/step-status/", {params:{efile_no}})
                if(response.status === 200){
                    setCurrentStep(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        if(efile_no){
            getCurrentType();
        }
    },[])

    const contextValue = useMemo(()=>({currentStep,setCurrentStep}), [currentStep])

    return (
        <StepContext.Provider value={contextValue}>
            {children}
        </StepContext.Provider>
    )
}
