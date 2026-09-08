/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, DragEvent, ChangeEvent, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import Button from './Button';
import { normalizeImageUrl } from '../../utils/image';

interface ImageUploadProps {
  label?: string;
  value?: string | File;
  onChange?: (value: string | File) => void;
  error?: string;
}

export default function ImageUpload({
  label,
  value,
  onChange,
  error,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isRemoteImage = (candidate?: string | null) => {
    if (!candidate) return false;
    return /^https?:\/\//i.test(candidate);
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    if (typeof value === 'string' && value) {
      if (value.startsWith('blob:')) {
        setPreviewUrl(value);
      } else {
        setPreviewUrl(normalizeImageUrl(value));
      }
      return;
    }

    setPreviewUrl(null);
  }, [value]);

  const handleFile = (file: File) => {
    // Keep local preview as a blob URL only for UI rendering.
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    if (onChange) {
      onChange(file);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setPreviewUrl(null);
    if (onChange) {
      onChange('');
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <span className="text-sm font-medium text-text-dark">
          {label}
        </span>
      )}

      {previewUrl ? (
        /* Image Preview state with clear option */
        <div className="relative w-full aspect-video max-h-56 rounded-xl overflow-hidden border border-border-gray group">
          <img 
            src={previewUrl || ''} 
            alt="uploaded banner preview" 
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={onButtonClick}
              className="bg-white border-transparent text-text-dark px-3 py-1.5 font-medium text-xs rounded-lg"
            >
              Change
            </Button>
            <button
              type="button"
              onClick={removeImage}
              className="p-1.5 bg-red-600 text-white hover:bg-red-700 transition-colors rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Dropzone Upload Box state */
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`
            w-full aspect-video max-h-56 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center transition-all duration-200 cursor-pointer select-none
            ${dragActive 
              ? 'border-primary-red bg-red-50/30' 
              : 'border-gray-300 hover:border-primary-red/60 hover:bg-gray-50/50'
            }
          `}
          onClick={onButtonClick}
        >
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-text-gray group-hover:text-primary-red mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-text-dark">
            Drag and drop your image, or <span className="text-primary-red hover:underline">browse</span>
          </p>
          <p className="text-xs text-text-gray mt-1 font-medium">
            Supports: JPG, PNG, GIF, SVG (Max 5MB)
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />

      {error && (
        <span className="text-xs text-red-600 font-medium">
          {error}
        </span>
      )}
    </div>
  );
}
