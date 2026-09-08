/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChevronRight } from 'lucide-react';
import Button from '../forms/Button';

interface PageHeaderProps {
  title: string;
  breadcrumbs: string[];
  actionLabel?: string;
  onActionClick?: () => void;
}

export default function PageHeader({
  title,
  breadcrumbs,
  actionLabel,
  onActionClick,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 select-none">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-dark">
          {title}
        </h1>
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-text-gray font-medium mt-1">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <span className={index === breadcrumbs.length - 1 ? 'text-text-dark font-semibold' : ''}>
                {crumb}
              </span>
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="w-3 h-3 text-gray-400" />
              )}
            </div>
          ))}
        </div>
      </div>

      {actionLabel && onActionClick && (
        <Button 
          variant="primary" 
          onClick={onActionClick}
          className="bg-primary-red hover:bg-primary-red-hover text-white shadow-sm font-semibold rounded-lg text-sm flex items-center gap-1.5 px-4 py-2"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
