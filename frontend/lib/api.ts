import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (!baseURL) {
  // eslint-disable-next-line no-console
  console.warn(
    "NEXT_PUBLIC_API_URL is not set. API requests will use relative URLs and likely fail."
  );
}

const api = axios.create({
  baseURL,
  withCredentials: true, // VERY IMPORTANT (cookies)
  timeout: 15000,
});

export default api;
