/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Button from '../forms/Button';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: DeleteModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
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
            className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-2xl max-w-md w-full relative z-10 flex flex-col items-center text-center"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-text-gray hover:text-text-dark transition-colors rounded-lg p-1 hover:bg-gray-50"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Warn Banner Icon */}
            <div className="w-14 h-14 bg-red-50 text-primary-red rounded-full flex items-center justify-center mb-4 border border-red-100">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-text-dark tracking-tight">
              Delete Confirmation
            </h3>
            <p className="text-sm text-text-gray mt-2 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-text-dark font-semibold">"{itemName}"</strong>? 
              This action is destructive and cannot be reversed.
            </p>

            {/* Buttons */}
            <div className="flex gap-3 mt-6 w-full">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                Delete
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
