import axios from 'axios';
import { env } from './env';

/** Base URL for the public API. Relative by default; see lib/env.ts. */
export const API_BASE_URL = env.apiBaseUrl;

/** Shared axios instance for components that post (e.g. the contact form). */
export const api = axios.create({
  baseURL: API_BASE_URL,
});

/** Joins a path onto the API base, leaving absolute URLs untouched. */
export function apiUrl(path: string): string {
  if (path.startsWith(API_BASE_URL)) return path;
  if (/^https?:\/\//i.test(path)) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

/**
 * Resolves an image reference to a loadable URL.
 *
 * Content images are absolute Cloudinary URLs; legacy records hold paths
 * relative to the API.
 */
export function getImageUrl(image?: string): string {
  if (!image) return '';
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith('data:')) return image;
  if (image.startsWith(API_BASE_URL)) return image;
  return apiUrl(image);
}
