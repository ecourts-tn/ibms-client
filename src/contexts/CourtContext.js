import React, {useState, useEffect, createContext, useMemo} from 'react'
import api from 'api'

export const CourtContext = createContext()

export const CourtProvider = ({children}) => {
    const[courts, setCourts] = useState([])

    useEffect(() => {
        const fetchCourts = async() => {
            try{
                const response = await api.get("base/court/")
                if(response.status === 200){
                    setCourts(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchCourts();
    },[])

    const contextValue = useMemo(() => ({courts, setCourts}), [courts])

    return (
        <CourtContext.Provider value={contextValue}>
            {children}
        </CourtContext.Provider>
    )
}