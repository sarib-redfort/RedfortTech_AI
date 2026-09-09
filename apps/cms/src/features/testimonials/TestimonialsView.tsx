/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Star, Plus, Edit, Trash2, X, Quote } from 'lucide-react';
import { Testimonial } from '../../types';
import { normalizeImageUrl } from '../../lib/image';
import Button from '../../components/forms/Button';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import TextArea from '../../components/forms/TextArea';
import ImageUpload from '../../components/forms/ImageUpload';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';
import { logger } from '../../lib/logger';
import { toErrorMessage } from '../../services';

const testimonialSchema = z.object({
  name: z.string().min(1, 'Author name is required'),
  role: z.string().min(1, 'Corporate role is required'),
  company: z.string().min(1, 'Company is required'),
  avatar: z.union([z.string(), z.instanceof(File)]).optional(),
  rating: z.coerce.number().min(1).max(5),
  message: z.string().min(10, 'Message quote must be at least 10 characters'),
});

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'string') return error;
  return undefined;
};

type TestimonialFormValues = {
  name: string;
  role: string;
  company: string;
  avatar?: string | File;
  rating: number;
  message: string;
};

interface TestimonialsViewProps {
  testimonials: Testimonial[];
  onAddTestimonial: (t: FormData) => Promise<unknown> | unknown;
  onEditTestimonial: (id: string, t: FormData) => Promise<unknown> | unknown;
  onDeleteTestimonial: (id: string) => void;
}

const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80';

export default function TestimonialsView({
  testimonials,
  onAddTestimonial,
  onEditTestimonial,
  onDeleteTestimonial,
}: TestimonialsViewProps) {
  const [formMode, setFormMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: '',
      role: '',
      company: '',
      avatar: defaultAvatar,
      rating: 5,
      message: '',
    },
  });

  const avatarValue = watch('avatar');

  const handleOpenAdd = () => {
    reset({
      name: '',
      role: '',
      company: '',
      avatar: defaultAvatar,
      rating: 5,
      message: '',
    });
    setEditingId(null);
    setFormMode('add');
  };

  const handleOpenEdit = (t: Testimonial) => {
    reset({
      name: t.name,
      role: t.role,
      company: t.company,
      avatar: t.avatar,
      rating: t.rating,
      message: t.message,
    });
    setEditingId(t.id);
    setFormMode('edit');
  };

  const handleAvatarChange = (value: string | File) => {
    setValue('avatar', value, { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = async (data: TestimonialFormValues) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('role', data.role);
    formData.append('company', data.company);
    formData.append('rating', String(data.rating));
    formData.append('message', data.message);

    if (data.avatar instanceof File) {
      formData.append('avatar', data.avatar);
    }

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        logger.debug(key, value.name, value.type);
      } else {
        logger.debug(key, value);
      }
    }

    try {
      if (formMode === 'add') {
        await onAddTestimonial(formData);
        toast.success('Testimonial added successfully!');
      } else if (formMode === 'edit' && editingId) {
        await onEditTestimonial(editingId, formData);
        toast.success('Testimonial updated successfully!');
      }
      reset({
        name: '',
        role: '',
        company: '',
        avatar: defaultAvatar,
        rating: 5,
        message: '',
      });
      setEditingId(null);
      setFormMode('list');
    } catch (error: any) {
      logger.error('[TESTIMONIALS] Submit failed:', error);
      toast.error(toErrorMessage(error, 'Failed to save testimonial'));
    }
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm shadow-gray-100/50 animate-fade-in select-none">
      
      {formMode === 'list' ? (
        /* CARD LIST VIEWS */
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-bold text-text-dark text-base">Client Testimonials</h3>
              <p className="text-xs text-text-gray font-medium mt-0.5">Endorsements displayed on the main corporate index</p>
            </div>
            
            <Button
              variant="primary"
              onClick={handleOpenAdd}
              className="bg-primary-red hover:bg-primary-red-hover text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 px-3 py-2"
            >
              <Plus className="w-4 h-4" /> Add Testimonial
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <motion.div
                key={t.id}
                whileHover={{ y: -4 }}
                className="bg-white border border-border-gray rounded-xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all relative"
              >
                {/* Decorative Quote Icon */}
                <div className="absolute top-4 right-4 opacity-5 text-primary-red">
                  <Quote className="w-12 h-12" />
                </div>

                <div>
                  {/* Rating Stars row */}
                  <div className="flex gap-0.5 text-amber-400 mb-3.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                    {Array.from({ length: 5 - t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-gray-200" />
                    ))}
                  </div>

                  <p className="text-xs text-text-gray italic leading-relaxed font-semibold mb-6">
                    "{t.message}"
                  </p>
                </div>

                {/* Author profile block */}
                <div className="border-t border-gray-100/80 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={normalizeImageUrl(t.avatar)}
                      alt={t.name} 
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      className="w-9 h-9 rounded-full object-cover border border-[#E5E7EB]"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-text-dark">{t.name}</h5>
                      <p className="text-[10px] text-text-gray font-medium">{t.role}</p>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(t)}
                      className="p-1 rounded hover:bg-gray-50 border border-gray-100 hover:border-primary-red hover:text-primary-red transition-all"
                    >
                      <Edit className="w-3.5 h-3.5 text-text-gray hover:text-inherit" />
                    </button>
                    <button
                      onClick={() => onDeleteTestimonial(t.id)}
                      className="p-1 rounded hover:bg-gray-50 border border-gray-100 hover:border-red-600 hover:text-red-600 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-text-gray hover:text-inherit" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        /* ADD / EDIT FORMS */
        <div>
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <h3 className="text-lg font-bold text-text-dark tracking-tight">
              {formMode === 'add' ? 'Add New Testimonial' : 'Edit Testimonial'}
            </h3>
            <button
              onClick={() => setFormMode('list')}
              className="p-1.5 rounded-lg hover:bg-gray-50 text-text-gray hover:text-text-dark transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Author Full Name"
                placeholder="e.g. John Smith"
                error={getErrorMessage(errors.name?.message)}
                {...register('name')}
              />

              <Input
                label="Corporate Position / Role"
                placeholder="e.g. CTO"
                error={getErrorMessage(errors.role?.message)}
                {...register('role')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company / Enterprise"
                placeholder="e.g. Google DeepMind"
                error={getErrorMessage(errors.company?.message)}
                {...register('company')}
              />

              <Select
                label="Star Rating"
                options={[
                  { value: '5', label: '5 Stars' },
                  { value: '4', label: '4 Stars' },
                  { value: '3', label: '3 Stars' },
                  { value: '2', label: '2 Stars' },
                  { value: '1', label: '1 Star' },
                ]}
                error={getErrorMessage(errors.rating?.message)}
                {...register('rating')}
              />
            </div>

            <TextArea
              label="Endorsement Quote Quote Statement"
              placeholder="Type client statement..."
              rows={4}
              error={getErrorMessage(errors.message?.message)}
              {...register('message')}
            />

            <ImageUpload
              label="Avatar Image"
              value={avatarValue}
              onChange={handleAvatarChange}
              error={getErrorMessage(errors.avatar?.message)}
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
                className="w-28 bg-[#DC2626] hover:bg-red-700 text-white"
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
