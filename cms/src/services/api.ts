/// <reference types="vite/client" />

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import axios from 'axios';
import { 
  User, 
  Blog, 
  Category, 
  Service, 
  CaseStudy,
  Contact, 
  Testimonial, 
  Faq, 
  HomepageCms, 
  AboutCms, 
  AppSettings, 
  UserProfile,
  Industry,
  TeamMember
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_BLOGS, 
  INITIAL_CATEGORIES, 
  INITIAL_SERVICES, 
  INITIAL_CASE_STUDIES,
  INITIAL_CONTACTS, 
  INITIAL_TESTIMONIALS, 
  INITIAL_FAQS, 
  INITIAL_HOMEPAGE, 
  INITIAL_ABOUT, 
  INITIAL_SETTINGS, 
  INITIAL_PROFILE,
  INITIAL_INDUSTRIES
} from '../constants';

// Configure Axios client (points to the backend API)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically inject JWT token from localStorage into headers if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Toggle dummy data mode. Leave it unset or set it to false to use the backend.
const USE_DUMMY_DATA = import.meta.env.VITE_USE_BACKEND === 'true';
const SIMULATE_DELAY = 600; // ms

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Resolves the currently logged-in admin's user id from every source available:
 * 1. The persisted user object in localStorage (set at login / profile update).
 * 2. Common alternative id field names returned by backends (_id, userId).
 * 3. The JWT token payload claims (id, _id, userId, sub).
 */
const resolveCurrentUserId = (): string | undefined => {
  // 1) Persisted user object
  try {
    const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
    const candidate = savedUser?.id ?? savedUser?._id ?? savedUser?.userId;
    if (candidate !== undefined && candidate !== null && `${candidate}`.trim() !== '') {
      return String(candidate);
    }
  } catch {
    // Ignore malformed stored user JSON.
  }

  // 2) JWT token payload claims
  try {
    const token = localStorage.getItem('token');
    const parts = token ? token.split('.') : [];
    if (parts.length === 3) {
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const claims = JSON.parse(atob(base64));
      const candidate = claims?.id ?? claims?._id ?? claims?.userId ?? claims?.sub;
      if (candidate !== undefined && candidate !== null && `${candidate}`.trim() !== '') {
        return String(candidate);
      }
    }
  } catch {
    // Ignore malformed/unreadable tokens.
  }

  return undefined;
};

// --- Auth Service ---
export const authService = {
  login: async (email: string, password: string): Promise<{ token: string; user: UserProfile }> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      if (email === 'admin@redforai.com' && password === 'admin123') {
        return {
          token: 'mock-jwt-token-123456',
          user: INITIAL_PROFILE
        };
      }
      throw new Error('Invalid email or password. Use: admin@redforai.com / admin123');
    } else {
      console.log('[LOGIN] Request payload:', { email, password });
      console.log('[LOGIN] API base URL:', API_BASE_URL);
      try { 
        const response = await apiClient.post('/auth/login', { email, password });
        console.log('[LOGIN] Response data:', response.data);

        const payload = response.data;
        const responseData = payload?.data ?? payload;
        const token = responseData?.token || responseData?.accessToken || responseData?.jwt || responseData?.authToken || payload?.token || payload?.accessToken || payload?.jwt || payload?.authToken;

        if (!token) {
          throw new Error(payload?.message || 'Login failed: no token received from server');
        }

        localStorage.setItem('token', token);

        const rawUser = responseData?.user || responseData?.profile || payload?.user || payload?.profile || INITIAL_PROFILE;
        // Backend responses often name the id differently (_id, userId, sub). Normalize it to `id`
        // so the profile/settings screens always have a user id available for updates.
        const rawUserId = rawUser?.id ?? rawUser?._id ?? rawUser?.userId ?? rawUser?.sub;
        const user = rawUserId !== undefined && rawUserId !== null
          ? { ...rawUser, id: String(rawUserId) }
          : rawUser;
        return { token, user: user as UserProfile };
      } catch (error: any) {
        console.error('[LOGIN] Request failed:', error);
        if (error?.response) {
          console.error('[LOGIN] Response status:', error.response.status);
          console.error('[LOGIN] Response data:', error.response.data);
        }
        throw error;
      }
    }
  }
};

