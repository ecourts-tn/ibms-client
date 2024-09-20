import React, {useState, useEffect, createContext} from 'react'
import api from 'api'

export const PrisonContext = createContext()

export const PrisonProvider = ({children}) => {
    const[prisons, setPrisons] = useState([])

    useEffect(() => {
        const fetchPrisons = async() => {
            try{
                const response = await api.get("base/prison/")
                if(response.status === 200){
                    setPrisons(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchPrisons();
    },[])

    return (
        <PrisonContext.Provider value={{prisons, setPrisons}}>
            {children}
        </PrisonContext.Provider>
    )
}