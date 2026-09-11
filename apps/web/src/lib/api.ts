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

/** Matches the API's maximum page size (MAX_PAGE_SIZE on the server). */
const PAGE_SIZE = 100;

/**
 * Fetches every item in a paginated collection.
 *
 * List endpoints return 10 items unless asked for more. Components that
 * fetched `/industries` or `/blogs` directly therefore only ever received the
 * first page, and silently omitted everything after it — Healthcare and
 * FinTech were missing from the industries page, with no error. This walks
 * the pages reported in `meta` instead.
 *
 * Resolves to `{ success, data }` with `data` holding every item, so callers'
 * existing envelope parsing is unchanged. Throws on a non-2xx response.
 */
export async function fetchAllPages<T = unknown>(
  path: string,
  init?: RequestInit,
): Promise<{ success: true; data: T[] }> {
  const separator = path.includes('?') ? '&' : '?';
  const pageUrl = (page: number) =>
    apiUrl(`${path}${separator}page=${page}&limit=${PAGE_SIZE}`);

  const readPage = async (page: number) => {
    const response = await fetch(pageUrl(page), init);
    if (!response.ok) {
      throw new Error(`GET ${path} failed (${response.status})`);
    }
    return response.json();
  };

  const itemsOf = (body: any): T[] =>
    Array.isArray(body) ? body : Array.isArray(body?.data) ? body.data : [];

  const first = await readPage(1);
  const items = itemsOf(first);
  const totalPages: number = first?.meta?.totalPages ?? 1;

  if (totalPages > 1) {
    const rest = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) => readPage(i + 2)),
    );
    for (const body of rest) items.push(...itemsOf(body));
  }

  return { success: true, data: items };
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
