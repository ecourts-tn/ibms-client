import axios from "axios";

// Create an instance of Axios
axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

let isRefreshing = false;
let failedQueue = [];

// Function to process the failed requests queue
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

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
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        const response = await api.post(
          "auth/token/refresh/",
          {},
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.status === 200) {
          const newAccessToken = response.data.access;

          // Update the Authorization header for the original request
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

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

// Interceptor to attach the access token from the cookie to every request
api.interceptors.request.use(
  (config) => {
    // Use the access token from cookies
    console.log(document.cookie)
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
