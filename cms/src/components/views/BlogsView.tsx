/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Search,
  Edit,
  Trash2,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  X,
} from "lucide-react";
import { Blog } from "../../types";
import { normalizeImageUrl } from "../../utils/image";
import Button from "../forms/Button";
import Input from "../forms/Input";
import Select from "../forms/Select";
import TextArea from "../forms/TextArea";
import ImageUpload from "../forms/ImageUpload";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import RichTextEditor from "../forms/RichTextEditor";

const blogFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  authorName: z.string().min(1, "Author name is required"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["Published", "Draft"]),
  image: z.union([z.string().min(1, "Blog image is required"), z.instanceof(File)]),
  content: z.string().min(10, "Blog content must be at least 10 characters"),
  createdBy: z.string().min(1, "Created By is required"),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

interface BlogsViewProps {
  blogs: Blog[];
  onAddBlog: (b: Omit<Blog, "id" | "publishedAt">) => Promise<Blog>;
  onEditBlog: (id: string, b: Partial<Blog>) => Promise<Blog>;
  onDeleteBlog: (id: string) => void;
  currentUserName: string;
}

export default function BlogsView({
  blogs,
  onAddBlog,
  onEditBlog,
  onDeleteBlog,
  currentUserName,
}: BlogsViewProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [formMode, setFormMode] = useState<"list" | "add" | "edit">("list");
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
  });

  const uploadedImageUrl = watch("image");

  // Filter Logic
  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || b.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Extract all categories dynamically for filter options
  const uniqueCategories = Array.from(new Set(blogs.map((b) => b.category)));

  // Pagination Logic
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBlogs = filteredBlogs.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleOpenAdd = () => {
    reset({
      title: "",
      authorName: "",
      category: "",
      status: "Published",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=400&h=250&q=80",
      content: "",
      createdBy: currentUserName,
    });
    setFormMode("add");
  };

  const handleOpenEdit = (blog: Blog) => {
    reset({
      title: blog.title,
      authorName: blog.authorName || "",
      category: blog.category,
      status: blog.status,
      image: blog.image,
      content:
        blog.content || "Dummy blog content default string values here...",
      createdBy: currentUserName || blog.createdBy || "",
    });
    setEditingBlogId(blog.id);
    setFormMode("edit");
  };

  const onSubmit = async (data: BlogFormValues) => {
    const payload = {
      ...data,
      authorName: data.authorName.trim(),
      createdBy: data.createdBy.trim(),
      status:
        data.status === "Published"
          ? "Active"
          : data.status === "Draft"
            ? "Inactive"
            : data.status,
    };

    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("authorName", payload.authorName);
    formData.append("category", payload.category);
    formData.append("status", payload.status);
    formData.append("content", payload.content);
    formData.append("createdBy", payload.createdBy);

    if (payload.image) {
      formData.append("image", payload.image as string | Blob);
    }

    console.log("[BLOGS] FormData entries:", Array.from(formData.entries()));
    const imageEntry = formData.get("image");
    console.log("[BLOGS] image field:", imageEntry);
    console.log("[BLOGS] image field type:", imageEntry instanceof File ? "File" : typeof imageEntry);

    console.log("[BLOGS] Payload ready for backend:", payload);

    try {
      if (formMode === "add") {
        await onAddBlog(formData as any);
        toast.success("Blog created successfully!");
      } else if (formMode === "edit" && editingBlogId) {
        await onEditBlog(editingBlogId, formData as any);
        toast.success("Blog updated successfully!");
      }
      setFormMode("list");
    } catch (error: any) {
      console.error('[BLOGS] Error saving blog:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to save blog.');
    }
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm shadow-gray-100/50 animate-fade-in select-none">
      {formMode === "list" ? (
        /* LIST VIEW TABLE */
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-4 py-2 border border-border-gray rounded-lg text-sm text-text-dark bg-gray-50/50 outline-none focus:bg-white focus:border-primary-red focus:ring-2 focus:ring-red-50 transition-all"
              />
            </div>

            {/* Filter selects & Create Blog trigger */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border border-border-gray text-xs font-semibold text-text-gray px-3 py-2 rounded-lg outline-none focus:border-primary-red transition-all cursor-pointer"
              >
                <option value="All">All Categories</option>
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
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
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>

              <Button
                variant="primary"
                onClick={handleOpenAdd}
                className="bg-primary-red hover:bg-primary-red-hover text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 px-3 py-2"
              >
                <BookOpen className="w-4 h-4" /> Add Blog
              </Button>
            </div>
          </div>

          {/* Table list */}
          <div className="w-full overflow-x-auto border border-gray-100 rounded-xl">
            <table className="w-full text-left text-sm border-collapse min-w-175">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-text-gray uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Published Date</th>
                  <th className="py-3 px-4 w-28 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedBlogs.length > 0 ? (
                  paginatedBlogs.map((blog, idx) => (
                    <tr
                      key={blog.id}
                      className="hover:bg-gray-50/40 transition-colors group"
                    >
                      <td className="py-3.5 px-4 text-center text-text-gray font-semibold">
                        {startIndex + idx + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <img
                          src={normalizeImageUrl(blog.image)}
                          alt={blog.title}
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                          className="w-16 h-11 object-cover rounded-lg border border-gray-100"
                        />
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-text-dark group-hover:text-primary-red transition-colors max-w-xs truncate">
                        {blog.title}
                      </td>
                      <td className="py-3.5 px-4 text-text-gray font-semibold text-xs">
                        {blog.category}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                            blog.status === "Published"
                              ? "bg-green-50 text-green-600 border border-green-100"
                              : "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}
                        >
                          {blog.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-text-gray font-medium text-xs">
                        {blog.publishedAt}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(blog)}
                            className="p-1.5 rounded-lg border border-border-gray hover:border-primary-red hover:text-primary-red transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteBlog(blog.id)}
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
                    <td
                      colSpan={7}
                      className="text-center py-10 text-text-gray font-semibold"
                    >
                      No blogs found.
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
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredBlogs.length)} of{" "}
                {filteredBlogs.length} entries
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
                        ? "bg-[#DC2626] text-white"
                        : "border border-border-gray hover:bg-gray-50"
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
        /* CREATE / EDIT FORM VIEWS */
        <div>
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <h3 className="text-lg font-bold text-text-dark tracking-tight">
              {formMode === "add" ? "Add New Blog Post" : "Edit Blog Post"}
            </h3>
            <button
              onClick={() => setFormMode("list")}
              className="p-1.5 rounded-lg hover:bg-gray-50 text-text-gray hover:text-text-dark transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 max-w-2xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Blog Title"
                  placeholder="e.g. The Future of Machine Learning"
                  error={errors.title?.message}
                  {...register("title")}
                />
              </div>
              <Input
                label="Category"
                placeholder="e.g. Technology"
                error={errors.category?.message}
                {...register("category")}
              />
            </div>

            <Input
              label="Author Name"
              placeholder="e.g. Founder Name"
              error={errors.authorName?.message}
              {...register("authorName")}
            />

            <Input
              label="Created By"
              placeholder="Current logged-in user"
              error={errors.createdBy?.message}
              readOnly
              {...register("createdBy")}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ImageUpload
                label="Blog Featured Image"
                value={uploadedImageUrl}
                onChange={(url) =>
                  setValue("image", url, { shouldValidate: true })
                }
                error={errors.image?.message}
              />

              <div className="flex flex-col justify-end">
                <Select
                  label="Publish Status"
                  options={[
                    { value: "Published", label: "Published" },
                    { value: "Draft", label: "Draft" },
                  ]}
                  error={errors.status?.message}
                  {...register("status")}
                />
              </div>
            </div>

            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  label="Blog Post Body Content"
                  placeholder="Start drafting blog details here..."
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.content?.message}
                />
              )}
            />

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => setFormMode("list")}
                className="w-28"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-28 bg-[#DC2626] hover:bg-red-700 text-white"
              >
                Publish Blog
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
