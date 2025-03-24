import React, {useState, useEffect, createContext, useMemo} from 'react'
import api from 'api'

export const AgencyContext = createContext()

export const AgencyProvider = ({children}) => {
    const[agencies, setAgencies] = useState([])

    useEffect(() => {
        const fetchAgencies = async() => {
            try{
                const response = await api.get("base/investigation-agency/")
                if(response.status === 200){
                    setAgencies(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchAgencies();
    },[])

    const contextValue = useMemo(() => ({agencies, setAgencies}), [agencies])

    return (
        <AgencyContext.Provider value={contextValue}>
            {children}
        </AgencyContext.Provider>
    )
}