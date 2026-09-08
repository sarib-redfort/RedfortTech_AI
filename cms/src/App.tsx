/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import LoginPage from './app/(auth)/login/page';
// Layout components
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import PageHeader from './components/layout/PageHeader';

// View components
import DashboardView from './components/views/DashboardView';
import UsersView from './components/views/UsersView';
import BlogsView from './components/views/BlogsView';
import ServicesView from './components/views/ServicesView';
import IndustriesView from './components/views/IndustriesView';
import CaseStudiesView from './components/views/CaseStudiesView';
import TeamMembersView from './components/views/TeamMembersView';
import ContactsView from './components/views/ContactsView';
import TestimonialsView from './components/views/TestimonialsView';
import CmsView from './components/views/CmsView';
import SettingsView from './components/views/SettingsView';

// Deletion confirmation modal
import DeleteModal from './components/common/DeleteModal';

// Mock data constants & Types
import { 
  INITIAL_USERS, 
  INITIAL_CATEGORIES, 
  INITIAL_SERVICES,
  INITIAL_HOMEPAGE, 
  INITIAL_ABOUT, 
  INITIAL_FAQS
} from './constants';
import { User, Blog, Category, Service, CaseStudy, Contact, Testimonial, HomepageCms, AboutCms, Faq, Industry, TeamMember } from './types';
import { userService, blogService, contactService, serviceService, faqService, testimonialService, industryService, caseStudyService, teamMemberService } from './services/api';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id?: string; name: string; email: string; role: string } | null>(null);

  // Application database states
  const [users, setUsers] = useState<User[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [homepage, setHomepage] = useState<HomepageCms>(INITIAL_HOMEPAGE);
  const [about, setAbout] = useState<AboutCms>(INITIAL_ABOUT);
  const [faqs, setFaqs] = useState<Faq[]>(INITIAL_FAQS);

  // Layout states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Deletion Modal state helper
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    itemName: string;
    targetId: string;
    type: 'user' | 'blog' | 'category' | 'service' | 'testimonial' | 'case_study' | 'team_member' | null;
  }>({
    isOpen: false,
    itemName: '',
    targetId: '',
    type: null,
  });

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken) {
      setIsAuthenticated(true);
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch {
          setCurrentUser(null);
        }
      }
    }
  }, []);

  const loadUsers = async () => {
    try {
      const backendUsers = await userService.getUsers();
      setUsers(backendUsers);
    } catch (error: any) {
      console.error('[APP] Failed to load users:', error);
      toast.error(error?.message || 'Failed to load users');
    }
  };

  const loadBlogs = async () => {
    try {
      const backendBlogs = await blogService.getBlogs();
      setBlogs(backendBlogs);
    } catch (error: any) {
      console.error('[APP] Failed to load blogs:', error);
      toast.error(error?.message || 'Failed to load blogs');
    }
  };

  const loadContacts = async () => {
    try {
      const backendContacts = await contactService.getContacts();
      setContacts(backendContacts);
    } catch (error: any) {
      console.error('[APP] Failed to load contacts:', error);
      toast.error(error?.message || 'Failed to load contacts');
    }
  };

  const loadServices = async () => {
    try {
      const backendServices = await serviceService.getServices();
      setServices(backendServices);
    } catch (error: any) {
      console.error('[APP] Failed to load services:', error);
      toast.error(error?.message || 'Failed to load services');
    }
  };

  const loadFaqs = async () => {
    try {
      const backendFaqs = await faqService.getFaqs();
      setFaqs(backendFaqs);
    } catch (error: any) {
      console.error('[APP] Failed to load FAQs:', error);
      toast.error(error?.message || 'Failed to load FAQs');
    }
  };

  const loadTestimonials = async () => {
    try {
      const backendTestimonials = await testimonialService.getTestimonials();
      setTestimonials(backendTestimonials);
    } catch (error: any) {
      console.error('[APP] Failed to load testimonials:', error);
      toast.error(error?.message || 'Failed to load testimonials');
    }
  };

  const loadCaseStudies = async () => {
    try {
      const backendCaseStudies = await caseStudyService.getCaseStudies();
      setCaseStudies(backendCaseStudies);
    } catch (error: any) {
      console.error('[APP] Failed to load case studies:', error);
      toast.error(error?.message || 'Failed to load case studies');
    }
  };

  const loadIndustries = async () => {
    try {
      const backendIndustries = await industryService.getIndustries();
      setIndustries(backendIndustries);
    } catch (error: any) {
      console.error('[APP] Failed to load industries:', error);
      toast.error(error?.message || 'Failed to load industries');
    }
  };

  const loadTeamMembers = async () => {
    try {
      const backendTeamMembers = await teamMemberService.getTeamMembers();
      setTeamMembers(backendTeamMembers);
    } catch (error: any) {
      console.error('[APP] Failed to load team members:', error);
      toast.error(error?.message || 'Failed to load team members');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    void loadUsers();
    void loadBlogs();
    void loadContacts();
    void loadServices();
    void loadIndustries();
    void loadTeamMembers();
    void loadFaqs();
    void loadTestimonials();
    void loadCaseStudies();
  }, [isAuthenticated]);

  const normalizedRole = currentUser?.role?.toLowerCase() || '';
  const isAdmin = normalizedRole === 'admin';
  const isContentWriter = normalizedRole === 'contentwriter' || normalizedRole === 'content writer';
  const restrictedTabs = ['users', 'contacts', 'settings'];

  const canAccessTab = (tab: string) => {
    if (isAdmin) return true;
    return !restrictedTabs.includes(tab);
  };

  useEffect(() => {
    if (isContentWriter && restrictedTabs.includes(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [activeTab, isContentWriter]);

  const handleLoginSuccess = (user: { id?: string; name: string; email: string; role: string }) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(user));
    toast.success('Successfully logged in!');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
  };

  const handleProfileUpdated = (user: { id?: string; name: string; email: string; role: string }) => {
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  // State modification CRUD functions
  // Users
  const handleAddUser = async (u: Omit<User, 'id' | 'createdAt'> & { password?: string }) => {
    try {
      const createdUser = await userService.createUser(u);
      setUsers(prev => [createdUser, ...prev]);
      toast.success('User added successfully!');
      await loadUsers();
    } catch (error: any) {
      console.error('[APP] Failed to add user:', error);
      toast.error(error?.message || 'Failed to add user');
    }
  };
  const handleEditUser = async (id: string, updatedFields: Partial<User> & { password?: string }) => {
    try {
      const updatedUser = await userService.updateUser(id, updatedFields);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updatedUser } : u));
      toast.success('User updated successfully!');
      await loadUsers();
    } catch (error: any) {
      console.error('[APP] Failed to update user:', error);
      toast.error(error?.message || 'Failed to update user');
    }
  };
  const triggerDeleteUser = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user) {
      setDeleteModalState({
        isOpen: true,
        itemName: user.name,
        targetId: id,
        type: 'user',
      });
    }
  };

  // Blogs
  const handleAddBlog = async (b: Omit<Blog, 'id' | 'publishedAt'>) => {
    try {
      const createdBlog = await blogService.createBlog(b);
      setBlogs((prev) => [createdBlog, ...prev]);
      return createdBlog;
    } catch (error: any) {
      console.error('[APP] Failed to create blog:', error);
      throw error;
    }
  };

  const handleEditBlog = async (id: string, updatedFields: Partial<Blog>) => {
    try {
      const updatedBlog = await blogService.updateBlog(id, updatedFields);
      setBlogs((prev) => prev.map((b) => (b.id === id ? { ...b, ...updatedBlog } : b)));
      await loadBlogs();
      return updatedBlog;
    } catch (error: any) {
      console.error('[APP] Failed to update blog:', error);
      throw error;
    }
  };
  const triggerDeleteBlog = (id: string) => {
    const blog = blogs.find(b => b.id === id);
    if (blog) {
      setDeleteModalState({
        isOpen: true,
        itemName: blog.title,
        targetId: id,
        type: 'blog',
      });
    }
  };

  // Categories
  const handleAddCategory = (c: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...c,
      id: Math.random().toString(36).substr(2, 9),
    };
    setCategories([newCat, ...categories]);
  };
  const handleEditCategory = (id: string, updatedFields: Partial<Category>) => {
    setCategories(categories.map(c => c.id === id ? { ...c, ...updatedFields } : c));
  };
  const triggerDeleteCategory = (id: string) => {
    const cat = categories.find(c => c.id === id);
    if (cat) {
      setDeleteModalState({
        isOpen: true,
        itemName: cat.name,
        targetId: id,
        type: 'category',
      });
    }
  };

  // Services
  const handleAddService = async (s: Omit<Service, 'id'>) => {
    try {
      const createdService = await serviceService.createService(s);
      setServices((prev) => [createdService, ...prev]);
      await loadServices();
      return createdService;
    } catch (error: any) {
      console.error('[APP] Failed to create service:', error);
      throw error;
    }
  };
  const handleEditService = async (id: string, updatedFields: Partial<Service>) => {
    try {
      const updatedService = await serviceService.updateService(id, updatedFields);
      setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updatedService } : s)));
      await loadServices();
      return updatedService;
    } catch (error: any) {
      console.error('[APP] Failed to update service:', error);
      throw error;
    }
  };
  const triggerDeleteService = async (id: string) => {
    try {
      await serviceService.deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      await loadServices();
      toast.success('Service deleted successfully!');
    } catch (error: any) {
      console.error('[APP] Failed to delete service:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to delete service');
    }
  };

  // Industries
  const handleAddIndustry = async (payload: FormData) => {
    try {
      const createdIndustry = await industryService.createIndustry(payload);
      setIndustries((prev) => [createdIndustry, ...prev]);
      await loadIndustries();
      return createdIndustry;
    } catch (error: any) {
      console.error('[APP] Failed to create industry:', error);
      throw error;
    }
  };
  const handleEditIndustry = async (id: string, payload: FormData) => {
    try {
      const updatedIndustry = await industryService.updateIndustry(id, payload);
      setIndustries((prev) => prev.map((ind) => (ind.id === id ? { ...ind, ...updatedIndustry } : ind)));
      await loadIndustries();
      return updatedIndustry;
    } catch (error: any) {
      console.error('[APP] Failed to update industry:', error);
      throw error;
    }
  };
  const triggerDeleteIndustry = async (id: string) => {
    try {
      await industryService.deleteIndustry(id);
      setIndustries((prev) => prev.filter((ind) => ind.id !== id));
      await loadIndustries();
      toast.success('Industry deleted successfully!');
    } catch (error: any) {
      console.error('[APP] Failed to delete industry:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to delete industry');
    }
  };

  // Team Members
  const handleAddTeamMember = async (payload: FormData) => {
    try {
      const createdTeamMember = await teamMemberService.createTeamMember(payload);
      setTeamMembers((prev) => [createdTeamMember, ...prev]);
      await loadTeamMembers();
      return createdTeamMember;
    } catch (error: any) {
      console.error('[APP] Failed to create team member:', error);
      throw error;
    }
  };
  const handleEditTeamMember = async (id: string, payload: FormData) => {
    try {
      const updatedTeamMember = await teamMemberService.updateTeamMember(id, payload);
      setTeamMembers((prev) => prev.map((member) => (member.id === id ? { ...member, ...updatedTeamMember } : member)));
      await loadTeamMembers();
      return updatedTeamMember;
    } catch (error: any) {
      console.error('[APP] Failed to update team member:', error);
      throw error;
    }
  };
  const triggerDeleteTeamMember = async (id: string) => {
    const member = teamMembers.find((item) => item.id === id);
    if (member) {
      setDeleteModalState({
        isOpen: true,
        itemName: member.name,
        targetId: id,
        type: 'team_member',
      });
    }
  };

  // Testimonials
  const handleAddTestimonial = async (payload: FormData) => {
    try {
      const createdTestimonial = await testimonialService.createTestimonial(payload);
      await loadTestimonials();
      return createdTestimonial;
    } catch (error: any) {
      console.error('[APP] Failed to create testimonial:', error);
      throw error;
    }
  };
  const handleEditTestimonial = async (id: string, payload: FormData) => {
    try {
      const updatedTestimonial = await testimonialService.updateTestimonial(id, payload);
      await loadTestimonials();
      return updatedTestimonial;
    } catch (error: any) {
      console.error('[APP] Failed to update testimonial:', error);
      throw error;
    }
  };
  const triggerDeleteTestimonial = async (id: string) => {
    try {
      await testimonialService.deleteTestimonial(id);
      await loadTestimonials();
      toast.success('Testimonial deleted successfully!');
    } catch (error: any) {
      console.error('[APP] Failed to delete testimonial:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to delete testimonial');
    }
  };

  // Case Studies
  const handleAddCaseStudy = async (payload: Omit<CaseStudy, 'id' | 'createdAt' | 'slug'> | FormData) => {
    try {
      const createdCaseStudy = await caseStudyService.createCaseStudy(payload as Omit<CaseStudy, 'id' | 'createdAt'> | FormData);
      setCaseStudies((prev) => [createdCaseStudy, ...prev]);
      await loadCaseStudies();
      toast.success('Case study created successfully!');
      return createdCaseStudy;
    } catch (error: any) {
      console.error('[APP] Failed to create case study:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to create case study');
      throw error;
    }
  };
  const handleEditCaseStudy = async (id: string, updatedFields: Partial<CaseStudy> | FormData) => {
    try {
      const updatedCaseStudy = await caseStudyService.updateCaseStudy(id, updatedFields);
      setCaseStudies((prev) => prev.map((cs) => (cs.id === id ? { ...cs, ...updatedCaseStudy } : cs)));
      await loadCaseStudies();
      toast.success('Case study updated successfully!');
      return updatedCaseStudy;
    } catch (error: any) {
      console.error('[APP] Failed to update case study:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to update case study');
      throw error;
    }
  };
  const triggerDeleteCaseStudy = async (id: string) => {
    const study = caseStudies.find(cs => cs.id === id);
    if (study) {
      setDeleteModalState({
        isOpen: true,
        itemName: study.title,
        targetId: id,
        type: 'case_study',
      });
    }
  };

  // FAQs Accordions
  const handleAddFaq = async (f: Omit<Faq, 'id'>) => {
    try {
      const createdFaq = await faqService.createFaq(f);
      setFaqs((prev) => [createdFaq, ...prev]);
      await loadFaqs();
      return createdFaq;
    } catch (error: any) {
      console.error('[APP] Failed to create FAQ:', error);
      throw error;
    }
  };
  const handleEditFaq = async (id: string, updatedFields: Partial<Faq>) => {
    try {
      const updatedFaq = await faqService.updateFaq(id, updatedFields);
      setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...updatedFaq } : f)));
      await loadFaqs();
      return updatedFaq;
    } catch (error: any) {
      console.error('[APP] Failed to update FAQ:', error);
      throw error;
    }
  };
  const triggerDeleteFaq = async (id: string) => {
    try {
      await faqService.deleteFaq(id);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      await loadFaqs();
      toast.success('FAQ deleted successfully!');
    } catch (error: any) {
      console.error('[APP] Failed to delete FAQ:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to delete FAQ');
    }
  };

  // Contacts
  const handleUpdateContactStatus = async (id: string, status: Contact['status']) => {
    try {
      const updatedContact = await contactService.updateStatus(id, status);
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updatedContact, status: updatedContact.status || status } : c)));
    } catch (error: any) {
      console.error('[APP] Failed to update contact status:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to update contact status');
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await contactService.deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      toast.success('Contact deleted successfully!');
      await loadContacts();
    } catch (error: any) {
      console.error('[APP] Failed to delete contact:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to delete contact');
    }
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    const { targetId, type } = deleteModalState;
    if (type === 'user') {
      try {
        await userService.deleteUser(targetId);
        setUsers(users.filter(u => u.id !== targetId));
        toast.success('User deleted successfully!');
        await loadUsers();
      } catch (error: any) {
        console.error('[APP] Failed to delete user:', error);
        toast.error(error?.message || 'Failed to delete user');
      }
    } else if (type === 'blog') {
      try {
        await blogService.deleteBlog(targetId);
        setBlogs(blogs.filter(b => b.id !== targetId));
        toast.success('Blog deleted successfully!');
        await loadBlogs();
      } catch (error: any) {
        console.error('[APP] Failed to delete blog:', error);
        toast.error(error?.response?.data?.message || error?.message || 'Failed to delete blog');
      }
    } else if (type === 'category') {
      setCategories(categories.filter(c => c.id !== targetId));
      toast.success('Category deleted successfully!');
    } else if (type === 'service') {
      setServices(services.filter(s => s.id !== targetId));
      toast.success('Service deleted successfully!');
    } else if (type === 'testimonial') {
      setTestimonials(testimonials.filter(t => t.id !== targetId));
      toast.success('Testimonial deleted successfully!');
    } else if (type === 'case_study') {
      try {
        await caseStudyService.deleteCaseStudy(targetId);
        setCaseStudies((prev) => prev.filter((cs) => cs.id !== targetId));
        await loadCaseStudies();
        toast.success('Case study deleted successfully!');
      } catch (error: any) {
        console.error('[APP] Failed to delete case study:', error);
        toast.error(error?.response?.data?.message || error?.message || 'Failed to delete case study');
      }
    } else if (type === 'team_member') {
      try {
        await teamMemberService.deleteTeamMember(targetId);
        setTeamMembers((prev) => prev.filter((member) => member.id !== targetId));
        await loadTeamMembers();
        toast.success('Team member deleted successfully!');
      } catch (error: any) {
        console.error('[APP] Failed to delete team member:', error);
        toast.error(error?.response?.data?.message || error?.message || 'Failed to delete team member');
      }
    }
  };

  const getHeaderData = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Dashboard', breadcrumbs: ['Admin', 'Dashboard'] };
      case 'users':
        return { title: 'Users Directory', breadcrumbs: ['CMS', 'Users'] };
      case 'blogs':
        return { title: 'Blogs & Publications', breadcrumbs: ['CMS', 'Blogs'] };
      case 'services':
        return { title: 'Services Grid', breadcrumbs: ['CMS', 'Services'] };
      case 'industries':
        return { title: 'Industries Directory', breadcrumbs: ['CMS', 'Industries'] };
      case 'team-members':
        return { title: 'Team Members', breadcrumbs: ['CMS', 'Team Members'] };
      case 'case-studies':
        return { title: 'Case Studies', breadcrumbs: ['CMS', 'Case Studies'] };
      case 'contacts':
        return { title: 'Contacts Inbox', breadcrumbs: ['Inbox', 'Messages'] };
      case 'testimonials':
        return { title: 'Client Testimonials', breadcrumbs: ['CMS', 'Testimonials'] };
      case 'homepage':
        return { title: 'Homepage CMS', breadcrumbs: ['CMS', 'Homepage'] };
      case 'about':
        return { title: 'About CMS', breadcrumbs: ['CMS', 'About'] };
      case 'faqs':
        return { title: 'FAQs Accordion', breadcrumbs: ['CMS', 'FAQs'] };
      case 'settings':
        return { title: 'System Settings', breadcrumbs: ['Admin', 'Configuration'] };
      default:
        return { title: 'Dashboard', breadcrumbs: ['Admin', 'Dashboard'] };
    }
  };

  const headerData = getHeaderData();

  const handleTabChange = (tab: string) => {
    if (!canAccessTab(tab)) return;
    console.log('[APP] Opening tab:', tab);
    if (tab === 'users') {
      console.log('[APP] Loading users from backend because Users tab was opened');
      void loadUsers();
    }
    if (tab === 'blogs') {
      console.log('[APP] Loading blogs from backend because Blogs tab was opened');
      void loadBlogs();
    }
    setActiveTab(tab);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleSettingsNavigation = () => {
    if (canAccessTab('settings')) {
      setActiveTab('settings');
    } else {
      setActiveTab('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans select-none antialiased">
      {/* Toast provider */}
      <Toaster position="top-right" reverseOrder={false} />

      {!isAuthenticated ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        /* PRIMARY CORE APP LAYOUT */
        <div className="flex min-h-screen relative overflow-hidden">
          
          {/* Mobile backdrop overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity duration-300"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Collapsible sidebar */}
          <Sidebar 
            currentTab={activeTab} 
            onTabChange={handleTabChange}
            collapsed={!sidebarOpen} 
            setCollapsed={(val) => setSidebarOpen(!val)}
            onLogout={handleLogout}
            userRole={currentUser?.role || 'Admin'}
          />

          {/* Right workspace wrapper */}
          <div className={`flex-1 flex flex-col min-w-0 bg-[#FCFCFC] transition-all duration-300 ${
            sidebarOpen ? 'md:pl-64' : 'md:pl-20'
          }`}>
            
            {/* Horizontal navbar with status profiles & search */}
            <Navbar 
              user={{
                name: currentUser?.name || 'Admin',
                email: currentUser?.email || 'admin@redforai.com',
                role: currentUser?.role || 'Admin',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
              }}
              onLogout={handleLogout}
              onNavigateToProfile={handleSettingsNavigation}
              onNavigateToSettings={handleSettingsNavigation}
              collapsed={!sidebarOpen}
              canAccessSettings={canAccessTab('settings')}
              setCollapsed={(val) => setSidebarOpen(!val)}
              searchQuery=""
              setSearchQuery={() => {}}
            />

            {/* Content canvas container scroll-box */}
            <main className="p-4 md:p-6 lg:p-8 flex-1 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
              
              {/* Responsive interactive PageHeader */}
              <PageHeader 
                title={headerData.title}
                breadcrumbs={headerData.breadcrumbs}
              />

              {/* View Router */}
              {activeTab === 'dashboard' && (
                <DashboardView 
                  blogs={blogs}
                  contacts={contacts}
                  testimonials={testimonials}
                  onNavigateToTab={setActiveTab}
                  onViewContact={(contact) => {
                    setActiveTab('contacts');
                  }}
                />
              )}

              {activeTab === 'users' && canAccessTab('users') && (
                <UsersView
                  users={users}
                  onAddUser={handleAddUser}
                  onEditUser={handleEditUser}
                  onDeleteUser={triggerDeleteUser}
                />
              )}

              {activeTab === 'blogs' && (
                <BlogsView
                  blogs={blogs}
                  onAddBlog={handleAddBlog}
                  onEditBlog={handleEditBlog}
                  onDeleteBlog={triggerDeleteBlog}
                  currentUserName={currentUser?.name || 'Admin'}
                />
              )}

              {activeTab === 'services' && (
                <ServicesView
                  services={services}
                  onAddService={handleAddService}
                  onEditService={handleEditService}
                  onDeleteService={triggerDeleteService}
                />
              )}

              {activeTab === 'industries' && (
                <IndustriesView
                  industries={industries}
                  onAddIndustry={handleAddIndustry}
                  onEditIndustry={handleEditIndustry}
                  onDeleteIndustry={triggerDeleteIndustry}
                />
              )}

              {activeTab === 'team-members' && (
                <TeamMembersView
                  teamMembers={teamMembers}
                  onAddTeamMember={handleAddTeamMember}
                  onEditTeamMember={handleEditTeamMember}
                  onDeleteTeamMember={triggerDeleteTeamMember}
                />
              )}

              {activeTab === 'contacts' && canAccessTab('contacts') && (
                <ContactsView
                  contacts={contacts}
                  onUpdateStatus={handleUpdateContactStatus}
                  onDeleteContact={handleDeleteContact}
                />
              )}

              {activeTab === 'testimonials' && (
                <TestimonialsView
                  testimonials={testimonials}
                  onAddTestimonial={handleAddTestimonial}
                  onEditTestimonial={handleEditTestimonial}
                  onDeleteTestimonial={triggerDeleteTestimonial}
                />
              )}

              {activeTab === 'case-studies' && (
                <CaseStudiesView
                  caseStudies={caseStudies}
                  onAddCaseStudy={handleAddCaseStudy}
                  onEditCaseStudy={handleEditCaseStudy}
                  onDeleteCaseStudy={triggerDeleteCaseStudy}
                />
              )}

              {(activeTab === 'pages' || activeTab === 'homepage' || activeTab === 'about' || activeTab === 'faqs') && (
                <CmsView
                  initialTab={activeTab === 'homepage' ? 'homepage' : activeTab === 'about' ? 'about' : 'faqs'}
                  homepage={homepage}
                  onUpdateHomepage={setHomepage}
                  about={about}
                  onUpdateAbout={setAbout}
                  faqs={faqs}
                  services={services}
                  onAddFaq={handleAddFaq}
                  onEditFaq={handleEditFaq}
                  onDeleteFaq={triggerDeleteFaq}
                />
              )}

              {activeTab === 'settings' && canAccessTab('settings') && (
                <SettingsView
                  currentUser={currentUser}
                  onProfileUpdated={handleProfileUpdated}
                />
              )}

            </main>
          </div>

          {/* Delete confirmation modals */}
          <DeleteModal
            isOpen={deleteModalState.isOpen}
            onClose={() => setDeleteModalState({ ...deleteModalState, isOpen: false })}
            onConfirm={handleConfirmDelete}
            itemName={deleteModalState.itemName}
          />

        </div>
      )}
    </div>
  );
}
