/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Search, Edit, Trash2, Code, FileText, ChevronLeft, ChevronRight, Briefcase, X, Plus } from 'lucide-react';
import { CaseStudy } from '../../types';
import { normalizeImageUrl } from '../../utils/image';
import Button from '../forms/Button';
import Input from '../forms/Input';
import Select from '../forms/Select';
import ImageUpload from '../forms/ImageUpload';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import RichTextEditor from '../forms/RichTextEditor';

const caseStudyFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  shortDescription: z.string().optional(),
  technologies: z.string().min(1, 'Technologies are required'),
  status: z.enum(['Active', 'Inactive']),
  image: z.union([z.string().min(1, 'Case study image is required'), z.instanceof(File)]),
  content: z.string().min(10, 'Case study content must be at least 10 characters'),
});

const normalizeTechnologiesValue = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : String(item).trim()))
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => (typeof item === 'string' ? item.trim() : String(item).trim()))
          .filter(Boolean);
      }
    } catch {
      // fall back to comma-separated parsing
    }

    return trimmed
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

type CaseStudyFormValues = z.infer<typeof caseStudyFormSchema>;

interface CaseStudiesViewProps {
  caseStudies: CaseStudy[];
  onAddCaseStudy: (cs: Omit<CaseStudy, 'id' | 'createdAt' | 'slug'> | FormData) => Promise<CaseStudy | void>;
  onEditCaseStudy: (id: string, cs: Partial<CaseStudy> | FormData) => Promise<CaseStudy | void>;
  onDeleteCaseStudy: (id: string) => Promise<void>;
}

