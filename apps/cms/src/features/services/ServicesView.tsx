/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  Cpu,
  Globe,
  Smartphone,
  Palette,
  TrendingUp,
  Cloud,
  Database,
  Shield,
  Bot,
  Server,
  Settings,
  Users,
  Briefcase,
  BarChart3,
  ChartPie,
  Wrench,
  Hammer,
  Lock,
  Search,
  Megaphone,
  Mail,
  Phone,
  Building2,
  Network,
  Workflow,
  Layers3,
  Rocket,
  Brain,
  Plus,
  Edit,
  Trash2,
  X,
} from 'lucide-react';
import { Service } from '../../types';
import Button from '../../components/forms/Button';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import RichTextEditor from '../../components/forms/RichTextEditor';
import HtmlContent from '../../components/common/HtmlContent';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';
import { logger } from '../../lib/logger';

const serviceFormSchema = z.object({
  title: z.string().min(1, 'Service title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  icon: z.string().min(1, 'Icon designation is required'),
  status: z.enum(['Active', 'Inactive']),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

const serviceIconOptions = [
  { value: 'Cpu', label: 'Cpu' },
  { value: 'Globe', label: 'Globe' },
  { value: 'Smartphone', label: 'Smartphone' },
  { value: 'Palette', label: 'Palette' },
  { value: 'TrendingUp', label: 'Trending Up' },
  { value: 'Cloud', label: 'Cloud' },
  { value: 'Database', label: 'Database' },
  { value: 'Shield', label: 'Shield' },
  { value: 'Bot', label: 'Bot' },
  { value: 'Server', label: 'Server' },
  { value: 'Settings', label: 'Settings' },
  { value: 'Users', label: 'Users' },
  { value: 'Briefcase', label: 'Briefcase' },
  { value: 'BarChart3', label: 'Bar Chart' },
  { value: 'ChartPie', label: 'Chart Pie' },
  { value: 'Wrench', label: 'Wrench' },
  { value: 'Hammer', label: 'Hammer' },
  { value: 'Lock', label: 'Lock' },
  { value: 'Search', label: 'Search' },
  { value: 'Megaphone', label: 'Megaphone' },
  { value: 'Mail', label: 'Mail' },
  { value: 'Phone', label: 'Phone' },
  { value: 'Building2', label: 'Building' },
  { value: 'Network', label: 'Network' },
  { value: 'Workflow', label: 'Workflow' },
  { value: 'Layers3', label: 'Layers' },
  { value: 'Rocket', label: 'Rocket' },
  { value: 'Brain', label: 'Brain' },
];

interface ServicesViewProps {
  services: Service[];
  onAddService: (s: Omit<Service, 'id'>) => void;
  onEditService: (id: string, s: Partial<Service>) => void;
  onDeleteService: (id: string) => void;
}

export default function ServicesView({
  services,
  onAddService,
  onEditService,
  onDeleteService,
}: ServicesViewProps) {
  const [formMode, setFormMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
  });

  const getIcon = (name: string) => {
    switch (name) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-primary-red" />;
      case 'Globe': return <Globe className="w-5 h-5 text-primary-red" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-primary-red" />;
      case 'Palette': return <Palette className="w-5 h-5 text-primary-red" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-primary-red" />;
      case 'Cloud': return <Cloud className="w-5 h-5 text-primary-red" />;
      case 'Database': return <Database className="w-5 h-5 text-primary-red" />;
      case 'Shield': return <Shield className="w-5 h-5 text-primary-red" />;
      case 'Bot': return <Bot className="w-5 h-5 text-primary-red" />;
      case 'Server': return <Server className="w-5 h-5 text-primary-red" />;
      case 'Settings': return <Settings className="w-5 h-5 text-primary-red" />;
      case 'Users': return <Users className="w-5 h-5 text-primary-red" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-primary-red" />;
      case 'BarChart3': return <BarChart3 className="w-5 h-5 text-primary-red" />;
      case 'ChartPie': return <ChartPie className="w-5 h-5 text-primary-red" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-primary-red" />;
      case 'Hammer': return <Hammer className="w-5 h-5 text-primary-red" />;
      case 'Lock': return <Lock className="w-5 h-5 text-primary-red" />;
      case 'Search': return <Search className="w-5 h-5 text-primary-red" />;
      case 'Megaphone': return <Megaphone className="w-5 h-5 text-primary-red" />;
      case 'Mail': return <Mail className="w-5 h-5 text-primary-red" />;
      case 'Phone': return <Phone className="w-5 h-5 text-primary-red" />;
      case 'Building2': return <Building2 className="w-5 h-5 text-primary-red" />;
      case 'Network': return <Network className="w-5 h-5 text-primary-red" />;
      case 'Workflow': return <Workflow className="w-5 h-5 text-primary-red" />;
      case 'Layers3': return <Layers3 className="w-5 h-5 text-primary-red" />;
      case 'Rocket': return <Rocket className="w-5 h-5 text-primary-red" />;
      case 'Brain': return <Brain className="w-5 h-5 text-primary-red" />;
      default: return <Cpu className="w-5 h-5 text-primary-red" />;
    }
  };

  const handleOpenAdd = () => {
    reset({ title: '', description: '', icon: 'Cpu', status: 'Active' });
    setFormMode('add');
  };

  const handleOpenEdit = (svc: Service) => {
    reset({
      title: svc.title,
      description: svc.description,
      icon: svc.icon,
      status: svc.status,
    });
    setEditingServiceId(svc.id);
    setFormMode('edit');
  };

  const onSubmit = (data: ServiceFormValues) => {
    const payload = {
      ...data,
      title: data.title.trim(),
      icon: data.icon.trim(),
    };

    logger.debug('[SERVICES] Payload ready for backend:', payload);

    if (formMode === 'add') {
      onAddService(payload);
      toast.success('Service created successfully!');
    } else if (formMode === 'edit' && editingServiceId) {
      onEditService(editingServiceId, payload);
      toast.success('Service updated successfully!');
    }
    setFormMode('list');
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm shadow-gray-100/50 animate-fade-in select-none">
      
      {formMode === 'list' ? (
        /* GRID LIST VIEW */
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-bold text-text-dark text-base">Our Interactive Services</h3>
              <p className="text-xs text-text-gray font-medium mt-0.5">Custom agency pipelines and offerings</p>
            </div>
            
            <Button
              variant="primary"
              onClick={handleOpenAdd}
              className="bg-primary-red hover:bg-primary-red-hover text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 px-3 py-2"
            >
              <Plus className="w-4 h-4" /> Add Service
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc) => (
              <motion.div
                key={svc.id}
                whileHover={{ y: -4 }}
                className="bg-white border border-border-gray rounded-xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all relative group"
              >
                <div>
                  {/* Icon & Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-red-50 rounded-xl">
                      {getIcon(svc.icon)}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      svc.status === 'Active' ? 'bg-green-50 text-emerald-600 border border-green-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}>
                      {svc.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-text-dark text-base mb-2 group-hover:text-primary-red transition-colors">
                    {svc.title}
                  </h4>
                  <HtmlContent
                    html={svc.description}
                    className="text-xs text-text-gray leading-relaxed font-medium [&_p]:mb-2 [&_p]:mt-0 [&_ul]:my-2 [&_ol]:my-2"
                  />
                </div>

                {/* Card footer buttons */}
                <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-gray-100/70">
                  <button
                    onClick={() => handleOpenEdit(svc)}
                    className="p-1.5 rounded-lg border border-border-gray hover:border-primary-red hover:text-primary-red transition-all text-xs flex items-center gap-1 font-semibold text-text-gray hover:bg-red-50/10"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => onDeleteService(svc.id)}
                    className="p-1.5 rounded-lg border border-border-gray hover:border-red-600 hover:text-red-600 transition-all text-xs flex items-center gap-1 font-semibold text-text-gray hover:bg-red-50/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        /* ADD / EDIT SERVICES FORM */
        <div>
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <h3 className="text-lg font-bold text-text-dark tracking-tight">
              {formMode === 'add' ? 'Add New Service Offering' : 'Edit Service Offering'}
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
              label="Service Title"
              placeholder="e.g. Graphic Systems Architecture"
              error={errors.title?.message}
              {...register('title')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="System Display Icon"
                options={serviceIconOptions}
                error={errors.icon?.message}
                {...register('icon')}
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

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  label="Service Brief Description"
                  placeholder="Provide a client-facing statement summarizing target service utility..."
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.description?.message}
                />
              )}
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
                Save service
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
