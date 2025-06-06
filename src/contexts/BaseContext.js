import React, {createContext, useState, useEffect} from 'react'
import { encrypt, decrypt } from 'components/utils/crypto'

const BaseContext = createContext()

const BaseProvider = ({children}) => {
  const[efileNumber, setEfileNumber] = useState(() => {
    const encryptedNumber = sessionStorage.getItem("efileNumber")
    return encryptedNumber ? decrypt(encryptedNumber) : null;
  })
  
  useEffect(() => {
    if(efileNumber){
      const encryptedValue = encrypt(efileNumber)
      sessionStorage.setItem("efileNumber", encryptedValue)
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