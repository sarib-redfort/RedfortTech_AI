/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Users, BookOpen, Star, MessageSquare, Clock, ArrowRight, Mail, Briefcase, CircleHelp, Users2, Building2, FolderKanban } from 'lucide-react';
import StatCard from '../cards/StatCard';
import { Blog, Contact, Testimonial } from '../../types';
import { normalizeImageUrl } from '../../utils/image';
import { dashboardService } from '../../services/api';

interface DashboardViewProps {
  blogs: Blog[];
  contacts: Contact[];
  testimonials: Testimonial[];
  onNavigateToTab: (tab: string) => void;
  onViewContact: (contact: Contact) => void;
}

export default function DashboardView({
  blogs,
  contacts,
  testimonials,
  onNavigateToTab,
  onViewContact,
}: DashboardViewProps) {
  const [dashboardStats, setDashboardStats] = useState<{
    counts: Record<string, number | string | undefined>;
    recentActivity: {
      contacts: Contact[];
      blogs: Blog[];
    };
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError(false);
        const data = await dashboardService.getStats();
        if (isMounted) {
          setDashboardStats(data);
        }
      } catch (error) {
        if (isMounted) {
          setStatsError(true);
          setDashboardStats(null);
        }
      } finally {
        if (isMounted) {
          setStatsLoading(false);
        }
      }
    };

    loadDashboardStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const counts = dashboardStats?.counts ?? {};
  const recentContacts = (dashboardStats?.recentActivity?.contacts?.length ? dashboardStats.recentActivity.contacts : contacts.slice(0, 3)) as Contact[];
  const recentBlogs = (dashboardStats?.recentActivity?.blogs?.length ? dashboardStats.recentActivity.blogs : blogs.slice(0, 3)) as Blog[];

  const formatCount = (value: number | string | undefined) => {
    if (value === undefined || value === null || value === '') {
      return '--';
    }

    const numericValue = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(numericValue)) {
      return '--';
    }

    return numericValue.toLocaleString();
  };

  const statCards = [
    {
      label: 'Users',
      value: statsLoading ? '—' : formatCount(counts.users),
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      isLoading: statsLoading,
    },
    {
      label: 'Blogs',
      value: statsLoading ? '—' : formatCount(counts.blogs),
      icon: BookOpen,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      isLoading: statsLoading,
    },
    {
      label: 'Testimonials',
      value: statsLoading ? '—' : formatCount(counts.testimonials),
      icon: Star,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      isLoading: statsLoading,
    },
    {
      label: 'Contacts Inbox',
      value: statsLoading ? '—' : formatCount(counts.unreadContacts),
      icon: MessageSquare,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      isLoading: statsLoading,
    },
    {
      label: 'Services',
      value: statsLoading ? '—' : formatCount(counts.services),
      icon: Briefcase,
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600',
      isLoading: statsLoading,
    },
    {
      label: 'FAQs',
      value: statsLoading ? '—' : formatCount(counts.faqs),
      icon: CircleHelp,
      iconBg: 'bg-sky-50',
      iconColor: 'text-sky-600',
      isLoading: statsLoading,
    },
    {
      label: 'Team Members',
      value: statsLoading ? '—' : formatCount(counts.teamMembers),
      icon: Users2,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      isLoading: statsLoading,
    },
    {
      label: 'Industries',
      value: statsLoading ? '—' : formatCount(counts.industries),
      icon: Building2,
      iconBg: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      isLoading: statsLoading,
    },
    {
      label: 'Case Studies',
      value: statsLoading ? '—' : formatCount(counts.caseStudies),
      icon: FolderKanban,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      isLoading: statsLoading,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in select-none">
      
      {/* 1. Header & Quick Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            icon={card.icon}
            iconBg={card.iconBg}
            iconColor={card.iconColor}
            isLoading={card.isLoading}
          />
        ))}
      </div>

      {/* 2. Bottom Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Contacts Inbox Panel */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm shadow-gray-100/50 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
            <div>
              <h4 className="font-bold text-text-dark text-base">Recent Messages</h4>
              <p className="text-xs text-text-gray font-medium mt-0.5">Lately submitted contact form queries</p>
            </div>
            <button 
              onClick={() => onNavigateToTab('contacts')}
              className="text-primary-red hover:text-primary-red-hover text-xs font-bold flex items-center gap-1 transition-colors hover:underline"
            >
              View Inbox <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-gray-100 flex-1">
            {recentContacts.map((contact) => (
              <div 
                key={contact.id} 
                onClick={() => onViewContact(contact)}
                className="py-3.5 flex items-center justify-between hover:bg-gray-50/50 px-2 rounded-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 border border-gray-200/60 rounded-xl flex items-center justify-center text-[#DC2626] font-bold text-sm">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-text-dark group-hover:text-primary-red transition-colors">
                      {contact.name}
                    </h5>
                    <p className="text-xs text-text-gray font-medium max-w-xs truncate">{contact.subject}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-text-gray font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {contact.date}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider ${
                    contact.status === 'New' ? 'bg-rose-50 text-[#DC2626] border border-rose-100' :
                    contact.status === 'Replied' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    'bg-gray-50 text-gray-600 border border-gray-200'
                  }`}>
                    {contact.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Blogs Panel */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm shadow-gray-100/50 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
            <div>
              <h4 className="font-bold text-text-dark text-base">Recent Blogs</h4>
              <p className="text-xs text-text-gray font-medium mt-0.5">Recently edited publications status</p>
            </div>
            <button 
              onClick={() => onNavigateToTab('blogs')}
              className="text-primary-red hover:text-primary-red-hover text-xs font-bold flex items-center gap-1 transition-colors hover:underline"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-gray-100 flex-1">
            {recentBlogs.map((blog) => (
              <div 
                key={blog.id}
                className="py-3.5 flex items-center justify-between hover:bg-gray-50/50 px-2 rounded-xl transition-all"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={normalizeImageUrl(blog.image)} 
                    alt={blog.title} 
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    className="w-12 h-9 object-cover rounded-lg border border-gray-100"
                  />
                  <div>
                    <h5 className="text-sm font-semibold text-text-dark line-clamp-1">
                      {blog.title}
                    </h5>
                    <p className="text-xs text-text-gray font-medium">{blog.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-text-gray font-medium">
                    {blog.publishedAt}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    blog.status === 'Published' 
                      ? 'bg-green-50 text-green-600 border border-green-100' 
                      : 'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}>
                    {blog.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
