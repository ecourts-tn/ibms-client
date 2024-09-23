import React, {useState, useEffect, createContext, useMemo} from 'react'
import api from 'api'

export const StateContext = createContext()

export const StateProvider = ({children}) => {
    const[states, setStates] = useState([])

    useEffect(() => {
        const fetchStates = async() => {
            try{
                const response = await api.get("base/state/")
                if(response.status === 200){
                    setStates(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchStates();
    },[])

    const contextValue = useMemo(()=>({states,setStates}), [states])

    return (
        <StateContext.Provider value={contextValue}>
            {children}
        </StateContext.Provider>
    )
}