import React, {useState, useEffect, createContext} from 'react'
import api from 'api'

export const PoliceDistrictContext = createContext()

export const PoliceDistrictProvider = ({children}) => {
    const[policeDistricts, setPoliceDistricts] = useState([])

    useEffect(() => {
        const fetchPoliceDistricts = async() => {
            try{
                const response = await api.get("base/police-district/")
                if(response.status === 200){
                    setPoliceDistricts(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchPoliceDistricts();
    },[])

    return (
        <PoliceDistrictContext.Provider value={{policeDistricts, setPoliceDistricts}}>
            {children}
        </PoliceDistrictContext.Provider>
    )
}