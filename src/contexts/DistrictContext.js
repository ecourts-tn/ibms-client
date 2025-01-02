import React, {useState, useEffect, createContext, useMemo} from 'react'
import api from 'api'

export const DistrictContext = createContext()

export const DistrictProvider = ({children}) => {
    const[districts, setDistricts] = useState([])

    useEffect(() => {
        const controller = new AbortController()
        const fetchDistricts = async() => {
            if(districts.length === 0){
                try{
                    const response = await api.get("base/district/")
                    if(response.status === 200){
                        setDistricts(response.data)
                    }
                }catch(error){
                    console.error(error)
                }
            }
        }
        fetchDistricts();
        return () => {
            controller.abort()
        }
    },[])

    const contextValue = useMemo(() => ({districts, setDistricts}), [districts])

    return (
        <DistrictContext.Provider value={contextValue}>
            {children}
        </DistrictContext.Provider>
    )
}