import axios from "axios";
import { auth } from "@/lib/firebase";

// Always call same-origin /api from the browser.
// Next.js rewrites (next.config.ts) proxy /api/* to the real backend using NEXT_PUBLIC_API_URL.
// This avoids cross-site cookie issues and prevents accidental calls to frontend routes in prod
// when NEXT_PUBLIC_API_URL is missing or misconfigured.
const baseURL = "/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
});

// Attach Firebase ID token as Bearer for all requests if logged in
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;