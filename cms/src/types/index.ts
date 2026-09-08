/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'ContentWriter';
  status: 'Active' | 'Inactive';
  avatar?: string;
  createdAt: string;
}

export interface BlogContentBlock {
  type: 'heading' | 'paragraph' | 'list';
  text?: string;
  items?: string[];
}

export interface Blog {
  id: string;
  title: string;
  category: string;
  status: 'Published' | 'Draft';
  publishedAt: string;
  image: string;
  authorName?: string;
  content?: string;
  createdBy?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  status: 'Active' | 'Inactive';
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  status: 'Active' | 'Inactive';
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  image?: string;
  shortDescription?: string;
  technologies: string | string[];
  content?: string;
  status: 'Active' | 'Inactive';
  createdAt?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  subject: string;
  message: string;
  date: string;
  status: 'New' | 'Read' | 'Replied';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  message: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  status: 'Active' | 'Inactive';
  page?: string;
  serviceId?: string;
}

export interface Industry {
  id: string;
  title: string;
  description: string;
  image: string;
  icon?: string;
  segmentBenefits: string[];
  status: 'Active' | 'Inactive';
  createdAt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  image?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  status: 'Active' | 'Inactive';
  createdAt?: string;
}

export interface HomepageCms {
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  buttonText: string;
  happyClients?: string;
  industriesServed?: string;
  yearsExperience?: string;
  clientSatisfaction?: string;
}

export interface AboutCms {
  title: string;
  description: string;
  image: string;
}

export interface AppSettings {
  siteName: string;
  siteEmail: string;
  sitePhone: string;
  theme: 'Light' | 'Dark';
  logoUrl: string;
  socials: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  role?: string;
  password?: string;
}
