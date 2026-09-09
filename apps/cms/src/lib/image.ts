import { env } from './env';

/**
 * Resolves an image reference to a URL the browser can load.
 *
 * Images reach the CMS in four forms:
 *  - a `blob:` URL from a local file picker, before upload
 *  - an absolute Cloudinary URL, which is how all new uploads are stored
 *  - a legacy `/uploads/...` path from before uploads moved to Cloudinary
 *  - some other relative path, left as-is for the dev server to resolve
 *
 * Legacy paths are served by the API under `/public/uploads/...`. An earlier
 * version appended them straight onto the API base, producing
 * `/api/v1/uploads/...` and a 404 for every legacy image.
 */
export function normalizeImageUrl(image?: string): string {
  if (!image) return '';
  if (image.startsWith('blob:') || image.startsWith('data:')) return image;
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith('/uploads')) return `${env.apiBaseUrl}/public${image}`;
  return image;
}
