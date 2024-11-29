import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

// Create an instance of Axios
axios.defaults.withCredentials = true;


const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

let isRefreshing = false;
let failedQueue = [];

// Function to process the failed requests queue
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Interceptor to attach the access token to every request
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle responses and token refresh logic
api.interceptors.response.use(
  (response) => response, // If the response is successful, just return it
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest && originalRequest.skipInterceptor) {
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue the requests
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = sessionStorage.getItem(REFRESH_TOKEN);

      // If there's no refresh token, reject with the error
      if (!refreshToken) {
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh the token
        const response = await api.post('auth/token/refresh/', {
          refresh: refreshToken
        }, {
          headers: {'Content-Type': 'application/json'}
        });

        if (response.status === 200) {
          const newAccessToken = response.data.access;
          const newRefreshToken = response.data.refresh;

          // Store the new tokens
          sessionStorage.setItem(ACCESS_TOKEN, newAccessToken);
          sessionStorage.setItem(REFRESH_TOKEN, newRefreshToken);

          // Update the Authorization header for the original request
          api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          // Process the failed requests in the queue
          processQueue(null, newAccessToken);

          return axios(originalRequest); // Retry the original request
        }
      } catch (refreshError) {
        // If refresh fails, log out the user or handle appropriately
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
