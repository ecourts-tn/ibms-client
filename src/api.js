import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

//const apiUrl = "http://192.168.100.135:8000/";

const apiUrl = "http://117.193.76.243:8088/"

const api = axios.create({
    baseURL: apiUrl
});

let refresh = false;

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(resp => resp, async error => {  
  if (error.config && error.config.skipInterceptor) {
    return Promise.reject(error);
  }
  if (error.response.status === 401 && !refresh) {     
    refresh = true;
    const response = await api.post('api/auth/token/refresh/', {      
                          refresh:localStorage.getItem(REFRESH_TOKEN)
                        }, { 
                          headers: {'Content-Type': 'application/json'}
                        },{
                          withCredentials: true
                        });    
    if (response.status === 200) {
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data['access']}`;       
      localStorage.setItem(ACCESS_TOKEN, response.data.access);       
      localStorage.setItem(REFRESH_TOKEN, response.data.refresh);       
      return axios(error.config);
    }  
  }
  refresh = false;
  return error;
});

export default api