import React, {useState, useEffect, createContext, useMemo} from 'react'
import api from 'api'

export const BailTypeContext = createContext()

export const BailTypeProvider = ({children}) => {
    const[bailtypes, setBailTypes] = useState([])

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

    const contextValue = useMemo(() => ({bailtypes, setBailTypes}), [bailtypes])

    return (
        <BailTypeContext.Provider value={contextValue}>
            {children}
        </BailTypeContext.Provider>
    )
}