// --- Dashboard Service ---
export const dashboardService = {
  getStats: async (): Promise<{
    counts: Record<string, number | string | undefined>;
    recentActivity: {
      contacts: Contact[];
      blogs: Blog[];
    };
  }> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return {
        counts: {
          users: 1248,
          blogs: 32,
          testimonials: 18,
          unreadContacts: 11,
          services: 14,
          faqs: 9,
          teamMembers: 7,
          industries: 6,
          caseStudies: 10,
        },
        recentActivity: {
          contacts: INITIAL_CONTACTS.slice(0, 3),
          blogs: INITIAL_BLOGS.slice(0, 3),
        },
      };
    }

    const response = await apiClient.get('/admin/dashboard/stats');
    const payload = response.data?.data ?? response.data;

    return {
      counts: payload?.counts ?? {},
      recentActivity: {
        contacts: Array.isArray(payload?.recentActivity?.contacts) ? payload.recentActivity.contacts : [],
        blogs: Array.isArray(payload?.recentActivity?.blogs) ? payload.recentActivity.blogs : [],
      },
    };
  },
};

// --- Users Service ---
const normalizeUserPayload = (payload: any) => {
  if (!payload || typeof payload !== 'object') return payload;

  if (Array.isArray(payload)) return payload;

  if (payload.data !== undefined) {
    return payload.data;
  }

  return payload;
};

export const userService = {
  getUsers: async (): Promise<User[]> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return INITIAL_USERS;
    } else {
      console.log('[USERS] Fetching users from backend');
      const response = await apiClient.get('/admin/users');
      console.log('[USERS] Get users response:', response.data);
      const payload = normalizeUserPayload(response.data);
      if (Array.isArray(payload)) return payload as User[];
      return (payload?.users || payload?.items || payload?.data || []) as User[];
    }
  },
  createUser: async (user: Omit<User, 'id' | 'createdAt'> & { password?: string }): Promise<User> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return {
        ...user,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
    } else {
      console.log('[USERS] Creating user with payload:', user);
      try {
        const response = await apiClient.post('/admin/users', user);
        console.log('[USERS] Create user response:', response.data);
        const payload = normalizeUserPayload(response.data);
        return (payload?.user || payload?.data || payload) as User;
      } catch (error: any) {
        console.error('[USERS] Create user failed:', error?.response?.data || error);
        throw error;
      }
    }
  },
  updateUser: async (id: string, user: Partial<User> & { password?: string }): Promise<User> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      const existing = INITIAL_USERS.find(u => u.id === id) || INITIAL_USERS[0];
      return { ...existing, ...user };
    } else {
      console.log('[USERS] Updating user', id, 'with payload:', user);
      const response = await apiClient.patch(`/admin/users/${id}`, user);
      console.log('[USERS] Update user response:', response.data);
      const payload = normalizeUserPayload(response.data);
      return (payload?.user || payload?.data || payload) as User;
    }
  },
  deleteUser: async (id: string): Promise<void> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      console.log(`Deleted user: ${id}`);
    } else {
      console.log('[USERS] Deleting user', id);
      const response = await apiClient.delete(`/admin/users/${id}`);
      console.log('[USERS] Delete user response:', response.data);
    }
  }
};

const normalizeBlogPayload = (payload: any): any => {
  if (!payload || typeof payload !== 'object') return payload;
  if (Array.isArray(payload)) return payload;
  if (payload.data !== undefined) return payload.data;
  if (payload.blogs !== undefined) return payload.blogs;
  if (payload.items !== undefined) return payload.items;
  return payload;
};

// --- Blogs Service ---
export const blogService = {
  getBlogs: async (): Promise<Blog[]> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return INITIAL_BLOGS;
    } else {
      console.log('[BLOGS] Fetching blogs from backend');
      const response = await apiClient.get('/admin/blogs');
      console.log('[BLOGS] Get blogs response:', response.data);
      const payload = normalizeBlogPayload(response.data);
      return (Array.isArray(payload) ? payload : payload?.blogs || payload?.data || []) as Blog[];
    }
  },
  createBlog: async (blog: Omit<Blog, 'id' | 'publishedAt'> | FormData): Promise<Blog> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return {
        ...(blog instanceof FormData ? {} : blog),
        id: Math.random().toString(36).substr(2, 9),
        publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      } as Blog;
    } else {
      console.log('[BLOGS] Creating blog with payload:', blog);
      const response = blog instanceof FormData
        ? await apiClient.post('/admin/blogs', blog, { headers: { 'Content-Type': 'multipart/form-data' } })
        : await apiClient.post('/admin/blogs', blog);
      console.log('[BLOGS] Create blog response:', response.data);
      const payload = normalizeBlogPayload(response.data);
      return (payload?.blog || payload?.data || payload) as Blog;
    }
  },
  updateBlog: async (id: string, blog: Partial<Blog> | FormData): Promise<Blog> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      const existing = INITIAL_BLOGS.find(b => b.id === id) || INITIAL_BLOGS[0];
      return { ...existing, ...(blog instanceof FormData ? {} : blog) };
    } else {
      console.log('[BLOGS] Updating blog', id, 'with payload:', blog);
      const response = blog instanceof FormData
        ? await apiClient.patch(`/admin/blogs/${id}`, blog, { headers: { 'Content-Type': 'multipart/form-data' } })
        : await apiClient.patch(`/admin/blogs/${id}`, blog);
      console.log('[BLOGS] Update blog response:', response.data);
      const payload = normalizeBlogPayload(response.data);
      return (payload?.blog || payload?.data || payload) as Blog;
    }
  },
  deleteBlog: async (id: string): Promise<void> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      console.log(`Deleted blog: ${id}`);
    } else {
      await apiClient.delete(`/admin/blogs/${id}`);
    }
  }
};

