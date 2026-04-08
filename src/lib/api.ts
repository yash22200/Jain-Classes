// Centralized API base URL configuration
// In development: defaults to http://localhost:5000
// In production: set VITE_API_URL env variable to your backend URL
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Config API endpoints
export const configAPI = {
  async getCourses() {
    const response = await fetch(`${API_URL}/api/config/courses`);
    if (!response.ok) throw new Error("Failed to fetch courses");
    const data = await response.json();
    return data.data || [];
  },

  async getBatches() {
    const response = await fetch(`${API_URL}/api/config/batches`);
    if (!response.ok) throw new Error("Failed to fetch batches");
    const data = await response.json();
    return data.data || [];
  },

  async getSuccessStories() {
    const response = await fetch(`${API_URL}/api/config/success-stories`);
    if (!response.ok) throw new Error("Failed to fetch success stories");
    const data = await response.json();
    return data.data || [];
  },

  async getMarketingStats() {
    const response = await fetch(`${API_URL}/api/config/marketing-stats`);
    if (!response.ok) throw new Error("Failed to fetch marketing stats");
    const data = await response.json();
    return data.data || {};
  },

  async getLinks() {
    const response = await fetch(`${API_URL}/api/config/links`);
    if (!response.ok) throw new Error("Failed to fetch links");
    const data = await response.json();
    return data.data || {};
  },
};
