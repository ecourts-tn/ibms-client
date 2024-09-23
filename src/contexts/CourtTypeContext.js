import React, {useState, useEffect, createContext, useMemo} from 'react'
import api from 'api'

export const CourtTypeContext = createContext()

export const CourtTypeProvider = ({children}) => {
    const[courttypes, setCourtTypes] = useState([])

    useEffect(() => {
        const fetchCourtTypes = async() => {
            try{
                const response = await api.get("base/court-type/")
                if(response.status === 200){
                    setCourtTypes(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchCourtTypes();
    },[])

    const contextValue = useMemo(()=>({courttypes, setCourtTypes}), [courttypes])

    return (
        <CourtTypeContext.Provider value={contextValue}>
            {children}
        </CourtTypeContext.Provider>
    )
}