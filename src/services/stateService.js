import api from "api";

export const getStates = async() => {
    try{
        const response = await api.get("base/state/")
        if(response.status === 200){
            return response.data
        }
    }catch(error){
        throw error
    }
}