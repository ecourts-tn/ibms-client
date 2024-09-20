import React, {useState, useEffect, createContext} from 'react'
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

    return (
        <StateContext.Provider value={{states, setStates}}>
            {children}
        </StateContext.Provider>
    )
}