import axios from "axios";

const getApiBaseUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!configuredUrl || typeof window === "undefined") {
    return configuredUrl;
  }

  const apiUrl = new URL(configuredUrl);
  if (apiUrl.hostname === "localhost" || apiUrl.hostname === "127.0.0.1") {
    apiUrl.hostname = window.location.hostname;
  }

  return apiUrl.toString();
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;