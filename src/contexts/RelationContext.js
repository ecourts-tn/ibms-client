import React, {useState, useEffect, createContext, useMemo} from 'react'
import api from 'api'

export const RelationContext = createContext()

export const RelationProvider = ({children}) => {
    const[relations, setRelations] = useState([])

    useEffect(() => {
        const fetchRelations = async() => {
            try{
                const response = await api.get("base/relation/")
                if(response.status === 200){
                    setRelations(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchRelations();
    },[])

    const contextValue = useMemo(()=>({relations, setRelations}), [relations])

    return (
        <RelationContext.Provider value={contextValue}>
            {children}
        </RelationContext.Provider>
    )
}