// --- Categories Service ---
export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return INITIAL_CATEGORIES;
    } else {
      const response = await apiClient.get('/categories');
      return response.data;
    }
  },
  createCategory: async (category: Omit<Category, 'id'>): Promise<Category> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return {
        ...category,
        id: Math.random().toString(36).substr(2, 9)
      };
    } else {
      const response = await apiClient.post('/categories', category);
      return response.data;
    }
  },
  updateCategory: async (id: string, category: Partial<Category>): Promise<Category> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      const existing = INITIAL_CATEGORIES.find(c => c.id === id) || INITIAL_CATEGORIES[0];
      return { ...existing, ...category };
    } else {
      const response = await apiClient.patch(`/categories/${id}`, category);
      return response.data;
    }
  },
  deleteCategory: async (id: string): Promise<void> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      console.log(`Deleted category: ${id}`);
    } else {
      await apiClient.delete(`/categories/${id}`);
    }
  }
};

const normalizeServicePayload = (payload: any): any => {
  if (!payload || typeof payload !== 'object') return payload;
  if (Array.isArray(payload)) return payload;
  if (payload.data !== undefined) return payload.data;
  if (payload.services !== undefined) return payload.services;
  if (payload.items !== undefined) return payload.items;
  return payload;
};

// --- Services Service ---
export const serviceService = {
  getServices: async (): Promise<Service[]> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return INITIAL_SERVICES;
    } else {
      const response = await apiClient.get('/admin/services');
      const payload = normalizeServicePayload(response.data);
      const services = (Array.isArray(payload) ? payload : payload?.services || payload?.data || []) as any[];
      return services.map((service: any) => ({
        ...service,
        id: service.id || service._id,
        title: service.title || '',
        description: service.description || '',
        icon: service.icon || '',
        status: service.status || 'Active',
      })) as Service[];
    }
  },
  createService: async (service: Omit<Service, 'id'>): Promise<Service> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return {
        ...service,
        id: Math.random().toString(36).substr(2, 9)
      };
    } else {
      const response = await apiClient.post('/admin/services', {
        title: service.title,
        description: service.description,
        icon: service.icon,
        status: service.status,
      });
      const payload = normalizeServicePayload(response.data);
      const createdService = payload?.service || payload?.data || payload;
      return {
        ...createdService,
        id: createdService.id || createdService._id,
        title: createdService.title || '',
        description: createdService.description || '',
        icon: createdService.icon || '',
        status: createdService.status || 'Active',
      } as Service;
    }
  },
  updateService: async (id: string, service: Partial<Service>): Promise<Service> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      const existing = INITIAL_SERVICES.find(s => s.id === id) || INITIAL_SERVICES[0];
      return { ...existing, ...service };
    } else {
      const response = await apiClient.patch(`/admin/services/${id}`, {
        title: service.title,
        description: service.description,
        icon: service.icon,
        status: service.status,
      });
      const payload = normalizeServicePayload(response.data);
      const updatedService = payload?.service || payload?.data || payload;
      return {
        ...updatedService,
        id: updatedService.id || updatedService._id,
        title: updatedService.title || '',
        description: updatedService.description || '',
        icon: updatedService.icon || '',
        status: updatedService.status || 'Active',
      } as Service;
    }
  },
  deleteService: async (id: string): Promise<void> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      console.log(`Deleted service: ${id}`);
    } else {
      await apiClient.delete(`/admin/services/${id}`);
    }
  }
};

