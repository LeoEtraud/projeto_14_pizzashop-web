import { env } from "@/env";
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3333",
  withCredentials: true, // <- importante para CORS + cookies
  headers: { "Content-Type": "application/json" },
});

if (env.VITE_ENABLE_API_DELAY) {
  api.interceptors.request.use(async (config) => {
    await new Promise((resolve) =>
      setTimeout(resolve, Math.round(Math.random() * 3000)),
    );

    return config;
  });
}
