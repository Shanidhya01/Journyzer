import axios from "axios";
import { auth } from "@/lib/firebase";

const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL
    : "/api";

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