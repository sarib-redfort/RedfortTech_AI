import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { env } from './env';
import { logger } from './logger';

export const TOKEN_STORAGE_KEY = 'token';
export const USER_STORAGE_KEY = 'user';

/**
 * Shape every API response arrives in. The backend wraps all handler results
 * in a TransformInterceptor, so the payload is always nested under `data`.
 */
interface ApiEnvelope<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Broadcast on 401 so the app shell can send the user back to the login screen. */
export const UNAUTHORIZED_EVENT = 'redfort:unauthorized';

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
    }
    return Promise.reject(error);
  },
);

/**
 * Turns an axios failure into a message worth showing a user.
 *
 * The backend returns `message` as either a string or an array of
 * class-validator strings, so both are flattened here.
 */
export function toErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as ApiEnvelope<unknown> & {
      message?: string | string[];
      error?: string;
    };
    const raw = body?.message ?? body?.error;
    if (Array.isArray(raw)) return raw.join(', ');
    if (typeof raw === 'string' && raw.trim()) return raw;
    if (error.code === 'ERR_NETWORK') {
      return 'Cannot reach the API. Check that the backend is running.';
    }
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

/** Unwraps the `{ success, message, data }` envelope, tolerating a bare payload. */
function unwrap<T>(body: ApiEnvelope<T> | T): T {
  if (body && typeof body === 'object' && !Array.isArray(body) && 'data' in body) {
    return (body as ApiEnvelope<T>).data as T;
  }
  return body as T;
}

/**
 * Extracts a list from a response.
 *
 * Handles the three shapes the API returns: a bare array, the standard
 * envelope wrapping an array, and a paginated `{ data: [], meta }` object.
 */
export function toList<T>(body: unknown): T[] {
  const payload = unwrap<unknown>(body);
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === 'object') {
    const nested = (payload as Record<string, unknown>).data;
    if (Array.isArray(nested)) return nested as T[];
    for (const key of ['items', 'results']) {
      const value = (payload as Record<string, unknown>)[key];
      if (Array.isArray(value)) return value as T[];
    }
  }
  return [];
}

/** Extracts a single entity from a response. */
export function toItem<T>(body: unknown): T {
  return unwrap<T>(body as ApiEnvelope<T>);
}

/** Multipart requests must not set Content-Type manually; the browser adds the boundary. */
export function isFormData(value: unknown): value is FormData {
  return typeof FormData !== 'undefined' && value instanceof FormData;
}

export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await apiClient.request<ApiEnvelope<T>>(config);
    return toItem<T>(response.data);
  } catch (error) {
    logger.error(`[api] ${config.method?.toUpperCase()} ${config.url} failed`, error);
    throw error;
  }
}