// --- Case Studies Service ---
const normalizeCaseStudyPayload = (payload: any): any => {
  if (!payload || typeof payload !== 'object') return payload;
  if (Array.isArray(payload)) return payload;
  if (payload.data !== undefined) return payload.data;
  if (payload.caseStudies !== undefined) return payload.caseStudies;
  if (payload.items !== undefined) return payload.items;
  return payload;
};

export const caseStudyService = {
  getCaseStudies: async (): Promise<CaseStudy[]> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return INITIAL_CASE_STUDIES;
    } else {
      const response = await apiClient.get('/admin/case-studies');
      const payload = normalizeCaseStudyPayload(response.data);
      const caseStudies = (Array.isArray(payload) ? payload : payload?.caseStudies || payload?.data || []) as any[];
      return caseStudies.map((item: any) => ({
        ...item,
        id: item.id || item._id,
        title: item.title || '',
        slug: item.slug || '',
        image: item.image || item.imageUrl || '',
        shortDescription: item.shortDescription || item.short_description || '',
        technologies: item.technologies || [],
        content: item.content || '',
        status: item.status || 'Active',
        createdAt: item.createdAt || item.created_at || item.createdAt || '',
      })) as CaseStudy[];
    }
  },
  createCaseStudy: async (caseStudy: Omit<CaseStudy, 'id' | 'createdAt'> | FormData): Promise<CaseStudy> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      const safeCaseStudy = caseStudy instanceof FormData ? {} : caseStudy;
      return {
        ...(safeCaseStudy as Omit<CaseStudy, 'id' | 'createdAt'>),
        id: Math.random().toString(36).substr(2, 9),
        slug: (safeCaseStudy as Omit<CaseStudy, 'id' | 'createdAt'>).title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substr(2, 5),
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      } as CaseStudy;
    } else {
      const response = caseStudy instanceof FormData
        ? await apiClient.post('/admin/case-studies', caseStudy)
        : await apiClient.post('/admin/case-studies', caseStudy);
      const payload = normalizeCaseStudyPayload(response.data);
      const createdCaseStudy = payload?.caseStudy || payload?.data || payload;
      return {
        ...createdCaseStudy,
        id: createdCaseStudy.id || createdCaseStudy._id,
        title: createdCaseStudy.title || '',
        slug: createdCaseStudy.slug || '',
        image: createdCaseStudy.image || createdCaseStudy.imageUrl || '',
        shortDescription: createdCaseStudy.shortDescription || createdCaseStudy.short_description || '',
        technologies: createdCaseStudy.technologies || [],
        content: createdCaseStudy.content || '',
        status: createdCaseStudy.status || 'Active',
        createdAt: createdCaseStudy.createdAt || createdCaseStudy.created_at || '',
      } as CaseStudy;
    }
  },
  updateCaseStudy: async (id: string, caseStudy: Partial<CaseStudy> | FormData): Promise<CaseStudy> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      const existing = INITIAL_CASE_STUDIES.find(cs => cs.id === id) || INITIAL_CASE_STUDIES[0];
      return { ...existing, ...(caseStudy instanceof FormData ? {} : caseStudy) };
    } else {
      const response = caseStudy instanceof FormData
        ? await apiClient.patch(`/admin/case-studies/${id}`, caseStudy)
        : await apiClient.patch(`/admin/case-studies/${id}`, caseStudy);
      const payload = normalizeCaseStudyPayload(response.data);
      const updatedCaseStudy = payload?.caseStudy || payload?.data || payload;
      return {
        ...updatedCaseStudy,
        id: updatedCaseStudy.id || updatedCaseStudy._id,
        title: updatedCaseStudy.title || '',
        slug: updatedCaseStudy.slug || '',
        image: updatedCaseStudy.image || updatedCaseStudy.imageUrl || '',
        shortDescription: updatedCaseStudy.shortDescription || updatedCaseStudy.short_description || '',
        technologies: updatedCaseStudy.technologies || [],
        content: updatedCaseStudy.content || '',
        status: updatedCaseStudy.status || 'Active',
        createdAt: updatedCaseStudy.createdAt || updatedCaseStudy.created_at || '',
      } as CaseStudy;
    }
  },
  deleteCaseStudy: async (id: string): Promise<void> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      console.log(`Deleted case study: ${id}`);
    } else {
      await apiClient.delete(`/admin/case-studies/${id}`);
    }
  }
};

