/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { forwardRef, TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, fullWidth = true, className = '', rows = 4, ...props }, ref) => {
    const widthStyle = fullWidth ? "w-full" : "";
    
    return (
      <div className={`flex flex-col gap-1.5 ${widthStyle} ${className}`}>
        {label && (
          <label className="text-sm font-medium text-text-dark">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={`
            px-3.5 py-2.5 rounded-lg border text-sm text-text-dark bg-white transition-all duration-200 outline-none w-full resize-none
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
              : 'border-border-gray focus:border-primary-red focus:ring-2 focus:ring-red-50'
            }
            placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed
          `}
          {...props}
        />
        {error && (
          <span className="text-xs text-red-600 font-medium">
            {error}
          </span>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
