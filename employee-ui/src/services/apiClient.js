import axios from "axios";
import {
  getToken,
  getRefreshToken,
  logout,
  updateAccessToken
} from "../utils/auth";
import { refreshToken as refreshTokenApi } from "./authService";

const apiClient = axios.create({
  baseURL: "http://localhost:5071/api"
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const currentRefreshToken = getRefreshToken();

        if (!currentRefreshToken) {
          logout();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const response = await refreshTokenApi(currentRefreshToken);
        const tokenData = response.data.data;

        updateAccessToken(tokenData.accessToken, tokenData.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${tokenData.accessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;