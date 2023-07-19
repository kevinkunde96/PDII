import axios from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL ?? "http://localhost:4000",
});

api.interceptors.request.use(
  config => {
    config.headers["Authorization"] = "Bearer " + localStorage.getItem('token');
    return config;
  },
  error => {
    Promise.reject(error);
  }
);