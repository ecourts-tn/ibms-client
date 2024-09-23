import React, {useState, useEffect, createContext, useMemo} from 'react'
import api from 'api'

export const ComplaintTypeContext = createContext()

export const ComplaintTypeProvider = ({children}) => {
    const[complainttypes, setComplaintTypes] = useState([])

    useEffect(() => {
        const fetchComplaintTypes = async() => {
            try{
                const response = await api.get("base/complaint-type/")
                if(response.status === 200){
                    setComplaintTypes(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchComplaintTypes();
    },[])

    const contextValue = useMemo(() => ({complainttypes, setComplaintTypes}), [complainttypes])

    return (
        <ComplaintTypeContext.Provider value={contextValue}>
            {children}
        </ComplaintTypeContext.Provider>
    )
}