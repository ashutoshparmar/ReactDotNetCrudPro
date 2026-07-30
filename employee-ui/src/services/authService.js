import axios from "axios";

const AUTH_API_URL = "http://localhost:5071/api/auth";

export const login = (credentials) => {
  return axios.post(`${AUTH_API_URL}/login`, credentials);
};

export const register = (data) => {
  return axios.post(`${AUTH_API_URL}/register`, data);
};

export const refreshToken = (refreshTokenValue) => {
  return axios.post(`${AUTH_API_URL}/refresh-token`, {
    refreshToken: refreshTokenValue
  });
};