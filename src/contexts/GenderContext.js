import React, {useState, useEffect, createContext, useMemo} from 'react'
import api from 'api'

export const GenderContext = createContext()

export const GenderProvider = ({children}) => {
    const[genders, setGenders] = useState([])

    useEffect(() => {
        const fetchGenders = async() => {
            try{
                const response = await api.get("base/gender/")
                if(response.status === 200){
                    setGenders(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchGenders();
    },[])

    const contextValue = useMemo(() => ({genders, setGenders}), [genders])

    return (
        <GenderContext.Provider value={contextValue}>
            {children}
        </GenderContext.Provider>
    )
}