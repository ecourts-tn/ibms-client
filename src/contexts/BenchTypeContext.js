import React, {useState, useEffect, createContext} from 'react'
import api from 'api'

export const BenchTypeContext = createContext()

export const BenchTypeProvider = ({children}) => {
    const[benchTypes, setBenchTypes] = useState([])

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

    return (
        <BenchTypeContext.Provider value={{benchTypes, setBenchTypes}}>
            {children}
        </BenchTypeContext.Provider>
    )
}