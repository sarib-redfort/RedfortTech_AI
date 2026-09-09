/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  isLoading?: boolean;
}

export default function StatCard({
  label,
  value,
  change,
  isPositive = true,
  icon: IconComponent,
  iconColor,
  iconBg,
  isLoading = false,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm shadow-gray-100/50 flex justify-between items-start transition-all"
    >
      <div className="space-y-2 flex-1">
        <span className="text-xs font-semibold text-text-gray tracking-wider uppercase">
          {label}
        </span>
        {isLoading ? (
          <div className="space-y-2 pt-1">
            <div className="h-7 w-20 rounded bg-gray-200 animate-pulse" />
            <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold tracking-tight text-text-dark">
              {value}
            </h3>
            {change ? (
              <p className="text-xs font-medium">
                <span className={isPositive ? 'text-emerald-600' : 'text-red-500'}>
                  {change}
                </span>
              </p>
            ) : null}
          </>
        )}
      </div>

      <div className={`p-3 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center`}>
        <IconComponent className="w-5 h-5" />
      </div>
    </motion.div>
  );
}
