/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, rightIcon, fullWidth = true, className = '', ...props }, ref) => {
    const widthStyle = fullWidth ? "w-full" : "";
    
    return (
      <div className={`flex flex-col gap-1.5 ${widthStyle} ${className}`}>
        {label && (
          <label className="text-sm font-medium text-text-dark">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-text-gray pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              px-3.5 py-2.5 rounded-lg border text-sm text-text-dark bg-white transition-all duration-200 outline-none w-full
              ${icon ? 'pl-11' : ''}
              ${rightIcon ? 'pr-11' : ''}
              ${error 
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                : 'border-border-gray focus:border-primary-red focus:ring-2 focus:ring-red-50'
              }
              placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <span className="text-xs text-red-600 font-medium animate-fade-in">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
