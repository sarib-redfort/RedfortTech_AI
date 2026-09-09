/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users as UsersIcon, 
  BookOpen, 
  Briefcase, 
  FolderHeart, 
  FileText, 
  MessageSquare, 
  Home as HomeIcon, 
  Info, 
  HelpCircle, 
  Settings as SettingsIcon, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  UserCheck,
  Layers,
  Users2
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  userRole?: string;
}

export default function Sidebar({ 
  currentTab, 
  onTabChange,
  onLogout,
  collapsed, 
  setCollapsed,
  userRole = 'Admin'
}: SidebarProps) {
  const normalizedRole = userRole?.toLowerCase() || '';
  const isContentWriter = normalizedRole === 'contentwriter' || normalizedRole === 'content writer';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: UsersIcon },
    { id: 'blogs', label: 'Blogs', icon: BookOpen },
    { id: 'services', label: 'Services', icon: FolderHeart },
    { id: 'industries', label: 'Industries', icon: Layers },
    { id: 'team-members', label: 'Team Members', icon: Users2 },
    { id: 'case-studies', label: 'Case Studies', icon: Briefcase },
    { id: 'contacts', label: 'Contacts', icon: MessageSquare },
    { id: 'testimonials', label: 'Testimonials', icon: UserCheck },
    { id: 'homepage', label: 'Homepage', icon: HomeIcon },
    { id: 'about', label: 'About', icon: Info },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ].filter((item) => {
    if (!isContentWriter) return true;
    return !['users', 'contacts', 'settings'].includes(item.id);
  });

  return (
    <div 
      className={`h-screen fixed left-0 top-0 bg-[#111111] text-gray-400 transition-all duration-300 z-30 flex flex-col justify-between border-r border-[#222] ${
        collapsed 
          ? '-translate-x-full md:translate-x-0 w-64 md:w-20' 
          : 'translate-x-0 w-64 md:w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-5 border-b border-[#222] flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#DC2626] rounded-lg flex items-center justify-center shadow-md shadow-red-950/50">
              <svg 
                className="w-4 h-4 text-white" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="m3 21 9-18 9 18H3Z" />
                <path d="M9 14h6" />
              </svg>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white">
                RedForAI
              </span>
              <span className="bg-[#DC2626] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded tracking-wider">
                CMS
              </span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-[#DC2626] rounded-lg flex items-center justify-center shadow-md shadow-red-950/50 mx-auto">
            <svg 
              className="w-4 h-4 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="m3 21 9-18 9 18H3Z" />
            </svg>
          </div>
        )}
        
        {/* Desktop Collapse Button */}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="p-1.5 rounded-lg hover:bg-[#222] hover:text-white transition-colors hidden md:block"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Mobile Close Button */}
        <button 
          onClick={() => setCollapsed(true)} 
          className="p-1.5 rounded-lg hover:bg-[#222] hover:text-white transition-colors md:hidden text-gray-400"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Sidebar Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentTab === item.id || currentTab.startsWith(item.id + '_');
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-[#DC2626] text-white' 
                  : 'hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              <IconComponent className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
              {!collapsed && <span>{item.label}</span>}
              {collapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-black text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-[#222]">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-sm font-medium hover:bg-red-950/20 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 text-gray-400 hover:text-red-400 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}
