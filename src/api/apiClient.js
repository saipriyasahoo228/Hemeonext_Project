// import axios from "axios";

// const apiClient = axios.create({
//   // baseURL: "http://localhost:8000/api/",
//   // baseURL: "https://ecommerce-4k81.onrender.com/api/",
//   // baseURL: "https://yourrkart.pythonanywhere.com/api/",
//   baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Add a request interceptor to include the bearer token (if needed)
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("access_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default apiClient;

import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",   // your exact backend
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
