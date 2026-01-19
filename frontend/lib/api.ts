import axios from "axios";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL;

const normalizeApiBaseUrl = (value?: string) => {
  if (!value) return "/api";

  // Trim trailing slashes for consistent joining
  const trimmed = value.replace(/\/+$/, "");
  // If user already provided .../api, keep it; otherwise append /api.
  return /\/api$/i.test(trimmed) ? trimmed : `${trimmed}/api`;
};

const baseURL = normalizeApiBaseUrl(rawBaseUrl);

if (!rawBaseUrl) {
  console.warn(
    "NEXT_PUBLIC_API_URL is not set. Falling back to '/api'. Configure it in deployment if your backend is on a separate domain."
  );
}

const api = axios.create({
  baseURL,
  withCredentials: true, // required for cookie-based auth
  timeout: 15000,
});

export default api;