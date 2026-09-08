import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "/api/v1/public";

// Axios instance for components that use axios (ContactForm)
export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Helper for components using fetch
export function apiUrl(path: string): string {
  // If path already starts with the base URL, return as-is
  if (path.startsWith(API_BASE_URL)) return path;
  // If path is an absolute URL, return as-is
  if (/^https?:\/\//i.test(path)) return path;
  // Remove leading slash from path if base URL doesn't end with slash
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

// Image URL resolver
export function getImageUrl(image?: string): string {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith(API_BASE_URL)) return image;
  if (image.startsWith("/")) return `${API_BASE_URL}${image}`;
  return `${API_BASE_URL}/${image}`;
}