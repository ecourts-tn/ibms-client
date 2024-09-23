import React, {useState, useEffect, createContext, useMemo} from 'react'
import api from 'api'

export const ProofContext = createContext()

export const ProofProvider = ({children}) => {
    const[proofs, setProofs] = useState([])

    useEffect(() => {
        const fetchProofs = async() => {
            try{
                const response = await api.get("base/proof/")
                if(response.status === 200){
                    setProofs(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchProofs();
    },[])

    const contextValue = useMemo(() => ({proofs, setProofs}), [proofs])

    return (
        <ProofContext.Provider value={contextValue}>
            {children}
        </ProofContext.Provider>
    )
}