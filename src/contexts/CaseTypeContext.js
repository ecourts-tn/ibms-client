import React, {useState, useEffect, createContext, useMemo} from 'react'
import api from 'api'

export const CaseTypeContext = createContext()

export const CaseTypeProvider = ({children}) => {
    const[casetypes, setCaseTypes] = useState([])

    useEffect(() => {
        const fetchCaseTypes = async() => {
            try{
                const response = await api.get("base/case-type/")
                if(response.status === 200){
                    setCaseTypes(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchCaseTypes();
    },[])

    const contextValue = useMemo(() => ({casetypes, setCaseTypes}), [casetypes])

    return (
        <CaseTypeContext.Provider value={contextValue}>
            {children}
        </CaseTypeContext.Provider>
    )
}