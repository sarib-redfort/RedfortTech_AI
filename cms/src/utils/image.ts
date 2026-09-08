const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/public';

export const normalizeImageUrl = (image?: string) => {
  if (!image) return '';
  if (image.startsWith('blob:')) return image;
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith('/uploads')) return `${API_BASE_URL}${image}`;
  if (image.startsWith('/')) return image;
  return `${API_BASE_URL}/${image}`;
};