export default function CaseStudiesView({
  caseStudies,
  onAddCaseStudy,
  onEditCaseStudy,
  onDeleteCaseStudy,
}: CaseStudiesViewProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [formMode, setFormMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<CaseStudyFormValues>({
    resolver: zodResolver(caseStudyFormSchema),
    defaultValues: {
      title: '',
      shortDescription: '',
      technologies: '',
      status: 'Active',
      image: '',
      content: '',
    },
  });

  const uploadedImageUrl = watch('image');

  // Filter Logic
  const filteredStudies = caseStudies.filter((cs) => {
    const technologiesText = Array.isArray(cs.technologies)
      ? cs.technologies.join(' ')
      : (cs.technologies || '');
    const matchesSearch = cs.title.toLowerCase().includes(search.toLowerCase()) || 
                          technologiesText.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || cs.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredStudies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudies = filteredStudies.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenAdd = () => {
    reset({
      title: '',
      shortDescription: '',
      technologies: '',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&q=80',
      content: '',
    });
    setFormMode('add');
  };

  const handleOpenEdit = (cs: CaseStudy) => {
    const technologiesValue = Array.isArray(cs.technologies)
      ? cs.technologies.join(', ')
      : (cs.technologies || '');

    reset({
      title: cs.title,
      shortDescription: cs.shortDescription || '',
      technologies: technologiesValue,
      status: cs.status,
      image: cs.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&q=80',
      content: cs.content || '',
    });
    setEditingId(cs.id);
    setFormMode('edit');
  };

  const onSubmit = async (data: CaseStudyFormValues) => {
    const shortDescriptionValue = typeof data.shortDescription === 'string' ? data.shortDescription : '';
    const titleValue = data.title.trim();

    const formData = new FormData();
    formData.append('title', titleValue);
    formData.append('shortDescription', shortDescriptionValue);
    formData.append('content', data.content);
    formData.append('status', data.status);

    const technologies = normalizeTechnologiesValue(data.technologies);
    technologies.forEach((tech) => {
      formData.append('technologies', tech);
    });

    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      if (formMode === 'add') {
        await onAddCaseStudy(formData);
      } else if (formMode === 'edit' && editingId) {
        await onEditCaseStudy(editingId, formData);
      }
      setFormMode('list');
    } catch (error) {
      console.error('[CASE STUDIES] Submit failed:', error);
    }
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm shadow-gray-100/50 animate-fade-in select-none">
      
      {formMode === 'list' ? (
        /* LIST VIEW */
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Left search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
              <input
                type="text"
                placeholder="Search case studies..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-4 py-2 border border-border-gray rounded-lg text-sm text-text-dark bg-gray-50/50 outline-none focus:bg-white focus:border-primary-red focus:ring-2 focus:ring-red-50 transition-all"
              />
            </div>

            {/* Filter & Create button */}
            <div className="flex flex-wrap items-center gap-3">
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

              <Button onClick={handleOpenAdd} className="bg-[#DF0A0A] hover:bg-[#C00808] text-white">
                <Plus className="w-4 h-4 mr-1.5" />
                Add Case Study
              </Button>
            </div>
          </div>

          {/* Cases grid */}
          {paginatedStudies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedStudies.map((study) => (
                <div key={study.id} className="group relative border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col bg-white">
                  {/* Image area */}
                  <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
                    <img 
                      src={normalizeImageUrl(study.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&q=80')} 
                      alt={study.title}
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        study.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}>
                        {study.status}
                      </span>
                    </div>
                  </div>

                  {/* Body content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-red transition-colors line-clamp-1 mb-2">
                        {study.title}
                      </h3>
                      
                      {/* Technologies */}
                      <div className="flex items-start gap-1.5 mb-3 text-xs text-gray-500">
                        <Code className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                        <span className="line-clamp-2 italic font-mono">
                          {Array.isArray(study.technologies) ? study.technologies.join(', ') : study.technologies}
                        </span>
                      </div>

                      {/* Content excerpt preview */}
                      <div 
                        className="text-xs text-gray-500 line-clamp-3 mb-4 prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: study.content || 'No content provided.' }}
                      />
                    </div>

                    {/* Actions bar */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                      <span className="text-[11px] font-medium text-gray-400">
                        Created: {study.createdAt || 'N/A'}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(study)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-all cursor-pointer"
                          title="Edit Case Study"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('Are you sure you want to delete this case study?')) {
                              try {
                                await onDeleteCaseStudy(study.id);
                                toast.success('Case study deleted successfully!');
                              } catch (error) {
                                console.error('[CASE STUDIES] Delete failed:', error);
                              }
                            }
                          }}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-all cursor-pointer"
                          title="Delete Case Study"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
              <Briefcase className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-sm font-medium text-gray-500">No case studies found.</p>
              <p className="text-xs text-gray-400 mt-1">Try modifying your search or filters.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-6">
              <p className="text-xs font-medium text-gray-500">
                Showing <span className="font-semibold text-gray-700">{startIndex + 1}</span> to{' '}
                <span className="font-semibold text-gray-700">
                  {Math.min(startIndex + itemsPerPage, filteredStudies.length)}
                </span>{' '}
                of <span className="font-semibold text-gray-700">{filteredStudies.length}</span> case studies
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <span className="text-xs font-semibold text-gray-600 px-3 py-1 bg-gray-100 rounded-lg">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* CREATE / EDIT FORM VIEW */
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-red-50 text-primary-red rounded-lg">
                <Briefcase className="w-[18px] h-[18px]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {formMode === 'add' ? 'Create New Case Study' : 'Edit Case Study'}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Complete the fields below to publish a case study highlight.
                </p>
              </div>
            </div>
            <button
              onClick={() => setFormMode('list')}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form inputs column */}
            <div className="lg:col-span-2 space-y-6">
              <Input
                label="Case Study Title"
                placeholder="e.g. Revolutionizing Healthcare SaaS Platform"
                error={errors.title?.message}
                {...register('title')}
              />

              <Input
                label="Technologies Used"
                placeholder="e.g. React, Node.js, GraphQL, AWS, Tailwind CSS (comma-separated)"
                error={errors.technologies?.message}
                {...register('technologies')}
              />
              <Input
                label="Short Description"
                placeholder="Enter a short description"
                error={errors.shortDescription?.message}
                {...register('shortDescription')}
              />
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  Detailed Case Content / Success Story
                </label>
                <div className="border border-border-gray rounded-xl overflow-hidden min-h-[300px]">
                  <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                {errors.content && (
                  <p className="text-xs font-semibold text-primary-red mt-1">
                    {errors.content.message}
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar / Options column */}
            <div className="space-y-6">
              <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100 space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                    Visibility Status
                  </label>
                  <Select
                    options={[
                      { value: 'Active', label: 'Active (Visible)' },
                      { value: 'Inactive', label: 'Inactive (Hidden)' },
                    ]}
                    error={errors.status?.message}
                    {...register('status')}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                    Case Study Image
                  </label>
                  <ImageUpload
                    value={uploadedImageUrl}
                    onChange={(url) => setValue('image', url, { shouldValidate: true })}
                    error={errors.image?.message}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="submit"
                  className="flex-1 bg-[#DF0A0A] hover:bg-[#C00808] text-white"
                >
                  {formMode === 'add' ? 'Publish Case Study' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormMode('list')}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
