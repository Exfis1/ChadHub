import apiClient from "./apiService";

export const login = async (credentials) => {
    const response = await apiClient.post("/login", credentials);
    localStorage.setItem("token", response.data.accessToken);
    return response.data;
};

export const register = async (userData) => {
    const response = await apiClient.post("/accounts", userData);
    return response.data;
};

export const logout = async () => {
    await apiClient.post("/logout");
    localStorage.removeItem("token");
};