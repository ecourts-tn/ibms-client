import React, {useState, useEffect, createContext, useMemo} from 'react'
import api from 'api'

export const DocumentContext = createContext()

export const DocumentProvider = ({children}) => {
    const[documents, setDocuments] = useState([])

    useEffect(() => {
        const fetchDocuments = async() => {
            try{
                const response = await api.get("base/document/")
                if(response.status === 200){
                    setDocuments(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchDocuments();
    },[])

    const contextValue = useMemo(() => ({documents, setDocuments}), [documents])

    return (
        <DocumentContext.Provider value={contextValue}>
            {children}
        </DocumentContext.Provider>
    )
}