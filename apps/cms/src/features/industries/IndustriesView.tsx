/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Plus, Edit, Trash2, X, Minus } from 'lucide-react';
import { Industry } from '../../types';
import Button from '../../components/forms/Button';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import ImageUpload from '../../components/forms/ImageUpload';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';
import { normalizeImageUrl } from '../../lib/image';
import { logger } from '../../lib/logger';
import { toErrorMessage } from '../../services';

const industryFormSchema = z.object({
  title: z.string().min(1, 'Industry title is required'),
  icon: z.string().min(1, 'Industry icon is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  image: z.union([z.string().optional(), z.instanceof(File)]),
  segmentBenefits: z.array(z.string().min(1, 'Benefit cannot be empty')).min(1, 'At least one benefit is required'),
  status: z.enum(['Active', 'Inactive']),
});

type IndustryFormValues = z.infer<typeof industryFormSchema>;

interface IndustriesViewProps {
  industries: Industry[];
  onAddIndustry: (i: FormData) => Promise<Industry | void>;
  onEditIndustry: (id: string, i: FormData) => Promise<Industry | void>;
  onDeleteIndustry: (id: string) => Promise<void>;
}

export default function IndustriesView({
  industries,
  onAddIndustry,
  onEditIndustry,
  onDeleteIndustry,
}: IndustriesViewProps) {
  const [formMode, setFormMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingIndustryId, setEditingIndustryId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [benefits, setBenefits] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingIndustryId, setDeletingIndustryId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<IndustryFormValues>({
    resolver: zodResolver(industryFormSchema),
    defaultValues: {
      title: '',
      icon: 'Building2',
      description: '',
      image: '',
      segmentBenefits: [],
      status: 'Active',
    },
  });

  const handleOpenAdd = () => {
    reset({ title: '', icon: 'Building2', description: '', image: '', segmentBenefits: [], status: 'Active' });
    setBenefits([]);
    setValue('segmentBenefits', [], { shouldValidate: true, shouldDirty: true });
    trigger('segmentBenefits');
    setImageFile(null);
    setPreviewUrl('');
    setFormMode('add');
  };

  const handleOpenEdit = (ind: Industry) => {
    const iconValue = (ind as Industry & { icon?: string }).icon || 'Building2';

    const normalizedBenefits = ind.segmentBenefits || [];

    reset({
      title: ind.title,
      icon: iconValue,
      description: ind.description,
      image: ind.image,
      segmentBenefits: normalizedBenefits,
      status: ind.status,
    });
    setBenefits(normalizedBenefits);
    setValue('segmentBenefits', normalizedBenefits, { shouldValidate: true, shouldDirty: true });
    trigger('segmentBenefits');
    setPreviewUrl(ind.image || '');
    setImageFile(null);
    setEditingIndustryId(ind.id);
    setFormMode('edit');
  };

  const handleAddBenefit = () => {
    const updatedBenefits = [...benefits, ''];
    setBenefits(updatedBenefits);
    setValue('segmentBenefits', updatedBenefits, { shouldValidate: true, shouldDirty: true });
    trigger('segmentBenefits');
  };

  const handleRemoveBenefit = (index: number) => {
    const updatedBenefits = benefits.filter((_, i) => i !== index);
    setBenefits(updatedBenefits);
    setValue('segmentBenefits', updatedBenefits, { shouldValidate: true, shouldDirty: true });
    trigger('segmentBenefits');
  };

  const handleUpdateBenefit = (index: number, value: string) => {
    const updated = [...benefits];
    updated[index] = value;
    setBenefits(updated);
    setValue('segmentBenefits', updated, { shouldValidate: true, shouldDirty: true });
    trigger('segmentBenefits');
  };

  const onSubmit = async (data: IndustryFormValues) => {
    const filteredBenefits = benefits.filter((b) => b.trim().length > 0);
    if (filteredBenefits.length === 0) {
      toast.error('At least one benefit is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', data.title.trim());
      formData.append('description', data.description);
      formData.append('icon', data.icon);
      formData.append('status', data.status);

      filteredBenefits.forEach((benefit) => {
        formData.append('segmentBenefits', benefit);
      });

      if (data.image instanceof File) {
        formData.append('image', data.image);
      }

      if (formMode === 'add') {
        await onAddIndustry(formData);
      } else if (formMode === 'edit' && editingIndustryId) {
        await onEditIndustry(editingIndustryId, formData);
      }

      setFormMode('list');
    } catch (error: any) {
      logger.error('[INDUSTRIES] Submit failed:', error);
      toast.error(toErrorMessage(error, 'Failed to save industry'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (file: File | null, url: string) => {
    setImageFile(file);
    setPreviewUrl(url);
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm shadow-gray-100/50 animate-fade-in select-none">
      
      {formMode === 'list' ? (
        /* LIST VIEW */
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-bold text-text-dark text-base">Industries Directory</h3>
              <p className="text-xs text-text-gray font-medium mt-0.5">Manage industry sectors and benefits</p>
            </div>
            
            <Button
              variant="primary"
              onClick={handleOpenAdd}
              className="bg-primary-red hover:bg-primary-red-hover text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 px-3 py-2"
            >
              <Plus className="w-4 h-4" /> Add Industry
            </Button>
          </div>

          {industries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
              <div className="text-center space-y-2">
                <p className="text-text-gray text-sm font-medium">No industries added yet</p>
                <p className="text-text-gray text-xs">Click "Add Industry" to create a new one</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="py-3 px-4 text-left text-xs font-semibold text-text-dark">Image</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-text-dark">Title</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-text-dark">Status</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-text-dark">Created Date</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-text-dark">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {industries.map((ind) => (
                    <tr key={ind.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4">
                        {ind.image && (
                          <img
                            src={normalizeImageUrl(ind.image)}
                            alt={ind.title}
                            crossOrigin="anonymous"
                            className="w-10 h-10 object-cover rounded-lg"
                          />
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-text-dark text-sm">{ind.title}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ind.status === 'Active'
                            ? 'bg-green-50 text-emerald-600 border border-green-100'
                            : 'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}>
                          {ind.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-xs text-text-gray">{ind.createdAt || 'N/A'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(ind)}
                            className="p-1.5 rounded-lg border border-border-gray hover:border-primary-red hover:text-primary-red transition-all text-xs flex items-center gap-1 font-semibold text-text-gray hover:bg-red-50/10"
                          >
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={async () => {
                              setDeletingIndustryId(ind.id);
                              try {
                                await onDeleteIndustry(ind.id);
                              } catch (error: any) {
                                logger.error('[INDUSTRIES] Delete failed:', error);
                                toast.error(toErrorMessage(error, 'Failed to delete industry'));
                              } finally {
                                setDeletingIndustryId(null);
                              }
                            }}
                            disabled={deletingIndustryId === ind.id}
                            className="p-1.5 rounded-lg border border-border-gray hover:border-red-600 hover:text-red-600 transition-all text-xs flex items-center gap-1 font-semibold text-text-gray hover:bg-red-50/10 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> {deletingIndustryId === ind.id ? 'Deleting...' : 'Delete'}
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
        /* ADD / EDIT INDUSTRY FORM */
        <div>
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <h3 className="text-lg font-bold text-text-dark tracking-tight">
              {formMode === 'add' ? 'Add New Industry' : 'Edit Industry'}
            </h3>
            <button
              onClick={() => setFormMode('list')}
              className="p-1.5 rounded-lg hover:bg-gray-50 text-text-gray hover:text-text-dark transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
            {/* Image Upload */}
            <div>
              <label className="text-sm font-medium text-text-dark mb-1.5 block">
                Industry Image
              </label>
              <ImageUpload
                value={previewUrl}
                onChange={(value) => {
                  if (value instanceof File) {
                    setValue('image', value, { shouldValidate: true });
                    handleImageUpload(value, URL.createObjectURL(value));
                  } else {
                    setValue('image', '', { shouldValidate: true });
                    handleImageUpload(null, value);
                  }
                }}
              />
            </div>

            {/* Title Input */}
            <Input
              label="Industry Title"
              placeholder="e.g. Healthcare & Pharma"
              error={errors.title?.message}
              {...register('title')}
            />

            {/* Industry Icon Select */}
            <Select
              label="Industry Icon"
              options={[
                { value: 'Building2', label: 'Building2' },
                { value: 'Briefcase', label: 'Briefcase' },
                { value: 'Factory', label: 'Factory' },
                { value: 'Banknote', label: 'Banknote' },
                { value: 'Shield', label: 'Shield' },
                { value: 'Hospital', label: 'Hospital' },
                { value: 'GraduationCap', label: 'GraduationCap' },
                { value: 'Globe', label: 'Globe' },
                { value: 'Laptop', label: 'Laptop' },
                { value: 'ShoppingCart', label: 'ShoppingCart' },
                { value: 'Truck', label: 'Truck' },
                { value: 'Wrench', label: 'Wrench' },
                { value: 'HeartPulse', label: 'HeartPulse' },
                { value: 'Plane', label: 'Plane' },
                { value: 'Landmark', label: 'Landmark' },
              ]}
              error={errors.icon?.message}
              {...register('icon')}
            />

            {/* Status Select */}
            <Select
              label="Status"
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
              error={errors.status?.message}
              {...register('status')}
            />

            {/* Description Textarea */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-dark block">
                Industry Description
              </label>
              <textarea
                placeholder="Describe the industry sector, key services, and market opportunities..."
                className="w-full min-h-75 px-3.5 py-2.5 rounded-lg border border-border-gray focus:border-primary-red focus:ring-2 focus:ring-red-50 text-sm text-text-dark outline-none transition-all resize-y"
                {...register('description')}
              />
              {errors.description && (
                <span className="text-xs text-red-600 font-medium block">
                  {errors.description.message}
                </span>
              )}
            </div>

            {/* Segment Benefits */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-dark">Segment Benefits</label>
                <button
                  type="button"
                  onClick={handleAddBenefit}
                  className="text-xs font-semibold text-primary-red hover:text-primary-red-hover transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Benefit
                </button>
              </div>

              <div className="space-y-2">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => handleUpdateBenefit(index, e.target.value)}
                      placeholder={`Benefit ${index + 1}`}
                      className="flex-1 px-3.5 py-2.5 rounded-lg border border-border-gray focus:border-primary-red focus:ring-2 focus:ring-red-50 text-sm text-text-dark outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(index)}
                      className="p-2 rounded-lg border border-red-200 hover:border-red-600 hover:text-red-600 transition-all text-text-gray"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {benefits.length === 0 && (
                  <p className="text-xs text-text-gray italic">No benefits added yet. Click "Add Benefit" to get started.</p>
                )}
              </div>
              {errors.segmentBenefits && (
                <span className="text-xs text-red-600 font-medium block">
                  {typeof errors.segmentBenefits.message === 'string' && errors.segmentBenefits.message}
                </span>
              )}
            </div>

            {/* Form Actions */}
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
                className="w-28 bg-[#DC2626] hover:bg-red-700 text-white"
              >
                Save Industry
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
