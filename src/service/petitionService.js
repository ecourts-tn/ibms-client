import axios from "axios";

const api = axios.create({
    baseURL: 'https://localhost:8000/api/', 
});

export const fetchCases = async () => {
    try {
        const response = await api.get('bail/petition/list/');
        return response.data;
    } catch (error) {
        console.error('Error fetching cases:', error);
        throw error;
    }
};

export const fetchCaseBycino = async (cino) => {
    try{
        const response = await api.get('bail/petition/detail', {
            params:{
                cino: cino
            }
        });
        return response.data;
    }catch(error){
        console.error("Error fetching case details", error);
        throw error;
    }
}