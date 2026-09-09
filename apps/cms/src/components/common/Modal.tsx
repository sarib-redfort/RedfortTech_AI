/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string; // e.g. "max-w-2xl"
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-xl",
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl ${maxWidth} w-full relative z-10 flex flex-col`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-gray-100">
              <h3 className="text-base font-bold text-text-dark tracking-tight">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-text-gray hover:text-text-dark transition-colors rounded-lg p-1 hover:bg-gray-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
