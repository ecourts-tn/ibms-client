import React, {useState, useEffect, createContext} from 'react'
import api from 'api'

export const TalukContext = createContext()

export const TalukProvider = ({children}) => {
    const[taluks, setTaluks] = useState([])

    useEffect(() => {
        const fetchTaluks = async() => {
            try{
                const response = await api.get("base/taluk/")
                if(response.status === 200){
                    setTaluks(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchTaluks();
    },[])

    return (
        <TalukContext.Provider value={{taluks, setTaluks}}>
            {children}
        </TalukContext.Provider>
    )
}