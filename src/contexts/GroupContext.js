import React, {useState, useEffect, createContext, useMemo} from 'react'
import api from 'api'

export const GroupContext = createContext()

export const GroupProvider = ({children}) => {
    const[groups, setGroups] = useState([])

    useEffect(() => {
        const fetchGroups = async() => {
            try{
                const response = await api.get("base/user-type/")
                if(response.status === 200){
                    setGroups(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchGroups();
    },[])

    const contextValue = useMemo(()=>({groups, setGroups}), [groups])

    return (
        <GroupContext.Provider value={contextValue}>
            {children}
        </GroupContext.Provider>
    )
}