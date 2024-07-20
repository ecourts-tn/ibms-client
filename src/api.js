import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

//const apiUrl = "http://192.168.100.135:8000/";

const apiUrl = "https://1ab7-117-197-189-32.ngrok-free.app/"

// const apiUrl = "http://localhost:8000/"

const api = axios.create({
    baseURL: apiUrl
});

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem(ACCESS_TOKEN);
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default api;