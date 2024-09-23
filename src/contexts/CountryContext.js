import React, {useState, useEffect, createContext, useMemo} from 'react'
import api from 'api'

export const CountryContext = createContext()

export const CountryProvider = ({children}) => {
    const[countries, setCountries] = useState([])

    useEffect(() => {
        const fetchCountries = async() => {
            try{
                const response = await api.get("base/country/")
                if(response.status === 200){
                    setCountries(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchCountries();
    },[])

    const contextValue = useMemo(() => ({countries, setCountries}), [countries])

    return (
        <CountryContext.Provider value={contextValue}>
            {children}
        </CountryContext.Provider>
    )
}