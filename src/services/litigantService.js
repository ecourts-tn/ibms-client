import api from "api";

export const getLitigantByeFileNo = async(efile_no) => {
    try{
        const response = await api.get("litigant/list/", {params:{efile_no}})
        if(response.status === 200){
            return response.data
        }
    }catch(error){
        console.error("Error fetching litigant", error)
        throw error
    }
}