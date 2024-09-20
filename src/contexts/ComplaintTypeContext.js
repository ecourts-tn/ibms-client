import React, {useState, useEffect, createContext} from 'react'
import api from 'api'

export const ComplaintTypeContext = createContext()

export const ComplaintTypeProvider = ({children}) => {
    const[complaintTypes, setComplaintTypes] = useState([])

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

    return (
        <ComplaintTypeContext.Provider value={{complaintTypes, setComplaintTypes}}>
            {children}
        </ComplaintTypeContext.Provider>
    )
}