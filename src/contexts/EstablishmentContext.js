import React, {useState, useEffect, createContext, useMemo} from 'react'
import api from 'api'

export const EstablishmentContext = createContext()

export const EstablishmentProvider = ({children}) => {
    const[establishments, setEstablishments] = useState([])

    useEffect(() => {
        const fetchEstablishments = async() => {
            try{
                const response = await api.get("base/establishment/")
                if(response.status === 200){
                    setEstablishments(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchEstablishments();
    },[])

    const contextValue = useMemo(() => ({establishments, setEstablishments}), [establishments])

    return (
        <EstablishmentContext.Provider value={contextValue}>
            {children}
        </EstablishmentContext.Provider>
    )
}