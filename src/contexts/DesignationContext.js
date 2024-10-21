import React, {useState, useEffect, createContext, useMemo} from 'react'
import api from 'api'

export const DesignationContext = createContext()

export const DesignationProvider = ({children}) => {
    const[designations, setDesignations] = useState([])

    useEffect(() => {
        const fetchDesignations = async() => {
            try{
                const response = await api.get("base/designation/")
                if(response.status === 200){
                    setDesignations(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchDesignations();
    },[])

    const contextValue = useMemo(() => ({designations, setDesignations}), [designations])

    return (
        <DesignationContext.Provider value={contextValue}>
            {children}
        </DesignationContext.Provider>
    )
}