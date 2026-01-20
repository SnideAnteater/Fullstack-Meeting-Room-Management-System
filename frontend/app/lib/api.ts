import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// add IC to headers
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const icNumber = localStorage.getItem("userIC");
    if (icNumber) {
      config.headers["X-User-IC"] = icNumber;
    }
  }
  return config;
});

// handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED" || error.code === "ERR_NETWORK") {
      console.warn("API unavailable, using mock data");
      return Promise.reject({ useMock: true, originalError: error });
    }
    return Promise.reject(error);
  },
);
