import api from "api";


export const submittedPetition = async() => {
    try{
        const response = await api.get("case/filing/submitted-list/")
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