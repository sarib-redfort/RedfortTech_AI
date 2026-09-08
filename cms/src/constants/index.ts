/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  Industry
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@redforai.com',
    role: 'Admin',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    createdAt: 'May 20, 2024'
  },
  {
    id: '2',
    name: 'Muhammad Ali',
    email: 'ali@example.com',
    role: 'User',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    createdAt: 'May 18, 2024'
  },
  {
    id: '3',
    name: 'Ayesha Khan',
    email: 'ayesha@example.com',
    role: 'User',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    createdAt: 'May 16, 2024'
  },
  {
    id: '4',
    name: 'Usman Raza',
    email: 'usman@example.com',
    role: 'User',
    status: 'Inactive',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    createdAt: 'May 15, 2024'
  },
  {
    id: '5',
    name: 'Hassan Ali',
    email: 'hassan@example.com',
    role: 'User',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80',
    createdAt: 'May 15, 2024'
  }
];

export const INITIAL_BLOGS: Blog[] = [
  {
    id: '1',
    title: 'The Future of AI',
    category: 'Technology',
    status: 'Published',
    publishedAt: 'May 20, 2024',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=400&h=250&q=80',
    content: 'Artificial Intelligence is evolving at an unprecedented pace...'
  },
  {
    id: '2',
    title: 'How AI is Transforming Business',
    category: 'AI',
    status: 'Published',
    publishedAt: 'May 18, 2024',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&h=250&q=80',
    content: 'From automation to analytics, businesses are leveraging AI to...'
  },
  {
    id: '3',
    title: 'The Power of Machine Learning',
    category: 'Machine Learning',
    status: 'Draft',
    publishedAt: 'May 16, 2024',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=400&h=250&q=80',
    content: 'Machine Learning algorithms form the bedrock of modern prediction engines...'
  },
  {
    id: '4',
    title: 'RedForAI Platform Update',
    category: 'Updates',
    status: 'Published',
    publishedAt: 'May 15, 2024',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&h=250&q=80',
    content: 'We are thrilled to launch our new dashboard experience with robust monitoring...'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Technology', slug: 'technology', status: 'Active' },
  { id: '2', name: 'AI', slug: 'ai', status: 'Active' },
  { id: '3', name: 'Machine Learning', slug: 'machine-learning', status: 'Active' },
  { id: '4', name: 'Updates', slug: 'updates', status: 'Active' },
  { id: '5', name: 'Business', slug: 'business', status: 'Inactive' }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: '1',
    title: 'AI Development',
    description: 'Build intelligent AI solutions tailored to scale your enterprise efficiency.',
    icon: 'Cpu',
    status: 'Active'
  },
  {
    id: '2',
    title: 'Web Development',
    description: 'Modern, highly responsive, secure and search engine optimized websites.',
    icon: 'Globe',
    status: 'Active'
  },
  {
    id: '3',
    title: 'Mobile Development',
    description: 'Cross-platform mobile applications crafted with high-performance native experiences.',
    icon: 'Smartphone',
    status: 'Active'
  },
  {
    id: '4',
    title: 'UI/UX Design',
    description: 'Beautiful, seamless user interfaces centered on human interaction patterns.',
    icon: 'Palette',
    status: 'Active'
  },
  {
    id: '5',
    title: 'SEO Optimization',
    description: 'Improve search visibility, increase traffic, and grow domain authority organically.',
    icon: 'TrendingUp',
    status: 'Active'
  },
  {
    id: '6',
    title: 'Cloud Solutions',
    description: 'Scalable cloud infrastructure hosting, microservices orchestrations, and deployments.',
    icon: 'Cloud',
    status: 'Active'
  }
];

