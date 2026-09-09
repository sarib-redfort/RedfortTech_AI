/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'motion/react';

// Motion redefines the drag and animation handlers with its own signatures,
// so the conflicting DOM versions are omitted from the inherited props.
type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
>;

interface ButtonProps extends NativeButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: any) => void;
}

export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseStyle = "flex items-center justify-center font-medium rounded-lg px-4 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red disabled:opacity-50 disabled:cursor-not-allowed text-sm";
  
  const variants = {
    primary: "bg-primary-red hover:bg-primary-red-hover text-white shadow-sm border border-transparent",
    secondary: "bg-gray-100 hover:bg-gray-200 text-text-dark border border-transparent",
    outline: "bg-white hover:bg-gray-50 text-text-dark border border-border-gray",
    danger: "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <motion.button
      type={type}
      disabled={disabled || isLoading}
      whileHover={!disabled && !isLoading ? { scale: 1.01 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.99 } : {}}
      className={`${baseStyle} ${variants[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}
