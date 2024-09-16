import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        await api.get("/auth/refresh");
        console.log("Token refreshed");
        return api(error.config);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        window.location.href = "http://localhost:5000/auth/google";
      }
    }
    return Promise.reject(error);
  },
);
