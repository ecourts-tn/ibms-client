import React, {createContext, useState, useEffect} from "react";

const FilingContext = createContext()

const FilingProvider = ({children}) => {
    const[efile_no, setEfile_no] = useState('')

    return(
        <FilingContext.Provider
            value={{
                efile_no,
                setEfile_no
            }}
        >
            {children}
        </FilingContext.Provider>
    )
}

export {FilingContext, FilingProvider}