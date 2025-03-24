import { useContext, useEffect, useMemo, useState } from "react";

export const UserContext = useContext()

export const UserProvider = ({children}) => {
    const[user, setUser] = useState({})
    const[isAuth, setIsAuth] = useState(false)

    useEffect(() => {
        const fetchUserInfo = async() => {
            try{
                const response = await api.get('auth/user/info/')
                if(response.status === 200){
                    setUser(response.data || {})
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchUserInfo()
    },[])

    useEffect(() => {
        const checkIsAuth = async() => {
            try{
                const response = await api.get('auth/')
                if(response.status === 200){
                    setIsAuth(response.data.is_auth || false)
                }
            }catch(error){
                console.log(error)
            }
        }
        checkIsAuth()
    },[])

    const contextValue = useMemo(() => (user, setUser, isAuth, setIsAuth), [user, isAuth])

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    )
}