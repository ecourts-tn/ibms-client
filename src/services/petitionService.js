import api from "api";


export const pendingPetition = async() => {
    try{
        const response = await api.get("case/filing/pending/")
        if(response.status === 200){
            return response.data
        }
    }catch(error){
        console.error("Error fetching petitions", error)
        throw error
    }
}

export const submittedPetition = async() => {
    try{
        const response = await api.get("case/filing/submitted/")
        if(response.status === 200){
            return response.data
        } 
    }catch(error){
        console.error("Error fetching petitions", error)
        throw error
    }
}

export const approvedPetition = async() => {
    try{
        const response = await api.get("case/filing/approved/")
        if(response.status === 200){
            return response.data
        } 
    }catch(error){
        console.error("Error fetching petitions", error)
        throw error
    }
}

export const returnedPetition = async() => {
    try{
        const response = await api.get("case/filing/returned/")
        if(response.status === 200){
            return response.data
        } 
    }catch(error){
        console.error("Error fetching petitions", error)
        throw error
    }
}

export const savePetition = async(petition) => {
    try{
        const response = await api.post("case/filing/", petition)
        if(response.status ===201){
            return response.data
        }
    }catch(error){
        console.log("Error creating petition", error)
        throw error
    }
}

export const updatePetition = async(petition) => {
    try{
        const response = await api.put("case/filing/update/", petition)
        if(response.status === 200){
            return response.data
        }
    }catch(error){
        console.error("Error updating the petition", error)
        throw error;
    }
}

export const getPetitionByeFileNo = async(efile_no) => {
    try{
        const response = await api.get("case/filing/detail/", {params:{efile_no}})
        if(response.status === 200){
            return response.data
        }
    }catch(error){
        console.error("Error fetching petition", error)
    }
}