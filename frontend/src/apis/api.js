import axios from "axios";

const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
});

apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access-token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const apiGet = (endpoint) => apiInstance.get(endpoint);

const apiPost = (endpoint, data) => apiInstance.post(endpoint, data);

const apiPut = (endpoint, data) => apiInstance.put(endpoint, data);

const apiDelete = (endpoint) => apiInstance.delete(endpoint);

export { apiGet, apiPost, apiPut, apiDelete };
