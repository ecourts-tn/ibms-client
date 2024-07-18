import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

// const apiUrl = "http://192.168.100.135:8000/";

const apiUrl = "https://17ae-202-53-7-10.ngrok-free.app/"

const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
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