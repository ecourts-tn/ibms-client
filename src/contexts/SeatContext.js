import React, {useState, useEffect, createContext, useMemo} from 'react'
import api from 'api'

export const SeatContext = createContext()

export const SeatProvider = ({children}) => {
    const[seats, setSeats] = useState([])

    useEffect(() => {
        const fetchSeats = async() => {
            try{
                const response = await api.get("base/seat/")
                if(response.status === 200){
                    setSeats(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchSeats();
    },[])

    const contextValue = useMemo(() =>({seats, setSeats}), [seats])

    return (
        <SeatContext.Provider value={contextValue}>
            {children}
        </SeatContext.Provider>
    )
}