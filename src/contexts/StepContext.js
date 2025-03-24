
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

    const updateStep = async(efile_no, step) => {
        try{
            const response = await api.post(`case/step-status/`, {efile_no, step})
            if(response.status === 200){
                setCurrentStep(response.data.step)
            }
        }catch(error){
            console.log(error)
        }
    }

    const contextValue = useMemo(()=>({currentStep,setCurrentStep, updateStep}), [currentStep])

    return (
        <StepContext.Provider value={contextValue}>
            {children}
        </StepContext.Provider>
    )
}
