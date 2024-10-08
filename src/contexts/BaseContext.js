import React, {createContext, useState, useEffect} from 'react'
import api from 'api'

const BaseContext = createContext()

const BaseProvider = ({children}) => {

    const[efile_no, setEfileNo] = useState(null)
    const[fir, setFir] = useState({})
    const[accused, setAccused] = useState([])
    const[groundCount, setGroundCount] = useState(0)

    return(
        <BaseContext.Provider
            value={{
                efile_no,
                setEfileNo,
                fir,
                setFir,
                accused,
                setAccused,
                groundCount, 
                setGroundCount
            }}
        >
            {children}
        </BaseContext.Provider>
    )

}

export {BaseContext, BaseProvider}