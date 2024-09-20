import React, {useState, useEffect, createContext} from 'react'
import api from 'api'

export const DistrictContext = createContext()

export const DistrictProvider = ({children}) => {
    const[districts, setDistricts] = useState([])

    useEffect(() => {
        const fetchDistricts = async() => {
            try{
                const response = await api.get("base/district/")
                if(response.status === 200){
                    setDistricts(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchDistricts();
    },[])

    return (
        <DistrictContext.Provider value={{districts, setDistricts}}>
            {children}
        </DistrictContext.Provider>
    )
}