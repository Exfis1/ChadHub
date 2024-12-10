import axios from "axios";
import API_BASE_URL from "../config";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to include the Authorization header if needed
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // Assumes token is stored in localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;