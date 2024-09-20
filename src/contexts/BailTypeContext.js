import React, {useState, useEffect, createContext} from 'react'
import api from 'api'

export const BailTypeContext = createContext()

export const BailTypeProvider = ({children}) => {
    const[bailTypes, setBailTypes] = useState([])

    useEffect(() => {
        const fetchBailTypes = async() => {
            try{
                const response = await api.get("base/bail-type/")
                if(response.status === 200){
                    setBailTypes(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchBailTypes();
    },[])

    return (
        <BailTypeContext.Provider value={{bailTypes, setBailTypes}}>
            {children}
        </BailTypeContext.Provider>
    )
}