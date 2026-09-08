/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Search, Edit, Trash2, Mail, CheckCircle, AlertCircle, X, ChevronLeft, ChevronRight, UserPlus } from 'lucide-react';
import { User } from '../../types';
import Button from '../forms/Button';
import Input from '../forms/Input';
import Select from '../forms/Select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { normalizeImageUrl } from '../../utils/image';

const userFormSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  role: z.enum(['Admin', 'User', 'ContentWriter']),
  status: z.enum(['Active', 'Inactive']),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UsersViewProps {
  users: User[];
  onAddUser: (u: Omit<User, 'id' | 'createdAt'> & { password?: string }) => Promise<void> | void;
  onEditUser: (id: string, u: Partial<User> & { password?: string }) => Promise<void> | void;
  onDeleteUser: (id: string) => void;
}

export default function UsersView({
  users,
  onAddUser,
  onEditUser,
  onDeleteUser,
}: UsersViewProps) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [formMode, setFormMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
  });

  // Filter Logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination Logic
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenAdd = () => {
    reset({ name: '', email: '', password: '', role: 'User', status: 'Active' });
    setFormMode('add');
  };

  const handleOpenEdit = (user: User) => {
    reset({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status,
    });
    setEditingUserId(user.id);
    setFormMode('edit');
  };

  const onSubmit = async (data: UserFormValues) => {
    try {
      const payload = { ...data } as UserFormValues & { password?: string };
      if (!payload.password?.trim()) {
        delete payload.password;
      }

      if (formMode === 'add') {
        if (!payload.password?.trim()) {
          toast.error('Password is required to create a user');
          return;
        }
        await onAddUser(payload);
        toast.success('User added successfully!');
      } else if (formMode === 'edit' && editingUserId) {
        await onEditUser(editingUserId, payload);
        toast.success('User updated successfully!');
      }
      setFormMode('list');
    } catch (error: any) {
      console.error('[USERS] Form submission failed:', error);
      toast.error(error?.message || 'Failed to save user');
    }
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm shadow-gray-100/50 animate-fade-in select-none">
      
      {formMode === 'list' ? (
        /* LIST MODE */
        <div className="space-y-6">
          {/* Top Actions & Filters bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Left search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-4 py-2 border border-border-gray rounded-lg text-sm text-text-dark bg-gray-50/50 outline-none focus:bg-white focus:border-primary-red focus:ring-2 focus:ring-red-50 transition-all"
              />
            </div>

            {/* Right filter selects & Add User Trigger */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border border-border-gray text-xs font-semibold text-text-gray px-3 py-2 rounded-lg outline-none focus:border-primary-red transition-all cursor-pointer"
              >
                <option value="All">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
                <option value="ContentWriter">Content Writer</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border border-border-gray text-xs font-semibold text-text-gray px-3 py-2 rounded-lg outline-none focus:border-primary-red transition-all cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <Button
                variant="primary"
                onClick={handleOpenAdd}
                className="bg-primary-red hover:bg-primary-red-hover text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 px-3 py-2"
              >
                <UserPlus className="w-4 h-4" /> Add User
              </Button>
            </div>
          </div>

          {/* Table container */}
          <div className="w-full overflow-x-auto border border-gray-100 rounded-xl">
            <table className="w-full text-left text-sm border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-text-gray uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created At</th>
                  <th className="py-3 px-4 w-28 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user, idx) => (
                    <tr key={user.id} className="hover:bg-gray-50/40 transition-colors group">
                      <td className="py-3.5 px-4 text-center text-text-gray font-semibold">
                        {startIndex + idx + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={normalizeImageUrl(user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80')} 
                            alt="avatar" 
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                            className="w-9 h-9 rounded-full object-cover border border-[#E5E7EB]"
                          />
                          <span className="font-semibold text-text-dark group-hover:text-primary-red transition-colors">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-text-gray font-medium">
                        {user.email}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          user.role === 'Admin' ? 'bg-red-50 text-primary-red' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-xs font-semibold flex items-center gap-1.5 ${
                          user.status === 'Active' ? 'text-emerald-600' : 'text-rose-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-text-gray font-medium text-xs">
                        {user.createdAt}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(user)}
                            className="p-1.5 rounded-lg border border-border-gray hover:border-primary-red hover:text-primary-red transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteUser(user.id)}
                            className="p-1.5 rounded-lg border border-border-gray hover:border-red-600 hover:text-red-600 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-text-gray font-semibold">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination bar */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-medium text-text-gray select-none">
              <span>
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
              </span>
              
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="p-1.5 rounded-lg border border-border-gray hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      currentPage === i + 1 
                        ? 'bg-[#DC2626] text-white' 
                        : 'border border-border-gray hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-1.5 rounded-lg border border-border-gray hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ADD / EDIT FORM MODE */
        <div>
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <h3 className="text-lg font-bold text-text-dark tracking-tight">
              {formMode === 'add' ? 'Add New User' : 'Edit User Profile'}
            </h3>
            <button
              onClick={() => setFormMode('list')}
              className="p-1.5 rounded-lg hover:bg-gray-50 text-text-gray hover:text-text-dark transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
            <Input
              label="Full Name"
              placeholder="e.g. Ali Raza"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email Address"
              placeholder="e.g. ali@example.com"
              type="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              placeholder="Enter a secure password"
              type="password"
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Role"
                options={[
                  { value: 'User', label: 'User' },
                  { value: 'Admin', label: 'Admin' },
                  { value: 'ContentWriter', label: 'Content Writer' },
                ]}
                error={errors.role?.message}
                {...register('role')}
              />

              <Select
                label="Status"
                options={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' },
                ]}
                error={errors.status?.message}
                {...register('status')}
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => setFormMode('list')}
                className="w-28"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-28 bg-[#DC2626] hover:bg-red-700 text-white"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
