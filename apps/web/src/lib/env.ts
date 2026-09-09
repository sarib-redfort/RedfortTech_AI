/**
 * Typed, validated access to the build-time environment.
 *
 * The website reads only public content, so it defaults to the relative path
 * `/api/v1/public`. In development the Vite dev server proxies that to the
 * API (see vite.config.ts); in production it works when the site and the API
 * are served from the same origin behind a reverse proxy.
 *
 * Set VITE_API_URL to an absolute URL when the API lives on another origin.
 */

const RELATIVE_PUBLIC_API = '/api/v1/public';

function readApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL?.trim();
  if (!raw) return RELATIVE_PUBLIC_API;
  // A trailing slash would produce a double slash once paths are appended.
  return raw.replace(/\/+$/, '');
}

export const env = {
  apiBaseUrl: readApiBaseUrl(),
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
} as const;
