import React, {useState, useEffect, createContext, useMemo} from 'react'
import api from 'api'

export const PoliceStationContext = createContext()

export const PoliceStationProvider = ({children}) => {
    const[policeStations, setPoliceStations] = useState([])

    useEffect(() => {
        const fetchPoliceStations = async() => {
            try{
                const response = await api.get("base/police-station/")
                if(response.status === 200){
                    setPoliceStations(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchPoliceStations();
    },[])

    const contextValue = useMemo(()=>({policeStations, setPoliceStations}), [policeStations])

    return (
        <PoliceStationContext.Provider value={contextValue}>
            {children}
        </PoliceStationContext.Provider>
    )
}