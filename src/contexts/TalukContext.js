import React, {useState, useEffect, createContext, useMemo} from 'react'
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

    const contextValue = useMemo(()=>({taluks, setTaluks}), [taluks])

    return (
        <TalukContext.Provider value={contextValue}>
            {children}
        </TalukContext.Provider>
    )
}