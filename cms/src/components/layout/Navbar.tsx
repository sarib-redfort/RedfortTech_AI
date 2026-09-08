/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Bell, Search, Menu, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { UserProfile } from '../../types';
import { normalizeImageUrl } from '../../utils/image';

interface NavbarProps {
  user: UserProfile;
  onLogout: () => void;
  onNavigateToProfile: () => void;
  onNavigateToSettings: () => void;
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  canAccessSettings?: boolean;
}

export default function Navbar({
  user,
  onLogout,
  onNavigateToProfile,
  onNavigateToSettings,
  collapsed,
  setCollapsed,
  searchQuery,
  setSearchQuery,
  canAccessSettings = true,
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Mock Notifications
  const notifications = [
    { id: 1, text: 'New application received for Frontend Developer position.', time: '10m ago', unread: true },
    { id: 2, text: 'Contact form inquiry submitted by Ali Raza.', time: '2h ago', unread: true },
    { id: 3, text: 'Your password was successfully updated.', time: 'Yesterday', unread: false },
  ];

  return (
    <nav className="h-16 bg-white border-b border-[#E5E7EB] px-6 flex items-center justify-between sticky top-0 z-20">
      
      {/* Search Bar / Menu Toggle for mobile */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
          <input
            type="text"
            placeholder="Search here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2 bg-gray-50 hover:bg-gray-100/60 focus:bg-white border border-[#E5E7EB] rounded-lg text-sm text-text-dark outline-none focus:border-primary-red focus:ring-2 focus:ring-red-50 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right Navbar Items */}
      <div className="flex items-center gap-4">
        
        {/* Notifications Icon with dot */}
        <div className="relative">
          <button 
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setDropdownOpen(false);
            }}
            className="p-2.5 rounded-full hover:bg-gray-100 text-text-gray hover:text-text-dark transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-primary-red rounded-full" />
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2.5 w-80 bg-white border border-border-gray rounded-xl shadow-xl py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <span className="font-semibold text-sm text-text-dark">Notifications</span>
                <span className="text-xs text-primary-red font-medium cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-3.5 hover:bg-gray-50 transition-colors flex gap-2.5">
                    <div className="flex-1">
                      <p className={`text-xs ${notif.unread ? 'text-text-dark font-medium' : 'text-text-gray'}`}>
                        {notif.text}
                      </p>
                      <span className="text-[10px] text-text-gray block mt-1">{notif.time}</span>
                    </div>
                    {notif.unread && <span className="w-1.5 h-1.5 bg-primary-red rounded-full self-center" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Info & Dropdown Trigger */}
        <div className="relative">
          <button 
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-50 transition-all text-left"
          >
            <img 
              src={normalizeImageUrl(user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80')} 
              alt="avatar" 
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              className="w-9 h-9 rounded-full object-cover border border-[#E5E7EB]"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-text-dark leading-tight">{user.name}</p>
              <p className="text-[11px] text-text-gray font-medium">{user.role}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-text-gray hidden sm:block" />
          </button>

          {/* Admin Profile Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-border-gray rounded-xl shadow-xl py-2 z-50 animate-fade-in">
              <button 
                onClick={() => {
                  onNavigateToProfile();
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-dark hover:bg-gray-50 text-left"
              >
                <User className="w-4.5 h-4.5 text-text-gray" />
                My Profile
              </button>
              {canAccessSettings && (
                <button 
                  onClick={() => {
                    onNavigateToSettings();
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-dark hover:bg-gray-50 text-left"
                >
                  <Settings className="w-4.5 h-4.5 text-text-gray" />
                  Settings
                </button>
              )}
              <div className="h-px bg-gray-100 my-1" />
              <button 
                onClick={() => {
                  onLogout();
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left font-medium"
              >
                <LogOut className="w-4.5 h-4.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>

      </div>

    </nav>
  );
}
