/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { TeamMember } from '../../types';
import Button from '../forms/Button';
import Input from '../forms/Input';
import Select from '../forms/Select';
import ImageUpload from '../forms/ImageUpload';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { normalizeImageUrl } from '../../utils/image';

const teamMemberFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  role: z.string().trim().min(1, 'Role is required'),
  description: z.string().trim().min(1, 'Description is required'),
  image: z.union([z.string().optional(), z.instanceof(File)]),
  linkedinUrl: z.string().trim().refine((value) => value === '' || /^https?:\/\//i.test(value), {
    message: 'LinkedIn URL must be a valid URL',
  }).optional(),
  twitterUrl: z.string().trim().refine((value) => value === '' || /^https?:\/\//i.test(value), {
    message: 'Twitter URL must be a valid URL',
  }).optional(),
  status: z.enum(['Active', 'Inactive']),
});

type TeamMemberFormValues = z.infer<typeof teamMemberFormSchema>;

interface TeamMembersViewProps {
  teamMembers: TeamMember[];
  onAddTeamMember: (i: FormData) => Promise<TeamMember | void>;
  onEditTeamMember: (id: string, i: FormData) => Promise<TeamMember | void>;
  onDeleteTeamMember: (id: string) => Promise<void>;
}

export default function TeamMembersView({
  teamMembers,
  onAddTeamMember,
  onEditTeamMember,
  onDeleteTeamMember,
}: TeamMembersViewProps) {
  const [formMode, setFormMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingTeamMemberId, setEditingTeamMemberId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingTeamMemberId, setDeletingTeamMemberId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      name: '',
      role: '',
      description: '',
      image: '',
      linkedinUrl: '',
      twitterUrl: '',
      status: 'Active',
    },
  });

  const handleOpenAdd = () => {
    reset({
      name: '',
      role: '',
      description: '',
      image: '',
      linkedinUrl: '',
      twitterUrl: '',
      status: 'Active',
    });
    setPreviewUrl('');
    setEditingTeamMemberId(null);
    setFormMode('add');
  };

  const handleOpenEdit = (member: TeamMember) => {
    reset({
      name: member.name,
      role: member.role,
      description: member.description,
      image: member.image || '',
      linkedinUrl: member.linkedinUrl || '',
      twitterUrl: member.twitterUrl || '',
      status: member.status,
    });
    setPreviewUrl(member.image || '');
    setEditingTeamMemberId(member.id);
    setFormMode('edit');
  };

  const onSubmit = async (data: TeamMemberFormValues) => {
    if (formMode === 'add' && !(data.image instanceof File)) {
      toast.error('Image is required while creating a team member');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', data.name.trim());
      formData.append('role', data.role.trim());
      formData.append('description', data.description.trim());
      formData.append('status', data.status);

      if (data.linkedinUrl?.trim()) {
        formData.append('linkedinUrl', data.linkedinUrl.trim());
      }

      if (data.twitterUrl?.trim()) {
        formData.append('twitterUrl', data.twitterUrl.trim());
      }

      if (data.image instanceof File) {
        formData.append('image', data.image);
      }

      if (formMode === 'add') {
        await onAddTeamMember(formData);
      } else if (formMode === 'edit' && editingTeamMemberId) {
        await onEditTeamMember(editingTeamMemberId, formData);
      }

      setFormMode('list');
    } catch (error: any) {
      console.error('[TEAM MEMBERS] Submit failed:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to save team member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (file: File | null, url: string) => {
    if (file) {
      setValue('image', file, { shouldValidate: true });
    } else {
      setValue('image', '', { shouldValidate: true });
    }
    setPreviewUrl(url);
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm shadow-gray-100/50 animate-fade-in select-none">
      {formMode === 'list' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-bold text-text-dark text-base">Team Members</h3>
              <p className="text-xs text-text-gray font-medium mt-0.5">Manage your company team members</p>
            </div>

            <Button
              variant="primary"
              onClick={handleOpenAdd}
              className="bg-primary-red hover:bg-primary-red-hover text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 px-3 py-2"
            >
              <Plus className="w-4 h-4" /> Add Team Member
            </Button>
          </div>

          {teamMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
              <div className="text-center space-y-2">
                <p className="text-text-gray text-sm font-medium">No team members added yet</p>
                <p className="text-text-gray text-xs">Click "Add Team Member" to create a new profile</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="py-3 px-4 text-left text-xs font-semibold text-text-dark">Image</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-text-dark">Name</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-text-dark">Role</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-text-dark">Status</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-text-dark">Created Date</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-text-dark">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4">
                        {member.image && (
                          <img
                            src={normalizeImageUrl(member.image)}
                            alt={member.name}
                            crossOrigin="anonymous"
                            className="w-10 h-10 object-cover rounded-lg"
                          />
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-text-dark text-sm">{member.name}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-text-gray">{member.role}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          member.status === 'Active'
                            ? 'bg-green-50 text-emerald-600 border border-green-100'
                            : 'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-xs text-text-gray">{member.createdAt || 'N/A'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(member)}
                            className="p-1.5 rounded-lg border border-border-gray hover:border-primary-red hover:text-primary-red transition-all text-xs flex items-center gap-1 font-semibold text-text-gray hover:bg-red-50/10"
                          >
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={async () => {
                              setDeletingTeamMemberId(member.id);
                              try {
                                await onDeleteTeamMember(member.id);
                              } catch (error: any) {
                                console.error('[TEAM MEMBERS] Delete failed:', error);
                                toast.error(error?.response?.data?.message || error?.message || 'Failed to delete team member');
                              } finally {
                                setDeletingTeamMemberId(null);
                              }
                            }}
                            disabled={deletingTeamMemberId === member.id}
                            className="p-1.5 rounded-lg border border-border-gray hover:border-red-600 hover:text-red-600 transition-all text-xs flex items-center gap-1 font-semibold text-text-gray hover:bg-red-50/10 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> {deletingTeamMemberId === member.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <h3 className="text-lg font-bold text-text-dark tracking-tight">
              {formMode === 'add' ? 'Add New Team Member' : 'Edit Team Member'}
            </h3>
            <button
              onClick={() => setFormMode('list')}
              className="p-1.5 rounded-lg hover:bg-gray-50 text-text-gray hover:text-text-dark transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
            <div>
              <label className="text-sm font-medium text-text-dark mb-1.5 block">
                Team Member Image
              </label>
              <ImageUpload
                value={previewUrl}
                onChange={(value) => {
                  if (value instanceof File) {
                    handleImageUpload(value, URL.createObjectURL(value));
                  } else {
                    handleImageUpload(null, value);
                  }
                }}
              />
            </div>

            <Input
              label="Name"
              placeholder="Enter full name"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Role"
              placeholder="e.g. Senior Designer"
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-dark block">
                Description
              </label>
              <textarea
                placeholder="Write a short bio or description for this team member..."
                className="w-full min-h-75 px-3.5 py-2.5 rounded-lg border border-border-gray focus:border-primary-red focus:ring-2 focus:ring-red-50 text-sm text-text-dark outline-none transition-all resize-y"
                {...register('description')}
              />
              {errors.description && (
                <span className="text-xs text-red-600 font-medium block">
                  {errors.description.message}
                </span>
              )}
            </div>

            <Input
              label="LinkedIn URL"
              placeholder="https://linkedin.com/in/username"
              error={errors.linkedinUrl?.message}
              {...register('linkedinUrl')}
            />

            <Input
              label="Twitter URL"
              placeholder="https://twitter.com/username"
              error={errors.twitterUrl?.message}
              {...register('twitterUrl')}
            />

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
                isLoading={isSubmitting}
                className="flex-1 bg-primary-red hover:bg-primary-red-hover text-white"
              >
                {formMode === 'add' ? 'Create Team Member' : 'Update Team Member'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
