import axios from "axios";
import { BASEURL } from "./constant";
import { getToken } from "./storage";

const axiosInstance = axios.create({
  baseURL: BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Check for token and append to headers for each request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
    } else {
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (!error.response) {
//       console.log(error);
//       // Network error (e.g., no internet connection)
//       console.error("Network Error:", error.message);
//       // You can show an error message to the user or perform other actions as needed
//       toast.error(error?.message);
//       return Promise.reject(error);
//     }

//     // Handle backend errors (4xx or 5xx status codes)
//     if (error.response.status >= 400) {
//       // Handle the specific error condition
//       if (error.response.status === 404) {
//         toast.error(error?.response?.data?.message);
//         // Handle a "Not Found" error
//       } else if (error.response.status === 401) {
//         // Handle an "Unauthorized" error
//       }
//       // You can display a user-friendly error message or perform other actions here
//     }

//     return Promise.reject(error);
//   }
// );
export default axiosInstance;
