import React, {useState, useEffect, createContext} from 'react'
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

    return (
        <EstablishmentContext.Provider value={{establishments, setEstablishments}}>
            {children}
        </EstablishmentContext.Provider>
    )
}