const normalizeContactPayload = (payload: any): any => {
  if (!payload || typeof payload !== 'object') return payload;
  if (Array.isArray(payload)) return payload;
  if (payload.data !== undefined) return payload.data;
  if (payload.contacts !== undefined) return payload.contacts;
  if (payload.items !== undefined) return payload.items;
  return payload;
};

// --- Contacts Service ---
export const contactService = {
  getContacts: async (): Promise<Contact[]> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return INITIAL_CONTACTS;
    } else {
      const response = await apiClient.get('/admin/contacts');
      const payload = normalizeContactPayload(response.data);
      const contacts = (Array.isArray(payload) ? payload : payload?.contacts || payload?.data || []) as any[];
      return contacts.map((contact: any) => ({
        ...contact,
        id: contact.id || contact._id,
        name: contact.name || contact.fullName || 'Unknown',
        email: contact.email || '',
        phoneNumber: contact.phoneNumber || contact.phone || contact.contactNumber || '',
        subject: contact.subject || 'No subject',
        message: contact.message || '',
        date: contact.date || contact.createdAt || contact.created_at || '',
        status: contact.status || 'New',
      })) as Contact[];
    }
  },
  updateStatus: async (id: string, status: Contact['status']): Promise<Contact> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      const existing = INITIAL_CONTACTS.find(c => c.id === id) || INITIAL_CONTACTS[0];
      return { ...existing, status };
    } else {
      const response = await apiClient.patch(`/admin/contacts/${id}/status`, { status });
      const payload = normalizeContactPayload(response.data);
      const contact = payload?.contact || payload?.data || payload;
      return {
        ...contact,
        id: contact.id || contact._id,
        name: contact.name || contact.fullName || 'Unknown',
        email: contact.email || '',
        phoneNumber: contact.phoneNumber || contact.phone || contact.contactNumber || '',
        subject: contact.subject || 'No subject',
        message: contact.message || '',
        date: contact.date || contact.createdAt || contact.created_at || '',
        status: contact.status || 'New',
      } as Contact;
    }
  },
  deleteContact: async (id: string): Promise<void> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      console.log(`Deleted contact: ${id}`);
    } else {
      await apiClient.delete(`/admin/contacts/${id}`);
    }
  }
};

const normalizeTestimonialPayload = (payload: any): any => {
  if (!payload || typeof payload !== 'object') return payload;
  if (Array.isArray(payload)) return payload;
  if (payload.data !== undefined) return payload.data;
  if (payload.testimonial !== undefined) return payload.testimonial;
  return payload;
};

// --- Testimonials Service ---
export const testimonialService = {
  getTestimonials: async (): Promise<Testimonial[]> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return INITIAL_TESTIMONIALS;
    } else {
      const response = await apiClient.get('/admin/testimonials');
      const payload = normalizeTestimonialPayload(response.data);
      return (Array.isArray(payload) ? payload : payload?.testimonials || payload?.data || []) as Testimonial[];
    }
  },
  createTestimonial: async (testimonial: Omit<Testimonial, 'id'> | FormData): Promise<Testimonial> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      const payload = testimonial instanceof FormData ? {} : testimonial;
      return {
        ...payload,
        id: Math.random().toString(36).substr(2, 9)
      } as Testimonial;
    } else {
      const response = testimonial instanceof FormData
        ? await apiClient.post('/admin/testimonials', testimonial, { headers: { 'Content-Type': 'multipart/form-data' } })
        : await apiClient.post('/admin/testimonials', testimonial);
      const payload = normalizeTestimonialPayload(response.data);
      return (payload?.testimonial || payload?.data || payload) as Testimonial;
    }
  },
  updateTestimonial: async (id: string, testimonial: Partial<Testimonial> | FormData): Promise<Testimonial> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      const existing = INITIAL_TESTIMONIALS.find(t => t.id === id) || INITIAL_TESTIMONIALS[0];
      return { ...existing, ...(testimonial instanceof FormData ? {} : testimonial) };
    } else {
      const response = testimonial instanceof FormData
        ? await apiClient.patch(`/admin/testimonials/${id}`, testimonial, { headers: { 'Content-Type': 'multipart/form-data' } })
        : await apiClient.patch(`/admin/testimonials/${id}`, testimonial);
      const payload = normalizeTestimonialPayload(response.data);
      return (payload?.testimonial || payload?.data || payload) as Testimonial;
    }
  },
  deleteTestimonial: async (id: string): Promise<void> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      console.log(`Deleted testimonial: ${id}`);
    } else {
      await apiClient.delete(`/admin/testimonials/${id}`);
    }
  }
};

