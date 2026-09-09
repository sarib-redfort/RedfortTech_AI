/**
 * CRUD clients for the admin resources.
 *
 * Each was previously ~60 hand-written lines with identical structure. They
 * are generated from `createCrudService` here; only the resource path and the
 * record normalizer differ.
 *
 * The exported method names (`getBlogs`, `createBlog`, …) are preserved so the
 * views read naturally at the call site.
 */
import { createCrudService } from '../lib/crud';
import type {
  Blog,
  CaseStudy,
  Faq,
  Industry,
  Service,
  TeamMember,
  Testimonial,
  User,
} from '../types';
import {
  normalizeBlog,
  normalizeCaseStudy,
  normalizeFaq,
  normalizeIndustry,
  normalizeService,
  normalizeTeamMember,
  normalizeTestimonial,
  normalizeUser,
} from './normalizers';

const users = createCrudService<User>({ resource: 'users', normalize: normalizeUser });
const blogs = createCrudService<Blog>({ resource: 'blogs', normalize: normalizeBlog });
const services = createCrudService<Service>({ resource: 'services', normalize: normalizeService });
const caseStudies = createCrudService<CaseStudy>({
  resource: 'case-studies',
  normalize: normalizeCaseStudy,
});
const testimonials = createCrudService<Testimonial>({
  resource: 'testimonials',
  normalize: normalizeTestimonial,
});
const industries = createCrudService<Industry>({
  resource: 'industries',
  normalize: normalizeIndustry,
});
const team = createCrudService<TeamMember>({ resource: 'team', normalize: normalizeTeamMember });
const faqs = createCrudService<Faq>({ resource: 'faqs', normalize: normalizeFaq });

export const userService = {
  getUsers: () => users.getAll(),
  getUser: (id: string) => users.getById(id),
  createUser: (payload: Omit<User, 'id' | 'createdAt'> & { password?: string }) =>
    users.create(payload),
  updateUser: (id: string, payload: Partial<User> & { password?: string }) =>
    users.update(id, payload),
  deleteUser: (id: string) => users.remove(id),
};

export const blogService = {
  getBlogs: () => blogs.getAll(),
  createBlog: (payload: Omit<Blog, 'id' | 'publishedAt'> | FormData) => blogs.create(payload),
  updateBlog: (id: string, payload: Partial<Blog> | FormData) => blogs.update(id, payload),
  deleteBlog: (id: string) => blogs.remove(id),
};

export const serviceService = {
  getServices: () => services.getAll(),
  createService: (payload: Omit<Service, 'id'> | FormData) => services.create(payload),
  updateService: (id: string, payload: Partial<Service> | FormData) => services.update(id, payload),
  deleteService: (id: string) => services.remove(id),
};

export const caseStudyService = {
  getCaseStudies: () => caseStudies.getAll(),
  createCaseStudy: (payload: Omit<CaseStudy, 'id' | 'createdAt'> | FormData) =>
    caseStudies.create(payload),
  updateCaseStudy: (id: string, payload: Partial<CaseStudy> | FormData) =>
    caseStudies.update(id, payload),
  deleteCaseStudy: (id: string) => caseStudies.remove(id),
};

export const testimonialService = {
  getTestimonials: () => testimonials.getAll(),
  createTestimonial: (payload: Omit<Testimonial, 'id'> | FormData) => testimonials.create(payload),
  updateTestimonial: (id: string, payload: Partial<Testimonial> | FormData) =>
    testimonials.update(id, payload),
  deleteTestimonial: (id: string) => testimonials.remove(id),
};

export const industryService = {
  getIndustries: () => industries.getAll(),
  createIndustry: (payload: FormData) => industries.create(payload),
  updateIndustry: (id: string, payload: FormData) => industries.update(id, payload),
  deleteIndustry: (id: string) => industries.remove(id),
};

export const teamMemberService = {
  getTeamMembers: () => team.getAll(),
  createTeamMember: (payload: FormData) => team.create(payload),
  updateTeamMember: (id: string, payload: FormData) => team.update(id, payload),
  deleteTeamMember: (id: string) => team.remove(id),
};

/**
 * FAQs send an explicit field list rather than the whole form object: `page`
 * must always be present, and `serviceId` must be omitted entirely (not sent
 * as an empty string) when the FAQ is not tied to a service, or the backend's
 * foreign key validation rejects it.
 */
const toFaqPayload = (faq: Partial<Faq>) => ({
  question: faq.question,
  answer: faq.answer,
  status: faq.status,
  page: faq.page || '',
  ...(faq.serviceId ? { serviceId: faq.serviceId } : {}),
});

export const faqService = {
  getFaqs: () => faqs.getAll(),
  createFaq: (faq: Omit<Faq, 'id'>) => faqs.create(toFaqPayload(faq)),
  updateFaq: (id: string, faq: Partial<Faq>) => faqs.update(id, toFaqPayload(faq)),
  deleteFaq: (id: string) => faqs.remove(id),
};
