import axios from "axios";

// Use absolute backend URL in production, fallback to /api locally
const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL
    : "/api";

const api = axios.create({
  baseURL,
  withCredentials: true, // required for cookie-based auth
  timeout: 15000,
});

export default api;