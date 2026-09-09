/**
 * Typed, validated access to the build-time environment.
 *
 * Vite inlines `import.meta.env.*` at build time, so a missing variable fails
 * here at startup with a clear message rather than surfacing later as a
 * request to `undefined/auth/login`.
 */

const DEFAULT_API_URL = 'http://localhost:5000/api/v1';

function readApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL?.trim();

  if (!raw) {
    if (import.meta.env.PROD) {
      throw new Error(
        'VITE_API_URL is not set. The CMS cannot reach the API without it. ' +
          'Set it in the build environment, e.g. https://api.example.com/api/v1',
      );
    }
    return DEFAULT_API_URL;
  }

  // A trailing slash would produce "//admin/blogs" once paths are appended.
  return raw.replace(/\/+$/, '');
}

export const env = {
  apiBaseUrl: readApiBaseUrl(),
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
} as const;