const normalizeTeamMemberPayload = (payload: any): any => {
  if (!payload || typeof payload !== 'object') return payload;
  if (Array.isArray(payload)) return payload;
  if (payload.data !== undefined) return payload.data;
  if (payload.teamMembers !== undefined) return payload.teamMembers;
  if (payload.items !== undefined) return payload.items;
  return payload;
};

export const teamMemberService = {
  getTeamMembers: async (): Promise<TeamMember[]> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return [];
    } else {
      const response = await apiClient.get('/admin/team');
      const payload = normalizeTeamMemberPayload(response.data);
      const teamMembers = (Array.isArray(payload) ? payload : payload?.teamMembers || payload?.data || []) as any[];
      return teamMembers.map((member: any) => ({
        ...member,
        id: member.id || member._id,
        name: member.name || '',
        role: member.role || '',
        description: member.description || '',
        image: member.image || member.imageUrl || '',
        linkedinUrl: member.linkedinUrl || member.linkedin_url || '',
        twitterUrl: member.twitterUrl || member.twitter_url || '',
        status: member.status || 'Active',
        createdAt: member.createdAt || member.created_at || '',
      })) as TeamMember[];
    }
  },
  createTeamMember: async (teamMember: FormData): Promise<TeamMember> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: '',
        role: '',
        description: '',
        status: 'Active',
      } as TeamMember;
    } else {
      const response = await apiClient.post('/admin/team', teamMember, { headers: { 'Content-Type': 'multipart/form-data' } });
      const payload = normalizeTeamMemberPayload(response.data);
      const createdMember = payload?.teamMember || payload?.data || payload;
      return {
        ...createdMember,
        id: createdMember.id || createdMember._id,
        name: createdMember.name || '',
        role: createdMember.role || '',
        description: createdMember.description || '',
        image: createdMember.image || createdMember.imageUrl || '',
        linkedinUrl: createdMember.linkedinUrl || createdMember.linkedin_url || '',
        twitterUrl: createdMember.twitterUrl || createdMember.twitter_url || '',
        status: createdMember.status || 'Active',
        createdAt: createdMember.createdAt || createdMember.created_at || '',
      } as TeamMember;
    }
  },
  updateTeamMember: async (id: string, teamMember: FormData): Promise<TeamMember> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return {
        id,
        name: '',
        role: '',
        description: '',
        status: 'Active',
      } as TeamMember;
    } else {
      const response = await apiClient.patch(`/admin/team/${id}`, teamMember, { headers: { 'Content-Type': 'multipart/form-data' } });
      const payload = normalizeTeamMemberPayload(response.data);
      const updatedMember = payload?.teamMember || payload?.data || payload;
      return {
        ...updatedMember,
        id: updatedMember.id || updatedMember._id || id,
        name: updatedMember.name || '',
        role: updatedMember.role || '',
        description: updatedMember.description || '',
        image: updatedMember.image || updatedMember.imageUrl || '',
        linkedinUrl: updatedMember.linkedinUrl || updatedMember.linkedin_url || '',
        twitterUrl: updatedMember.twitterUrl || updatedMember.twitter_url || '',
        status: updatedMember.status || 'Active',
        createdAt: updatedMember.createdAt || updatedMember.created_at || '',
      } as TeamMember;
    }
  },
  deleteTeamMember: async (id: string): Promise<void> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      console.log(`Deleted team member: ${id}`);
    } else {
      await apiClient.delete(`/admin/team/${id}`);
    }
  }
};

const normalizeFaqPayload = (payload: any): any => {
  if (!payload || typeof payload !== 'object') return payload;
  if (Array.isArray(payload)) return payload;
  if (payload.data !== undefined) return payload.data;
  if (payload.faqs !== undefined) return payload.faqs;
  if (payload.items !== undefined) return payload.items;
  return payload;
};

