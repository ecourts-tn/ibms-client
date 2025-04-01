import React, {createContext, useState, useEffect} from 'react'

const BaseContext = createContext()

const BaseProvider = ({children}) => {

    const[efileNumber, setEfileNumber] = useState(() => {
        const storedNumber = sessionStorage.getItem("efileNumber")
        return storedNumber ? storedNumber : null;
    })

    useEffect(() => {
        if(efileNumber){
            sessionStorage.setItem("efileNumber", efileNumber)
        }
    }, [efileNumber])

    const clearEfileNumber = () => {
        setEfileNumber(null);
        sessionStorage.removeItem("efileNumber"); 
    };


    return(
        <BaseContext.Provider
            value = {{
                efileNumber,
                setEfileNumber,
                clearEfileNumber
            }}
        >
            {children}
        </BaseContext.Provider>
    )
}

export {BaseContext, BaseProvider}