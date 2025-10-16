"use client";

import { motion } from "framer-motion";
import { cn, formatCurrency, calculatePercentage } from "@/lib/utils";
import { SpendChartData } from "@/lib/types";

interface SpendChartProps {
  data: SpendChartData;
  className?: string;
  onCategoryClick?: (category: string) => void;
}

export default function SpendChart({
  data,
  className,
  onCategoryClick,
}: SpendChartProps) {
  const overallPercentage = calculatePercentage(
    data.totalSpent,
    data.totalBudget
  );

  const getStatusColor = () => {
    if (overallPercentage < 70) return "text-green-600 dark:text-green-400";
    if (overallPercentage < 90) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getProgressColor = () => {
    if (overallPercentage < 70) return "bg-green-500";
    if (overallPercentage < 90) return "bg-yellow-500";
    return "bg-red-500";
  };

  const periodLabel = {
    daily: "Today",
    weekly: "This Week",
    monthly: "This Month",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700",
        className
      )}
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Spending Overview
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {periodLabel[data.period]}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(data.totalSpent)}
          </span>
          <span className="text-lg text-gray-500 dark:text-gray-400">
            / {formatCurrency(data.totalBudget)}
          </span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(overallPercentage, 100)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn("h-full rounded-full", getProgressColor())}
          />
        </div>

        <div className="flex justify-between items-center mt-2">
          <span className={cn("text-sm font-semibold", getStatusColor())}>
            {overallPercentage}% used
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {formatCurrency(data.totalBudget - data.totalSpent)} remaining
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          By Category
        </h4>

        {data.categories.map((category, index) => {
          const categoryPercentage = calculatePercentage(
            category.amount,
            data.totalBudget
          );

          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={cn(
                "group cursor-pointer",
                onCategoryClick && "hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 -mx-2 transition-colors"
              )}
              onClick={() => onCategoryClick?.(category.name)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(category.amount)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({categoryPercentage}%)
                  </span>
                </div>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${categoryPercentage}%` }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {data.categories.length === 0 && (
        <div className="text-center py-8">
          <svg
            className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No spending data available
          </p>
        </div>
      )}
    </motion.div>
  );
}
