import React, {useState, useEffect, createContext, useMemo} from 'react'
import api from 'api'

export const NationalityContext = createContext()

export const NationalityProvider = ({children}) => {
    const[nationalities, setNationalities] = useState([])

    useEffect(() => {
        const fetchNationalities = async() => {
            try{
                const response = await api.get("base/nationality/")
                if(response.status === 200){
                    setNationalities(response.data)
                    console.log(nationalities)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchNationalities();
    },[])

    const contextValue = useMemo(() => ({nationalities, setNationalities}), [nationalities])

    return (
        <NationalityContext.Provider value={contextValue}>
            {children}
        </NationalityContext.Provider>
    )
}