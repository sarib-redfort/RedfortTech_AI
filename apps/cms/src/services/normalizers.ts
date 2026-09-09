/**
 * Maps raw API records onto the shapes the views expect.
 *
 * The backend is consistent, but records predating the current schema can omit
 * fields or use snake_case, and ids arrive as `id` or `_id`. Normalizing here
 * keeps every view free of defensive `?? ''` chains.
 */
import type {
  Blog,
  CaseStudy,
  Contact,
  Faq,
  Industry,
  Service,
  TeamMember,
  Testimonial,
  User,
} from '../types';

/** Records use `id` or Mongo-style `_id`. */
const id = (raw: any): string => raw?.id ?? raw?._id ?? '';

/** Timestamps appear as camelCase or snake_case depending on record age. */
const createdAt = (raw: any): string => raw?.createdAt ?? raw?.created_at ?? '';

export const normalizeUser = (raw: any): User => ({
  ...raw,
  id: id(raw),
});

export const normalizeBlog = (raw: any): Blog => ({
  ...raw,
  id: id(raw),
});

export const normalizeService = (raw: any): Service => ({
  ...raw,
  id: id(raw),
  title: raw?.title ?? '',
  description: raw?.description ?? '',
  icon: raw?.icon ?? '',
  status: raw?.status ?? 'Active',
});

export const normalizeCaseStudy = (raw: any): CaseStudy => ({
  ...raw,
  id: id(raw),
  title: raw?.title ?? '',
  slug: raw?.slug ?? '',
  image: raw?.image ?? raw?.imageUrl ?? '',
  shortDescription: raw?.shortDescription ?? raw?.short_description ?? '',
  technologies: Array.isArray(raw?.technologies) ? raw.technologies : [],
  content: raw?.content ?? '',
  status: raw?.status ?? 'Active',
  createdAt: createdAt(raw),
});

export const normalizeContact = (raw: any): Contact => ({
  ...raw,
  id: id(raw),
  name: raw?.name ?? raw?.fullName ?? 'Unknown',
  email: raw?.email ?? '',
  phoneNumber: raw?.phoneNumber ?? raw?.phone ?? raw?.contactNumber ?? '',
  subject: raw?.subject ?? 'No subject',
  message: raw?.message ?? '',
  date: raw?.date ?? createdAt(raw),
  status: raw?.status ?? 'New',
});

export const normalizeTestimonial = (raw: any): Testimonial => ({
  ...raw,
  id: id(raw),
});

export const normalizeFaq = (raw: any): Faq => ({
  ...raw,
  id: id(raw),
  question: raw?.question ?? '',
  answer: raw?.answer ?? '',
  status: raw?.status ?? 'Active',
  page: raw?.page ?? '',
  serviceId: raw?.serviceId ?? '',
});

export const normalizeIndustry = (raw: any): Industry => ({
  ...raw,
  id: id(raw),
  title: raw?.title ?? '',
  description: raw?.description ?? '',
  image: raw?.image ?? '',
  segmentBenefits: Array.isArray(raw?.segmentBenefits) ? raw.segmentBenefits : [],
  status: raw?.status ?? 'Active',
  createdAt: createdAt(raw),
});

export const normalizeTeamMember = (raw: any): TeamMember => ({
  ...raw,
  id: id(raw),
  name: raw?.name ?? '',
  role: raw?.role ?? '',
  description: raw?.description ?? '',
  image: raw?.image ?? raw?.imageUrl ?? '',
  linkedinUrl: raw?.linkedinUrl ?? raw?.linkedin_url ?? '',
  twitterUrl: raw?.twitterUrl ?? raw?.twitter_url ?? '',
  status: raw?.status ?? 'Active',
  createdAt: createdAt(raw),
});