// --- FAQs Service ---
export const faqService = {
  getFaqs: async (): Promise<Faq[]> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return INITIAL_FAQS;
    } else {
      const response = await apiClient.get('/admin/faqs');
      const payload = normalizeFaqPayload(response.data);
      const faqs = (Array.isArray(payload) ? payload : payload?.faqs || payload?.data || []) as any[];
      return faqs.map((faq: any) => ({
        ...faq,
        id: faq.id || faq._id,
        question: faq.question || '',
        answer: faq.answer || '',
        status: faq.status || 'Active',
        page: faq.page || '',
        serviceId: faq.serviceId || '',
      })) as Faq[];
    }
  },
  createFaq: async (faq: Omit<Faq, 'id'>): Promise<Faq> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return {
        ...faq,
        id: Math.random().toString(36).substr(2, 9)
      };
    } else {
      const response = await apiClient.post('/admin/faqs', {
        question: faq.question,
        answer: faq.answer,
        status: faq.status,
        page: faq.page || '',
        ...(faq.serviceId ? { serviceId: faq.serviceId } : {}),
      });
      const payload = normalizeFaqPayload(response.data);
      const createdFaq = payload?.faq || payload?.data || payload;
      return {
        ...createdFaq,
        id: createdFaq.id || createdFaq._id,
        question: createdFaq.question || '',
        answer: createdFaq.answer || '',
        status: createdFaq.status || 'Active',
        page: createdFaq.page || '',
        serviceId: createdFaq.serviceId || '',
      } as Faq;
    }
  },
  updateFaq: async (id: string, faq: Partial<Faq>): Promise<Faq> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      const existing = INITIAL_FAQS.find(f => f.id === id) || INITIAL_FAQS[0];
      return { ...existing, ...faq };
    } else {
      const response = await apiClient.patch(`/admin/faqs/${id}`, {
        question: faq.question,
        answer: faq.answer,
        status: faq.status,
        page: faq.page || '',
        ...(faq.serviceId ? { serviceId: faq.serviceId } : {}),
      });
      const payload = normalizeFaqPayload(response.data);
      const updatedFaq = payload?.faq || payload?.data || payload;
      return {
        ...updatedFaq,
        id: updatedFaq.id || updatedFaq._id,
        question: updatedFaq.question || '',
        answer: updatedFaq.answer || '',
        status: updatedFaq.status || 'Active',
        page: updatedFaq.page || '',
        serviceId: updatedFaq.serviceId || '',
      } as Faq;
    }
  },
  deleteFaq: async (id: string): Promise<void> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      console.log(`Deleted faq: ${id}`);
    } else {
      await apiClient.delete(`/admin/faqs/${id}`);
    }
  }
};

// --- CMS Homepage Service ---
export const homepageCmsService = {
  getHomepage: async (): Promise<HomepageCms> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return INITIAL_HOMEPAGE;
    } else {
      const response = await apiClient.get('/cms/homepage');
      return response.data;
    }
  },
  updateHomepage: async (data: HomepageCms): Promise<HomepageCms> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return data;
    } else {
      const response = await apiClient.patch('/cms/homepage', data);
      return response.data;
    }
  }
};

// --- CMS About Service ---
export const aboutCmsService = {
  getAbout: async (): Promise<AboutCms> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return INITIAL_ABOUT;
    } else {
      const response = await apiClient.get('/cms/about');
      return response.data;
    }
  },
  updateAbout: async (data: AboutCms): Promise<AboutCms> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return data;
    } else {
      const response = await apiClient.patch('/cms/about', data);
      return response.data;
    }
  }
};

// --- Settings Service ---
export const settingsService = {
  getSettings: async (): Promise<AppSettings> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return INITIAL_SETTINGS;
    } else {
      const response = await apiClient.get('/cms/settings');
      return response.data;
    }
  },
  updateSettings: async (data: AppSettings): Promise<AppSettings> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return data;
    } else {
      const response = await apiClient.patch('/cms/settings', data);
      return response.data;
    }
  }
};

// --- Profile Service ---
export const profileService = {
  getProfile: async (userId?: string): Promise<UserProfile> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return INITIAL_PROFILE;
    } else {
      // Fall back to the persisted user / JWT claims when no id is passed in.
      const resolvedId = userId || resolveCurrentUserId();
      if (!resolvedId) {
        throw new Error('User ID is required to load profile');
      }
      const response = await apiClient.get(`/admin/users/${resolvedId}`);
      return response.data;
    }
  },
  updateProfile: async (data: Partial<UserProfile> & { id?: string; password?: string }): Promise<UserProfile> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return data as UserProfile;
    } else {
      const { id, ...payload } = data;
      // Fall back to the persisted user / JWT claims when the caller has no id in state.
      const resolvedId = id || resolveCurrentUserId();
      if (!resolvedId) {
        throw new Error('User ID is required to update profile');
      }
      const response = await apiClient.patch(`/admin/users/${resolvedId}`, payload);
      return response.data;
    }
  },
  changePassword: async (currentPass: string, newPass: string, userId?: string): Promise<void> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      console.log(`Changed password from ${currentPass} to ${newPass}`);
    } else {
      // Fall back to the persisted user / JWT claims when no id is passed in.
      const resolvedId = userId || resolveCurrentUserId();
      if (!resolvedId) {
        throw new Error('User ID is required to change password');
      }
      await apiClient.patch(`/admin/users/${resolvedId}`, { password: newPass });
    }
  }
};