export const INITIAL_CASE_STUDIES: CaseStudy[] = [
  {
    id: '1',
    title: 'E-commerce Platform Redesign',
    slug: 'e-commerce-platform-redesign-abc12',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&q=80',
    technologies: 'React, Tailwind CSS, NestJS, PostgreSQL',
    content: '<h2>Project Overview</h2><p>Our client wanted to overhaul their legacy e-commerce application. We redesigned the UX/UI and engineered a blazingly fast full-stack platform.</p><h3>Results achieved:</h3><ul><li>80% improvement in page loading speeds</li><li>45% increase in online conversion rates</li><li>Reduced infrastructure hosting costs by 30%</li></ul>',
    status: 'Active',
    createdAt: 'May 10, 2024'
  },
  {
    id: '2',
    title: 'Fintech Automated Ledger',
    slug: 'fintech-automated-ledger-xyz89',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=250&fit=crop&q=80',
    technologies: 'Node.js, Express, Docker, Redis, AWS',
    content: '<h2>Project Overview</h2><p>This financial technology client required a high-throughput transaction ledger with real-time auditability. We built a distributed, event-driven ledger system capable of processing 10k transactions per second.</p>',
    status: 'Active',
    createdAt: 'Apr 24, 2024'
  }
];

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Ali Raza',
    email: 'ali@example.com',
    subject: 'General Inquiry',
    message: 'Hello, I want to learn more about your premium AI consulting service packages.',
    date: 'May 20, 2024',
    status: 'New'
  },
  {
    id: '2',
    name: 'Sara Khan',
    email: 'sara@example.com',
    subject: 'Support',
    message: 'I am experiencing some latency issues when integrating the cloud vision pipelines.',
    date: 'May 18, 2024',
    status: 'Read'
  },
  {
    id: '3',
    name: 'Usman Ahmad',
    email: 'usman@example.com',
    subject: 'Partnership',
    message: 'We want to co-author an academic research study on neural network optimization.',
    date: 'May 16, 2024',
    status: 'Replied'
  },
  {
    id: '4',
    name: 'Ayesha Malik',
    email: 'ayesha@example.com',
    subject: 'Career Inquiry',
    message: 'Are you currently looking for remote senior graphics engineers?',
    date: 'May 15, 2024',
    status: 'New'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Muhammad Usman',
    role: 'CEO, TechCorp',
    company: 'TechCorp',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    rating: 5,
    message: 'RedForAI provided an exceptionally smooth integration path for our ML pipelines.'
  },
  {
    id: '2',
    name: 'Ayesha Khan',
    role: 'Marketing Head',
    company: 'Fintech Solutions',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    rating: 5,
    message: 'Outstanding team with deep, expert-level AI capability.'
  },
  {
    id: '3',
    name: 'John Smith',
    role: 'CTO, DevSoft',
    company: 'DevSoft',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    rating: 5,
    message: 'Professional and reliable service with highly optimized, clean deliverables.'
  }
];

export const INITIAL_FAQS: Faq[] = [
  {
    id: '1',
    question: 'What services do you offer?',
    answer: 'We provide specialized consulting across custom AI development, web pipelines, cloud infrastructure design, and secure mobile application architecture.',
    status: 'Active'
  },
  {
    id: '2',
    question: 'How can I contact support?',
    answer: 'You can submit queries through the Contacts tab in our CMS panel, or email our support desk directly at support@redforai.com.',
    status: 'Active'
  },
  {
    id: '3',
    question: 'Do you offer custom solutions?',
    answer: 'Yes, we perform complete discovery phases and structure bespoke enterprise products from start to finish.',
    status: 'Active'
  },
  {
    id: '4',
    question: 'What technologies do you use?',
    answer: 'Our main frameworks center on React, Next.js, Node.js, Python, TensorFlow, PyTorch, and Google Cloud Platform services.',
    status: 'Active'
  }
];

export const INITIAL_HOMEPAGE: HomepageCms = {
  heroTitle: 'AI Solutions for Your Business',
  heroDescription: 'We build intelligent solutions that help your business grow smarter and faster.',
  heroImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&h=500&q=80',
  buttonText: 'Get Started',
  happyClients: '500+',
  industriesServed: '12+',
  yearsExperience: '8+',
  clientSatisfaction: '99%'
};

export const INITIAL_ABOUT: AboutCms = {
  title: 'About RedForAI',
  description: 'We are a team of passionate developers and AI experts building the future.',
  image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&h=500&q=80'
};

export const INITIAL_SETTINGS: AppSettings = {
  siteName: 'RedForAI',
  siteEmail: 'info@redforai.com',
  sitePhone: '+92 300 1234567',
  theme: 'Light',
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&h=100&q=80',
  socials: {
    facebook: 'https://facebook.com/redforai',
    twitter: 'https://twitter.com/redforai',
    linkedin: 'https://linkedin.com/company/redforai'
  }
};

export const INITIAL_PROFILE: UserProfile = {
  id: '1',
  name: 'Admin User',
  email: 'admin@redforai.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
  role: 'Administrator'
};

export const INITIAL_INDUSTRIES: Industry[] = [];
