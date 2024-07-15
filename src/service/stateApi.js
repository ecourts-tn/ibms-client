import axios from "axios"


export const getAllState = async() => {
    const response = await axios.get("http://localhost:8000/api/base/state/")
    if(response.status === 200){
        return response.data
    }
}