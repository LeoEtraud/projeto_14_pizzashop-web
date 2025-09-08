import { env } from "@/env";
import axios from "axios";

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ?? "https://pizzashop-back-end.onrender.com",
  withCredentials: true, // <- importante para CORS + cookies
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const t = localStorage.getItem("ps_token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

if (env.VITE_ENABLE_API_DELAY) {
  api.interceptors.request.use(async (config) => {
    await new Promise((resolve) =>
      setTimeout(resolve, Math.round(Math.random() * 3000)),
    );

    return config;
  });
}
