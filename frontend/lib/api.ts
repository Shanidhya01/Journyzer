import axios from "axios";

// Always use same-origin /api and let Next.js proxy it via next.config rewrites.
// This avoids third-party cookie issues in production.
const baseURL = "/api";

const api = axios.create({
  baseURL,
  withCredentials: true, // required for cookie-based auth
  timeout: 15000,
});

export default api;