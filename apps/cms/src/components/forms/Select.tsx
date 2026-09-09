/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { forwardRef, SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, fullWidth = true, className = '', ...props }, ref) => {
    const widthStyle = fullWidth ? "w-full" : "";
    
    return (
      <div className={`flex flex-col gap-1.5 ${widthStyle} ${className}`}>
        {label && (
          <label className="text-sm font-medium text-text-dark">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            px-3.5 py-2.5 rounded-lg border text-sm text-text-dark bg-white transition-all duration-200 outline-none w-full cursor-pointer appearance-none
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
              : 'border-border-gray focus:border-primary-red focus:ring-2 focus:ring-red-50'
            }
            placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed
          `}
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 14px center',
            backgroundSize: '16px'
          }}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <span className="text-xs text-red-600 font-medium">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
