import React, {useState, useEffect, createContext} from 'react'
import api from 'api'

export const CourtTypeContext = createContext()

export const CourtTypeProvider = ({children}) => {
    const[courtTypes, setCourtTypes] = useState([])

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

    return (
        <CourtTypeContext.Provider value={{courtTypes, setCourtTypes}}>
            {children}
        </CourtTypeContext.Provider>
    )
}