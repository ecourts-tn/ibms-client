import React, {useState, useEffect, createContext, useMemo} from 'react'
import api from 'api'

export const UserTypeContext = createContext()

export const UserTypeProvider = ({children}) => {
    const[userTypes, setUserTypes] = useState([])

    useEffect(() => {
        const fetchUserTypes = async() => {
            try{
                const response = await api.get("base/user-type/")
                if(response.status === 200){
                    setUserTypes(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchUserTypes();
    },[])

    const contextValue = useMemo(()=>({userTypes,setUserTypes}), [userTypes])

    return (
        <UserTypeContext.Provider value={contextValue}>
            {children}
        </UserTypeContext.Provider>
    )
}