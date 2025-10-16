"use client";

import { motion } from "framer-motion";
import { cn, formatCurrency, getInitials, calculatePercentage } from "@/lib/utils";
import { FamilyCardData } from "@/lib/types";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/constants";

interface FamilyCardProps {
  data: FamilyCardData;
  className?: string;
  onClick?: (id: string) => void;
  onEdit?: (id: string) => void;
  onToggleStatus?: (id: string, isActive: boolean) => void;
}

export default function FamilyCard({
  data,
  className,
  onClick,
  onEdit,
  onToggleStatus,
}: FamilyCardProps) {
  const spendPercentage = calculatePercentage(
    data.spendLimit - data.balance,
    data.spendLimit
  );

  const getSpendColor = () => {
    if (spendPercentage < 70) return "bg-green-500";
    if (spendPercentage < 90) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(data.id);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(data.id);
    }
  };

  const handleToggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleStatus) {
      onToggleStatus(data.id, !data.isActive);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700",
        "cursor-pointer hover:shadow-lg transition-shadow relative overflow-hidden",
        !data.isActive && "opacity-60",
        className
      )}
      onClick={handleCardClick}
    >
      {!data.isActive && (
        <div className="absolute top-2 right-2">
          <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
            Inactive
          </span>
        </div>
      )}

      <div className="flex items-start gap-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="relative flex-shrink-0"
        >
          {data.avatar ? (
            <img
              src={data.avatar}
              alt={data.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl ring-2 ring-gray-200 dark:ring-gray-700">
              {getInitials(data.name)}
            </div>
          )}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800",
              data.isActive ? "bg-green-500" : "bg-gray-400"
            )}
          />
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {data.name}
            </h3>
            <button
              onClick={handleEditClick}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Edit"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          </div>

          <p className={cn("text-sm font-medium mb-3", ROLE_COLORS[data.role])}>
            {ROLE_LABELS[data.role]}
          </p>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Balance
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(data.balance)}
              </span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Spent: {formatCurrency(data.spendLimit - data.balance)}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Limit: {formatCurrency(data.spendLimit)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${spendPercentage}%` }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className={cn("h-full rounded-full", getSpendColor())}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {spendPercentage}% of limit used
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleStatus}
              className={cn(
                "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                data.isActive
                  ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                  : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
              )}
            >
              {data.isActive ? "Deactivate" : "Activate"}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
