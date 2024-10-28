import React, {useState, useEffect, createContext, useMemo} from 'react'
import api from 'api'

export const JudiciaryContext = createContext()

export const JudiciaryProvider = ({children}) => {
    const[judiciaries, setJudiciaries] = useState([])

    useEffect(() => {
        const fetchJudiciaries = async() => {
            try{
                const response = await api.get("base/judiciary/")
                if(response.status === 200){
                    setJudiciaries(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchJudiciaries();
    },[])

    const contextValue = useMemo(()=>({judiciaries, setJudiciaries}), [judiciaries])

    return (
        <JudiciaryContext.Provider value={contextValue}>
            {children}
        </JudiciaryContext.Provider>
    )
}