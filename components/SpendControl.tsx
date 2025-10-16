"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatCurrency, calculatePercentage } from "@/lib/utils";
import { SpendControlData } from "@/lib/types";

interface SpendControlProps {
  data: SpendControlData;
  className?: string;
  onLimitChange?: (
    memberId: string,
    period: "daily" | "weekly" | "monthly",
    newLimit: number
  ) => void;
  onPeriodChange?: (
    memberId: string,
    period: "daily" | "weekly" | "monthly"
  ) => void;
}

export default function SpendControl({
  data,
  className,
  onLimitChange,
  onPeriodChange,
}: SpendControlProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState(data.period);

  const getCurrentLimit = () => {
    switch (selectedPeriod) {
      case "daily":
        return data.dailyLimit || 0;
      case "weekly":
        return data.weeklyLimit || 0;
      case "monthly":
        return data.monthlyLimit || 0;
    }
  };

  const currentLimit = getCurrentLimit();
  const spendPercentage = calculatePercentage(data.currentSpending, currentLimit);
  const remaining = currentLimit - data.currentSpending;

  const getStatusColor = () => {
    if (spendPercentage < 70) return "success";
    if (spendPercentage < 90) return "warning";
    return "error";
  };

  const statusColors = {
    success: {
      bg: "bg-green-500",
      text: "text-green-600 dark:text-green-400",
      border: "border-green-500",
    },
    warning: {
      bg: "bg-yellow-500",
      text: "text-yellow-600 dark:text-yellow-400",
      border: "border-yellow-500",
    },
    error: {
      bg: "bg-red-500",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-500",
    },
  };

  const status = getStatusColor();
  const colors = statusColors[status];

  const handleEditClick = () => {
    setEditValue(currentLimit.toString());
    setIsEditing(true);
  };

  const handleSave = () => {
    const newLimit = parseFloat(editValue);
    if (!isNaN(newLimit) && newLimit > 0) {
      onLimitChange?.(data.memberId, selectedPeriod, newLimit);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue("");
  };

  const handlePeriodChange = (period: "daily" | "weekly" | "monthly") => {
    setSelectedPeriod(period);
    onPeriodChange?.(data.memberId, period);
  };

  const periodLabels = {
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Spending Control
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {data.memberName}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEditClick}
          className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
          aria-label="Edit limit"
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
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </motion.button>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          {(["daily", "weekly", "monthly"] as const).map((period) => (
            <motion.button
              key={period}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePeriodChange(period)}
              className={cn(
                "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                selectedPeriod === period
                  ? "bg-blue-600 text-white dark:bg-blue-500"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              )}
            >
              {periodLabels[period]}
            </motion.button>
          ))}
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Current Spending
            </span>
            <span className={cn("text-2xl font-bold", colors.text)}>
              {formatCurrency(data.currentSpending)}
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(spendPercentage, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={cn("h-full rounded-full", colors.bg)}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {spendPercentage}% of limit
            </span>
            <span className={cn("font-semibold", colors.text)}>
              {formatCurrency(remaining)} left
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {periodLabels[selectedPeriod]} Limit
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    $
                  </span>
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Save
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {periodLabels[selectedPeriod]} Limit
                </span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(currentLimit)}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>
          {remaining >= 0
            ? "Spending within limit"
            : "Spending exceeds limit"}
        </span>
      </div>
    </motion.div>
  );
}
