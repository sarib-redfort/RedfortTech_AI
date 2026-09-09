export interface Service {
  id: string;
  image?: string;
  icon: string; // Lucide icon name as string
  title: string;
  shortDescription?: string;
  longDescription?: string;
  features?: string[];
  technologies?: string[];
  description?: string;
  status?: string;
  slug?: string;
}

export interface Industry {
  id: string;
  image: string;
  icon: string; // Lucide icon name as string
  title: string;
  description: string;
  benefits: string[];
}

export interface CaseStudy {
  id: string;
  image: string;
  title: string;
  problem: string;
  solution: string;
  technologyUsed: string[];
  result: string;
  statistics: string;
  clientFeedback: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  date: string;
  tags: string[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  image?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  social?: {
    linkedin?: string;
    twitter?: string;
  };
}

export interface Statistic {
  id: string;
  value: string;
  label: string;
}
