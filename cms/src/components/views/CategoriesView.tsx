/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Edit, Trash2, Tag, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Category } from '../../types';
import Button from '../forms/Button';
import Input from '../forms/Input';
import Select from '../forms/Select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';

const categoryFormSchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().min(1, 'Slug is required'),
  status: z.enum(['Active', 'Inactive']),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoriesViewProps {
  categories: Category[];
  onAddCategory: (c: Omit<Category, 'id'>) => void;
  onEditCategory: (id: string, c: Partial<Category>) => void;
  onDeleteCategory: (id: string) => void;
}

export default function CategoriesView({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}: CategoriesViewProps) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [formMode, setFormMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
  });

  // Automatically update slug as category name changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('name', val);
    setValue('slug', val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  // Filter Logic
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination Logic
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenAdd = () => {
    reset({ name: '', slug: '', status: 'Active' });
    setFormMode('add');
  };

  const handleOpenEdit = (cat: Category) => {
    reset({
      name: cat.name,
      slug: cat.slug,
      status: cat.status,
    });
    setEditingCatId(cat.id);
    setFormMode('edit');
  };

  const onSubmit = (data: CategoryFormValues) => {
    if (formMode === 'add') {
      onAddCategory(data);
      toast.success('Category created successfully!');
    } else if (formMode === 'edit' && editingCatId) {
      onEditCategory(editingCatId, data);
      toast.success('Category updated successfully!');
    }
    setFormMode('list');
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm shadow-gray-100/50 animate-fade-in select-none">
      
      {formMode === 'list' ? (
        /* LIST MODE TABLE */
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Left search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-4 py-2 border border-border-gray rounded-lg text-sm text-text-dark bg-gray-50/50 outline-none focus:bg-white focus:border-primary-red focus:ring-2 focus:ring-red-50 transition-all"
              />
            </div>

            {/* Create trigger button */}
            <Button
              variant="primary"
              onClick={handleOpenAdd}
              className="bg-primary-red hover:bg-primary-red-hover text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 px-3 py-2"
            >
              <Tag className="w-4 h-4" /> Add Category
            </Button>
          </div>

          {/* Table list */}
          <div className="w-full overflow-x-auto border border-gray-100 rounded-xl">
            <table className="w-full text-left text-sm border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-text-gray uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 w-28 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedCategories.length > 0 ? (
                  paginatedCategories.map((cat, idx) => (
                    <tr key={cat.id} className="hover:bg-gray-50/40 transition-colors group">
                      <td className="py-3.5 px-4 text-center text-text-gray font-semibold">
                        {startIndex + idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-text-dark group-hover:text-primary-red transition-colors">
                        {cat.name}
                      </td>
                      <td className="py-3.5 px-4 text-text-gray font-mono text-xs">
                        {cat.slug}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-xs font-semibold flex items-center gap-1.5 ${
                          cat.status === 'Active' ? 'text-emerald-600' : 'text-rose-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cat.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {cat.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(cat)}
                            className="p-1.5 rounded-lg border border-border-gray hover:border-primary-red hover:text-primary-red transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteCategory(cat.id)}
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
                    <td colSpan={5} className="text-center py-10 text-text-gray font-semibold">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination bar */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-medium text-text-gray">
              <span>
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCategories.length)} of {filteredCategories.length} entries
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
        /* ADD / EDIT CATEGORY FORMS */
        <div>
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <h3 className="text-lg font-bold text-text-dark tracking-tight">
              {formMode === 'add' ? 'Add New Category' : 'Edit Category'}
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
              label="Category Name"
              placeholder="e.g. Artificial Intelligence"
              error={errors.name?.message}
              {...register('name')}
              onChange={handleNameChange}
            />

            <Input
              label="Slug"
              placeholder="artificial-intelligence"
              error={errors.slug?.message}
              {...register('slug')}
              readOnly
              className="bg-gray-50/60"
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