const normalizeIndustryPayload = (payload: any): any => {
  if (!payload || typeof payload !== 'object') return payload;
  if (Array.isArray(payload)) return payload;
  if (payload.data !== undefined) return payload.data;
  if (payload.industries !== undefined) return payload.industries;
  if (payload.items !== undefined) return payload.items;
  return payload;
};

// --- Industries Service ---
export const industryService = {
  getIndustries: async (): Promise<Industry[]> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return INITIAL_INDUSTRIES;
    } else {
      console.log('[INDUSTRIES] Fetching industries from backend');
      const response = await apiClient.get('/admin/industries');
      console.log('[INDUSTRIES] Get industries response:', response.data);
      const payload = normalizeIndustryPayload(response.data);
      const industries = (Array.isArray(payload) ? payload : payload?.industries || payload?.data || []) as any[];
      return industries.map((industry: any) => ({
        ...industry,
        id: industry.id || industry._id,
        title: industry.title || '',
        description: industry.description || '',
        image: industry.image || '',
        segmentBenefits: Array.isArray(industry.segmentBenefits) ? industry.segmentBenefits : [],
        status: industry.status || 'Active',
        createdAt: industry.createdAt || industry.created_at || '',
      })) as Industry[];
    }
  },
  createIndustry: async (industry: FormData): Promise<Industry> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return {
        id: Math.random().toString(36).substr(2, 9),
        title: industry.get('title') as string || '',
        description: industry.get('description') as string || '',
        image: industry.get('image') as string || '',
        segmentBenefits: JSON.parse(industry.get('segmentBenefits') as string || '[]'),
        status: ((industry.get('status') as string) || 'Active') as 'Active' | 'Inactive',
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
    } else {
      console.log('[INDUSTRIES] Creating industry with FormData');
      const response = await apiClient.post('/admin/industries', industry, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('[INDUSTRIES] Create industry response:', response.data);
      const payload = normalizeIndustryPayload(response.data);
      const createdIndustry = payload?.industry || payload?.data || payload;
      return {
        ...createdIndustry,
        id: createdIndustry.id || createdIndustry._id,
        title: createdIndustry.title || '',
        description: createdIndustry.description || '',
        image: createdIndustry.image || '',
        segmentBenefits: Array.isArray(createdIndustry.segmentBenefits) ? createdIndustry.segmentBenefits : [],
        status: createdIndustry.status || 'Active',
        createdAt: createdIndustry.createdAt || createdIndustry.created_at || '',
      } as Industry;
    }
  },
  updateIndustry: async (id: string, industry: FormData): Promise<Industry> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      return {
        id,
        title: industry.get('title') as string || '',
        description: industry.get('description') as string || '',
        image: industry.get('image') as string || '',
        segmentBenefits: JSON.parse(industry.get('segmentBenefits') as string || '[]'),
        status: ((industry.get('status') as string) || 'Active') as 'Active' | 'Inactive',
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
    } else {
      console.log('[INDUSTRIES] Updating industry', id, 'with FormData');
      const response = await apiClient.patch(`/admin/industries/${id}`, industry, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('[INDUSTRIES] Update industry response:', response.data);
      const payload = normalizeIndustryPayload(response.data);
      const updatedIndustry = payload?.industry || payload?.data || payload;
      return {
        ...updatedIndustry,
        id: updatedIndustry.id || updatedIndustry._id,
        title: updatedIndustry.title || '',
        description: updatedIndustry.description || '',
        image: updatedIndustry.image || '',
        segmentBenefits: Array.isArray(updatedIndustry.segmentBenefits) ? updatedIndustry.segmentBenefits : [],
        status: updatedIndustry.status || 'Active',
        createdAt: updatedIndustry.createdAt || updatedIndustry.created_at || '',
      } as Industry;
    }
  },
  deleteIndustry: async (id: string): Promise<void> => {
    if (USE_DUMMY_DATA) {
      await sleep(SIMULATE_DELAY);
      console.log(`Deleted industry: ${id}`);
    } else {
      console.log('[INDUSTRIES] Deleting industry', id);
      await apiClient.delete(`/admin/industries/${id}`);
    }
  }
};
