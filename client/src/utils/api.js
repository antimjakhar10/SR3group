const RAW_API = import.meta.env.VITE_API_URL || "http://localhost:4200";

export const API_BASE = RAW_API.endsWith("/api")
  ? RAW_API
  : `${RAW_API}/api`;

export const SERVER_BASE = RAW_API.endsWith("/api")
  ? RAW_API.replace(/\/api$/, "")
  : RAW_API;