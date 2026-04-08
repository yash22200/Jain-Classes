// Centralized API base URL configuration
// In development: defaults to http://localhost:5000
// In production: set VITE_API_URL env variable to your Render backend URL
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
