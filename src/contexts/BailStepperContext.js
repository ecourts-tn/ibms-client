import React, {createContext, useState} from "react";

const BailStepperContext = createContext()

const BailStepperProvider = ({children}) => {
    const[steps, setSteps] = useState({
        initial : false,
        litigant: false,
        grounds : false,
        previous: false,
        advocate: false,
        document: false,
        payment : false,
        efile   : false
    })


    return (
        <BailStepperContext.Provider
            value={{ steps }}
        >
            {children}
        </BailStepperContext.Provider>
    )
}

export {BailStepperContext, BailStepperProvider}