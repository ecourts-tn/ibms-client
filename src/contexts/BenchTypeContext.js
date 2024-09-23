import React, {useState, useEffect, createContext, useMemo} from 'react'
import api from 'api'

export const BenchTypeContext = createContext()

export const BenchTypeProvider = ({children}) => {
    const[benchtypes, setBenchTypes] = useState([])

    useEffect(() => {
        const fetchBenchTypes = async() => {
            try{
                const response = await api.get("base/bench-type/")
                if(response.status === 200){
                    setBenchTypes(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchBenchTypes();
    },[])

    const contextValue = useMemo(() =>({benchtypes, setBenchTypes}), [benchtypes])

    return (
        <BenchTypeContext.Provider value={contextValue}>
            {children}
        </BenchTypeContext.Provider>
    )
}