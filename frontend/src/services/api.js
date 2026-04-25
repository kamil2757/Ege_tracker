import axios from "axios";
import { clearAuth, logout, setAccessToken  } from "../store/authSlice";

let getAccessToken = () => null;
let storeDispatch = null;

export const setAccessTokenGetter = (fn) => {
  getAccessToken = fn;
};

export const setStoreDispatch = (dispatch) => {
  storeDispatch = dispatch;
};

const baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token && !config.url.includes("/login") && !config.url.includes("/register") &&   !config.url.includes("/token/refresh/")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);


api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("/token/refresh/")) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/api/users/token/refresh/");

        if (storeDispatch) {
          storeDispatch(setAccessToken(res.data.access));
        }
        

        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest);

      } catch (refreshError) {
        if (storeDispatch) {
          storeDispatch(clearAuth());
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
